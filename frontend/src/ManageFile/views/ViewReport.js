import React, { useState, useEffect } from "react";
import useSWR, { trigger } from "swr";
import { Button, ReduxFormWrapper, Loading } from "@wfp/ui";
import { iconAddOutline, iconDocument } from "@wfp/icons";

import { Row, Col } from "react-flexbox-grid";
import Select from "react-select";
import { Form, FormSpy, Field } from "react-final-form";
import axios from 'axios'

import store from "../../store";
import Can from "../../shared/Can";
import Filter from './Filter'

import { Doughnut, Pie, Bar, Radar } from 'react-chartjs-2';

const filters = [
  {
    title: "Avg processed file/day",
    role: "Type",
    amountLabel: "FILE",
    value: 'avgPerDay'
  },
  {
    title: "Avg processed file/week",
    role: "Type",
    amountLabel: "FILE",
    // warning: true,
    value: 'avgPerWeek'
  },
  {
    title: "Avg processed file/month",
    role: "Type",
    amountLabel: "FILE",
    value: 'avgPerMonth'
  },
  {
    title: "Total files",
    role: "Type",
    amountLabel: "FILE",
    value: 'totalFile',
  },
  {
    title: "Total files exceeded SLA",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'totalFileExceedSla'
  },
  {
    title: "SLA between 0-30 days",
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSla30'
  },
  {
    title: "SLA Between 31-60 days",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSlaBtw30_60'
  },
  {
    title: "SLA Between 61-90 days",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSlaBtw60_90'
  },
  {
    title: "SLA between 91-120 days",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSla90'
  },
  {
    title: "SLA above 121 days",
    role: "Type",
    amountLabel: "FILE",
    value: 'slaAbove121'
  },  
];

