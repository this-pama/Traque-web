import React, { useEffect, useState } from "react";
import classNames from "classnames";
import useSWR, { trigger } from "swr";
import { Button, Loading, Modal, List, ListItem, Icon, ReduxFormWrapper, } from "@wfp/ui";
import { iconAddOutline, iconDocument, iconUpload } from "@wfp/icons";

import Dropzone, { useDropzone } from "react-dropzone";
import XLSX from "xlsx";
import { Link } from "react-router-dom";

import TableView from "../../Dashboard/TableView";
import getColumnDefs from "../../shared/columnDefs";
import store from "../../store";
import Can from "../../shared/Can";
import { toast } from "react-toastify";
import axios from "axios";

import Select from "react-select";
import { Form, FormSpy, Field } from "react-final-form";
import { deptType, fileType } from '../../shared/utils'

const filters = [
  {
    title: "Service file",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.type === "Service file",
  },
  {
    title: "Management file",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.type == "Management file",
  },
  {
    title: "Uncategorized file",
    role: "Type",
    amountLabel: "FILE",
    warning: true,
    comparator: (rowData) => rowData.type == null,
  },

  {
    title: "Total files",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.type,
  },
];

const View = ({ props }) => {

  const [isUpload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isBatchUpload, setBatchUpload] = useState(false);
  const [showFailed, setFailed ] = useState(false);
  const [showSuccess, setSuccess ] = useState(false);
  const [ message, setMessage ] = useState('');

  const [ deptList, setDeptList ]= useState([]);
  const [ subDeptList, setSubDeptList ]= useState([]);
  const [ staffList, setStaff ] = useState([]);

  const [ dataValue, setValue ] = useState({});

  const [selectedDepartment, setSelectedDepartment] = useState('1');

  const [ serviceFileType, setServiceType ] = useState([]);

  const storeData = store.getState();
  const { user } = storeData;

  const endpoint = `/v1/file/registry/${user && user._id}`;

  const { data } = useSWR(endpoint);
  const fetchData = () => trigger(endpoint);
  const applications = data ? data.data.data : null;


  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;
  let filePerm = permissions
    ? permissions.includes("createManagementFile")
      ? "createManagementFile"
      : permissions.includes("createServiceFile")
      ? "createServiceFile"
      : "does-not-exit"
    : "does-not-exit";
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: ".xls, .xlsx",
    maxFiles: 1,
  });

  const files = acceptedFiles.map((file) => (
    <ListItem key={file.path}>
      {file.path} - {Math.round(file.size / 1000)} kB
    </ListItem>
  ));

  const className = classNames("wfp--dropzone__input", {
    "wfp--dropzone__input--drag-active": isDragActive,
  });

  const handleExcelDrop = () => {
    setLoading(true);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString; // !! converts object to boolean
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (e) => {
        var bstr = e.target.result;
        var workbook = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
        var sheet_name_list = workbook.SheetNames[0];
        var jsonFromExcel = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheet_name_list],
          {
            raw: false,
            dateNF: "MM-DD-YYYY",
            header: 1,
            defval: "",
          }
        );
        // console.log("jsonFromExcel object=")
        // console.log(jsonFromExcel)

        const data = jsonFromExcel
          .filter((p) => p.includes("File name") == false)
          .map((p) => ({
            name: p[0],
            fileNo: p[1],
            type: p[2],
            createdDate: p[3],
            telephone: p[4],
          }));

        try {
          axios
            .post(`/v1/file/add/upload/${user && user._id}`, { data })
            .then(() => {
              setMessage("File successfully uploaded")
              setSuccess(true)
              setUpload(false);
              setLoading(false);

              fetchData();
            })
            .catch((err) => {
              setMessage('Error occurred, please try again');
              setFailed(true);
              setLoading(false);
              setUpload(false);
            });
        } catch (err) {
          setMessage('Error occurred, please try again');
          setFailed(true);
          setLoading(false);
          setUpload(false);
        }
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    });
  };

  //for bulk upload of files in transit
  const handleExcelDropForFilesInTransit = () => {
    const { department, subDepartment, receivedBy, type, serviceType } = dataValue;
    setLoading(true);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString; // !! converts object to boolean
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (e) => {
        var bstr = e.target.result;
        var workbook = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
        var sheet_name_list = workbook.SheetNames[0];
        var jsonFromExcel = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheet_name_list],
          {
            raw: false,
            dateNF: "MM-DD-YYYY",
            header: 1,
            defval: "",
          }
        );

        const data = jsonFromExcel
          .filter((p) => p.includes("File name") == false)
          .map((p) => ({
            name: p[0],
            fileNo: p[1],
            createdDate: p[2],
            telephone: p[3],
          }));

        try {
          axios
            .post(`/v1/file/add/upload/department/${user && user._id}`, { 
              data,  
              department: department && department._id, 
              subDepartment: subDepartment && subDepartment._id,
              receivedBy: receivedBy && receivedBy._id,
              type: type && type.label,
              serviceType: serviceType && serviceType._id
            })
            .then(() => {
              setMessage("File successfully uploaded")
              setSuccess(true)
              setBatchUpload(false);
              setLoading(false);

              fetchData();
            })
            .catch((err) => {
              console.log("Ooops! error occurred, please try again", err);
              setMessage('Error occurred, please try again');
              setFailed(true);
              setLoading(false);
              setBatchUpload(false);
            });
        } catch (err) {
          setMessage('Error occurred, please try again');
          setFailed(true);
          setLoading(false);
          setBatchUpload(false);
        }
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    });
  };

  const validate = (values) => {
    const error = {};
    const { department, subDepartment, receivedBy } = values;

    if(department != undefined && receivedBy != undefined){
      console.log("kkkkkk")
      setValue(values);
    }
    
    if (!department) {
      error.department = {
        value: "Department name is required",
      };
    }

    if (department && department != selectedDepartment) {
      fetchSubDepartment(department);
      setSelectedDepartment(department);
      fetchStaff(department)
    }

    return error;
  };

  const fetchSubDepartment = async (data) => {
    setLoading(true)
    try {
      axios
        .get(`/v1/department/details/${data && data._id}`)
        .then((data) => {
          setSubDeptList(data.data.data.subDepartment)
          setLoading(false);
        })
    } catch (err) {
      console.log("Error while loading department", err);
      setLoading(false);
    }
  };

  const fetchDepartment = async (data) => {
    if(deptList.length <= 0){
      try {
        axios
          .get(`/v1/department/department/ministry/${user && user.ministry}`)
          .then((data) => {
            setDeptList(data.data.data)
            setLoading(false);
          })
          return;
      } catch (err) {
        console.log("Error while loading department", err);
        setLoading(false);
      }
    }
  };

  const fetchStaff = async (data) => {
    setLoading(true)
    try {
      axios
        .get(`/v1/department/staff/${data && data._id}`)
        .then((data) => {
          setStaff(data.data.data.staff)
          setLoading(false);
        })
    } catch (err) {
      console.log("Error while loading department", err);
      setLoading(false);
    }
  };

  const fetchServiceType = async (data) => {
    if(serviceFileType.length <= 0){
      try {
        axios
          .get(`/v1/service/file/${user && user.ministry}`)
          .then((data) => {
            setServiceType(data.data.data)
            setLoading(false);
          })
      } catch (err) {
        console.log("Error while loading department", err);
        setLoading(false);
      }
    }
  };

  useEffect(()=>{
    fetchDepartment();
    fetchServiceType();
  },[deptList, subDeptList, selectedDepartment, dataValue, serviceFileType ])

  return (
    <>
      <div id="export-button-portal">
      <Can
          rules={permissions}
          userRole={userRole}
          perform={'canBatchUploadToDepartment'}
          yes={() => (
              <Button
                onClick={() => setBatchUpload(true)}
                icon={iconUpload}
                // kind="secondary"
                small
              >
                History batch upload
              </Button>
            )}
        />
        
        <span style={{ paddingRight: 20 }} />
        <Can
          rules={permissions}
          userRole={userRole}
          perform={filePerm}
          yes={() => (
            <>
              <Button
                onClick={() => setUpload(true)}
                icon={iconUpload}
                // kind="secondary"
                small
              >
                Batch upload
              </Button>

              <span style={{ paddingRight: 20 }} />
              <Button
                onClick={(data) => {
                  props.history.push("/create-file");
                }}
                icon={iconAddOutline}
                kind="secondary"
                small
              >
                Create file
              </Button>
            </>
          )}
        />
      </div>
      <TableView
        title={"Registry"}
        data={applications && applications.reverse()}
        filters={filters}
        fetchData={fetchData}
        gridConfig={getColumnDefs("registryFile", fetchData)}
        exportFileName={"Registry files"}
      />

      <Modal
        open={isUpload}
        primaryButtonText="Upload"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleExcelDrop}
        onRequestClose={() => setUpload(false)}
        modalLabel="Bulk upload file"
        wide={false}
        type="info"
      >
        <Loading active={loading} withOverlay={true} />

        <>
          <section className="wfp--dropzone">
            <div {...getRootProps({ isDragActive, className: className })}>
              <input {...getInputProps()} />
              <Icon className="wfp--dropzone__icon" icon={iconUpload} />
              <div>Drop files or click here to upload</div>
            </div>
            <aside className="wfp--dropzone__file-list">
              <h4>Files</h4>
              <List>{files}</List>
            </aside>
          </section>

          <div style={{ marginTop: 40 }}>
            <Link to="/Create_file_bulk_upload.xlsx" download target="_blank">
              <div className="wfp--link">Download template</div>
            </Link>
          </div>
        </>
      </Modal>



      {/* Bulk Upload for files in transit */}
      <Modal
        open={isBatchUpload}
        primaryButtonText="Upload"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={
          dataValue && dataValue.department && files.length > 0
          && dataValue.receivedBy
          ? false 
          : true
        }
        onRequestSubmit={handleExcelDropForFilesInTransit}
        onRequestClose={() => setBatchUpload(false)}
        modalLabel="Bulk upload file to specific destination"
        wide={true}
        type="info"
      >
        <Loading active={loading} withOverlay={true} />

        <>
        <Form
          onSubmit={()=>console.log('jj')}
          initialValues={{}}
          validate={(values) => validate(values)}
          render={({ values, onSave, valid, reset }) => (
            <form>
              <Field
                component={ReduxFormWrapper}
                name="type"
                labelText="File Type"
                placeholder="Select file type"
              >
                {({ input, meta }) => (
                  <>
                    <div className="wfp--label">File type</div>
                    <Select
                      className="wfp--react-select-container auto-width"
                      classNamePrefix="wfp--react-select"
                      closeMenuOnSelect={true}
                      options={fileType}
                      getOptionValue={(option) => option["value"]}
                      getOptionLabel={(option) => option["label"]}
                      {...input}
                      {...meta}
                    />
                  </>
                )}
              </Field>
              <div style={{ paddingBottom: 20 }} />

              <Field
                component={ReduxFormWrapper}
                name="serviceType"
                labelText="File Type"
                placeholder="Select file type"
              >
                {({ input, meta }) => (
                  <>
                    <div className="wfp--label">Service file type</div>
                    <Select
                      className="wfp--react-select-container auto-width"
                      classNamePrefix="wfp--react-select"
                      closeMenuOnSelect={true}
                      options={serviceFileType}
                      getOptionValue={(option) => option["_id"]}
                      getOptionLabel={(option) => option["name"]}
                      {...input}
                      {...meta}
                      isDisabled={values.type
                        && values.type.label == "Service file" ? false : true }
                    />
                  </>
                )}
              </Field>
              <div style={{ paddingBottom: 20 }} />

              <Field
                component={ReduxFormWrapper}
                name="department"
                labelText="Department"
                placeholder="Select destination department"
              >
                {({ input, meta }) => (
                  <>
                    <div className="wfp--label ">Select Department</div>
                    <Select
                      className="wfp--react-select-container auto-width"
                      classNamePrefix="wfp--react-select"
                      closeMenuOnSelect={true}
                      options={deptList}
                      getOptionValue={(option) => option["_id"]}
                      getOptionLabel={(option) => option["name"]}
                      {...input}
                      {...meta}
                    />
                  </>
                )}
              </Field>

              <div style={{ paddingBottom: 20 }} />
              <Field
                component={ReduxFormWrapper}
                name="subDepartment"
                labelText="Sub Department"
                placeholder="Select destination sub department"
              >
                {({ input, meta }) => (
                  <>
                    <div className="wfp--label ">Select Sub Department</div>
                    <Select
                      className="wfp--react-select-container auto-width"
                      classNamePrefix="wfp--react-select"
                      closeMenuOnSelect={true}
                      options={subDeptList}
                      getOptionValue={(option) => option["_id"]}
                      getOptionLabel={(option) => option["name"]}
                      {...input}
                      {...meta}
                    />
                  </>
                )}
              </Field>

              <div style={{ paddingBottom: 20 }} />
              <Field
                component={ReduxFormWrapper}
                name="receivedBy"
                labelText="Select staff"
                placeholder="Select staff"
              >
                {({ input, meta }) => (
                  <>
                    <div className="wfp--label ">Select staff </div>
                    <Select
                      className="wfp--react-select-container auto-width"
                      classNamePrefix="wfp--react-select"
                      closeMenuOnSelect={true}
                      options={staffList}
                      getOptionValue={(option) => option["_id"]}
                      getOptionLabel={(option) => option["firstName"]
                      + " " + option["lastName"]}
                      {...input}
                      {...meta}
                    />
                  </>
                )}
              </Field>
              </form>
            )}
          />

          <div style={{ paddingBottom: 40 }} />
          <section className="wfp--dropzone">
            <div {...getRootProps({ isDragActive, className: className })}>
              <input {...getInputProps()} />
              <Icon className="wfp--dropzone__icon" icon={iconUpload} />
              <div>Drop files or click here to upload</div>
            </div>
            <aside className="wfp--dropzone__file-list">
              <h4>Files</h4>
              <List>{files}</List>
            </aside>
          </section>

          <div style={{ marginTop: 40 }}>
            <Link to="/Bulk_upload_for_file_history.xlsx" download target="_blank">
              <div className="wfp--link">Download template</div>
            </Link>
          </div>
        </>
      </Modal>


            <Modal
              modalHeading=""
              modalLabel="SUCCESS"
              primaryButtonText="OK"
              onRequestClose={()=>setSuccess(false)}
              onRequestSubmit={()=>setSuccess(false)}
              open={showSuccess}
            >
              {message}
            </Modal>

            <Modal
              modalHeading=""
              modalLabel="Ooops!!!"
              primaryButtonText="Try again"
              onRequestClose={()=>setFailed(false)}
              onRequestSubmit={()=>setFailed(false)}
              open={showFailed}
              type='danger'
              danger
            >
              {message}
            </Modal>
    </>
  );
};

export default View;
