import React, { useState } from 'react'
import classNames from 'classnames';
import useSWR, { trigger } from 'swr'
import { Button, Loading, Modal, List, ListItem, Icon, } from '@wfp/ui'
import {iconAddOutline, iconDocument, iconUpload } from '@wfp/icons';

import Dropzone, { useDropzone } from 'react-dropzone';
import XLSX from 'xlsx' 
import { Link } from 'react-router-dom'

import TableView from '../../Dashboard/TableView'
import getColumnDefs from '../../shared/columnDefs'
import store from '../../store'
import Can from '../../shared/Can'
import { toast } from 'react-toastify'
import axios from 'axios'

const filters = [
    {
        title: 'Service file',
        role: 'Type',
        amountLabel: 'FILE',
        comparator: (rowData) =>
            rowData.type === "Service file"
    },
    {
        title: 'Management file',
        role: 'Type',
        amountLabel: 'FILE',
        comparator: (rowData) =>
        rowData.type == 'Management file',
    },
    {
        title: 'Uncategorized file',
        role: 'Type',
        amountLabel: 'FILE',
        warning: true,
        comparator: (rowData) =>
        rowData.type == null
    },

    {
        title: 'Total files',
        role: 'Type',
        amountLabel: 'FILE',                 
        comparator: (rowData) =>
        rowData.type 
    },
]


const View = ({props}) => {

    const [ isUpload, setUpload ]= useState(false);
    const [ loading, setLoading ]= useState(false);

    const storeData = store.getState();
    const {user} = storeData;

    const endpoint = `/v1/file/registry/${user && user._id}`

    const { data } = useSWR(endpoint)
    const fetchData = () => trigger(endpoint);
    const applications = data ? data.data.data : null;

    const permissions = user && user.userRole ? user.userRole.permission : [];
    const userRole = user && user.userRole ? user.userRole.name : null;
    let filePerm = permissions ? permissions.includes('createManagementFile')
                    ? 'createManagementFile'
                    : permissions.includes('createServiceFile')
                    ? 'createServiceFile'
                    : 'does-not-exit'
                    : 'does-not-exit';
        const {
            acceptedFiles,
            fileRejections,
            getRootProps,
            getInputProps,
            isDragActive,
            } = useDropzone({
            accept: '.xls, .xlsx',
            maxFiles: 1
        });

        const files = acceptedFiles.map((file) => (
            <ListItem key={file.path}>
              {file.path} - {Math.round(file.size / 1000)} kB
            </ListItem>
          ));
        
        const className = classNames('wfp--dropzone__input', {
        'wfp--dropzone__input--drag-active': isDragActive,
        });

        const handleExcelDrop = () => {
            setLoading(true)
             acceptedFiles.forEach((file) => { 
                const reader = new FileReader() 
                const rABS = !!reader.readAsBinaryString;  // !! converts object to boolean 
                reader.onabort = () => console.log('file reading was aborted')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = (e) => {
                    var bstr = e.target.result; 
                    var workbook = XLSX.read(bstr, { type: rABS ? "binary" : "array" })
                    var sheet_name_list = workbook.SheetNames[0];
                    var jsonFromExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list], {
                        raw: false,
                        dateNF: "MM-DD-YYYY",
                        header:1,
                        defval: ""
                    })
                    // console.log("jsonFromExcel object=")
                    // console.log(jsonFromExcel)

                    const data = jsonFromExcel
                        .filter(p=> p.includes('File name') == false )
                        .map(p=>({
                            name: p[0],
                            fileNo: p[1],
                            type: p[2],
                            createdDate: p[3],
                        }))
        
                    try{
                        axios.post(`/v1/file/add/upload/${user && user._id}`, { data })
                        .then(()=> {
                            toast('File successfully uploaded', {closeOnClick: true, autoClose: 1000 });
                            setUpload(false)
                            setLoading(false)

                            fetchData();
                        })
                        .catch(err=>{
                            console.log('Ooops! error occurred, please try again', err)
                            toast.error('Ooops! error occurred, please try again', {closeOnClick: true, autoClose: 1000 });
                            setLoading(false)
                            setUpload(false)
                        })
                        
                    }
                    catch (err) {
                        console.log('Ooops! error occurred, please try again', err)
                        toast.error('Ooops! error occurred, please try again', {closeOnClick: true, autoClose: 1000 });
                        setLoading(false)
                        setUpload(false)
                    }
        
                  }
                  if (rABS) reader.readAsBinaryString(file);
                  else reader.readAsArrayBuffer(file);
             })
          }


    return (
        <>
            <div id="export-button-portal" >
            <Can
                rules={permissions}
                userRole={userRole}
                perform={filePerm}
                yes={() => (
                <>
                    <Button
                        onClick={()=> setUpload(true)}
                        icon={iconUpload }
                        // kind="secondary"
                        small
                    >
                        Batch upload
                    </Button>
                    
                    <span style={{ paddingRight: 20}} />
                    <Button
                    onClick={(data)=> {
                        props.history.push('/create-file')
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
            title={'Registry'}
            data={applications && applications.reverse()}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('registryFile', fetchData)}
            exportFileName={'Registry files'}
        />

            <Modal
                open={isUpload}
                primaryButtonText="Upload"
                secondaryButtonText="Cancel"
                onRequestSubmit={handleExcelDrop}
                onRequestClose={()=>setUpload(false)}
                modalLabel="Bulk upload file"
                wide={false}
                type='info'
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
                    <Link to="/Create_file_bulk_upload.xlsx"  download target="_blank" >
                        <div className='wfp--link'>
                            Download template
                        </div>
                    </Link>
                </div>
            </>
            </Modal>
        </>
    )
}

export default View