const View = ({ props }) => {
  const storeData = store.getState();
  const { user } = storeData;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  const [ deptList, setDeptList ] = useState([])
  const [ serviceTypeList, setServiceTypeList ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ formData, setFormData ] = useState({});
  const [ formDepartment, setFormDepartment ] = useState(null);
  const [ formSubDepartment , setFormSubDepartment ] = useState(null);
  const [ formService , setFormService ] = useState(null);
  const [ office, setOffice ] = useState([]);

  const endpoint = `/v1/settings/report/${user && user.ministry}/${formDepartment && formDepartment._id}/${formService && formService._id}/${formSubDepartment && formSubDepartment._id}`;

  const { data } = useSWR(endpoint);
  const fetchData = () => trigger(endpoint);
const applications = data ? data.data : null;

  const fetchServiceTypeList = async (p) => {
    if(serviceTypeList && serviceTypeList.length > 0) return;
    try {
      axios.get(`/v1/service/file/${user && user.ministry}`).then((data) => {
        setServiceTypeList(data ? data.data.data : []);
      });
    } catch (err) {
      console.log("Error while loading department", err);
    }
  };

  const fetchDepartment = async () => {
    // setLoading(true)
    if(deptList && deptList.length > 0) return;
    try {
      await axios
        .get(`/v1/department`)
        .then((data) => {
          setDeptList( data ? data.data : []);
          setLoading(false);
        });
    } catch (err) {
      console.log("Error while loading department", err);
      // setLoading(false);
    }
  };

  const fetchOffice = async (p) => {
    try {
      await axios.get(`/v1/department/details/${p}`).then((data) => {
        setOffice(data ? data.data.data.subDepartment : []);
      });
    } catch (err) {
      console.log("Error while loading department", err);
    }
  };

  useEffect(()=>{
    fetchServiceTypeList();
    fetchDepartment();
  }, [ deptList, serviceTypeList, office, formService, formDepartment, formSubDepartment,
  applications, ])


  const chartData = {
    labels: [
      'Total files exceeded SLA', 
      "SLA between 0-30 days", 
      "SLA Between 31-60 days",
      "SLA Between 61-90 days",
      "SLA between 91-120 days",
      "SLA above 121 days",
      "Avg processed file/day",
      "Avg processed file/week",
      "Avg processed file/month"
    ],
    datasets: [
      {
        label: 'Report Charts',
        data: [ 
          applications ? applications['totalFileExceedSla'] : 0,
          applications ? applications['TtFileExceedSla30'] : 0,
          applications ? applications['TtFileExceedSlaBtw30_60'] : 0,
          applications ? applications['TtFileExceedSlaBtw60_90'] : 0,
          applications ? applications['TtFileExceedSla90'] : 0,
          applications ? applications['slaAbove121'] : 0,
          applications ? applications['avgPerDay'] : 0,
          applications ? applications['avgPerWeek'] : 0,
          applications ? applications['avgPerMonth'] : 0,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 120, 60, 0.2)',
          'rgba(78, 159, 64, 0.2)',
          'rgba(98, 150, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 120, 60, 1)',
          'rgba(78, 159, 64, 1)',
          'rgba(98, 150, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartData2 = {
    labels: [
      'Total files exceeded SLA', 
      "SLA less than 30 days", 
      "SLA Between 30-60 days",
      "SLA Between 60-90 days",
      "SLA Above 90 days",
      "SLA above 121 days",
      "Avg processed file/day",
      "Avg processed file/week",
      "Avg processed file/month"
    ],
    datasets: [
      {
        label: 'Report Charts',
        data: [ 
          applications ? applications['totalFileExceedSla'] : 0,
          applications ? applications['TtFileExceedSla30'] : 0,
          applications ? applications['TtFileExceedSlaBtw30_60'] : 0,
          applications ? applications['TtFileExceedSlaBtw60_90'] : 0,
          applications ? applications['TtFileExceedSla90'] : 0,
          applications ? applications['slaAbove121'] : 0,
          applications ? applications['avgPerDay'] : 0,
          applications ? applications['avgPerWeek'] : 0,
          applications ? applications['avgPerMonth'] : 0,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  }


  return (
    <>
    <Form
        onSubmit={()=>{}}
        // initialValues={formData}
        validate={(values) => {
          const errors = {};
          const { department, subDepartment, service } = values;

          if (!department) {
            errors.department = {
              value: "Department is required",
            };
          }

          if (department && department._id && department != formDepartment) {
            fetchOffice(department && department._id)
            setFormDepartment(department)
            setFormSubDepartment(null);
            setFormService(null)
          }

          if (subDepartment && subDepartment._id && subDepartment != formSubDepartment) {
            setFormSubDepartment(subDepartment)
          }
          
          if (service && service._id && service != formService) {
            setFormService(service)
          }

          return errors;
        }}
        render={({ values, onSave, valid, reset }) => (
          <form>
            <div className='wfp--form__helper-text'>
              Please select the approriate department, office/unit and service to see corresponding reports. 
            </div>
      <Row>
        <Col md={4} sm={4} xs={12}>
        <Field
            component={ReduxFormWrapper}
            name="department"
            labelText="Select department"
            placeholder="Select..."
          >
            {({ input, meta }) => (
              <>
                <div className="wfp--label">Select department</div>
                <Select
                  className="wfp--react-select-container auto-width"
                  classNamePrefix="wfp--react-select"
                  closeMenuOnSelect={true}
                  options={deptList}
                  getOptionValue={(option) => option["_id"]}
                  getOptionLabel={(option) => option["name"]}
                  {...input}
                  {...meta}
                  isClearable
                />
              </>
            )}
          </Field>
        </Col>

        <Col md={4} sm={4} xs={12}>
        <Field
            component={ReduxFormWrapper}
            name="service"
            labelText="Select service"
            placeholder="Select..."
          >
            {({ input, meta }) => (
              <>
                <div className="wfp--label">Select service</div>
                <Select
                  className="wfp--react-select-container auto-width"
                  classNamePrefix="wfp--react-select"
                  closeMenuOnSelect={true}
                  options={serviceTypeList}
                  getOptionValue={(option) => option["_id"]}
                  getOptionLabel={(option) => option["name"]}
                  {...input}
                  {...meta}
                  isClearable
                />
              </>
            )}
          </Field>
        </Col>

        <Col md={4} sm={4} xs={12}>
        <Field
            component={ReduxFormWrapper}
            name="subDepartment"
            labelText="Select office/unit"
            placeholder="Select..."
          >
            {({ input, meta }) => (
              <>
                <div className="wfp--label">Select office/unit</div>
                <Select
                  className="wfp--react-select-container auto-width"
                  classNamePrefix="wfp--react-select"
                  closeMenuOnSelect={true}
                  options={office}
                  getOptionValue={(option) => option["_id"]}
                  getOptionLabel={(option) => option["name"]}
                  {...input}
                  {...meta}
                  isClearable
                />
              </>
            )}
          </Field>
        </Col>
      </Row>
          </form>
        )}
      />

      <div style={{ paddingBottom: 40 }} />
      <Loading active={loading} withOverlay={true} />

      <Filter
        title={"Report"}
        data={applications}
        filters={filters}
        fetchData={fetchData}
        // middle={<p>Test</p>}
      />
      
      <div style={{ paddingBottom: 40 }} />
      {/* { applications && (
      <Row>
        <Col md={6} sm={6} xs={12}>
          <Doughnut 
            data={chartData} 
            options={{ maintainAspectRatio: true }}
          />
        </Col>
        <Col md={6} sm={6} xs={12}>
          <Pie  
            data={chartData} 
            options={{ maintainAspectRatio: true }}
          />
        </Col>
        
        <Col md={12} sm={12} xs={12} />

        <Col md={6} sm={6} xs={12}>
          <Bar  
            data={chartData} 
            options={{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        </Col>
        <Col md={6} sm={6} xs={12}>
          <Radar   
            data={chartData2} 
          />
        </Col>
      </Row>
      )} */}
      
    </>
  );
};

export default View;
