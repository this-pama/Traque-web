import React from 'react'
import useSWR, { trigger } from 'swr'
import { Button } from '@wfp/ui'
import {iconAddOutline, iconDocument} from '@wfp/icons';

import TableView from '../../Dashboard/TableView'
import getColumnDefs from '../../shared/columnDefs'
import store from '../../store'

const filters = [
    {
        title: 'Service file',
        role: 'Type',
        amountLabel: 'FILE',
        comparator: (rowData) =>
            rowData.type == "Service file"
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

    const storeData = store.getState();
    const {user} = storeData;

    const endpoint = `/v1/file/pending/${user && user._id}`

    const { data } = useSWR(endpoint)
    const fetchData = () => true;
    const applications = data ? data.data.data : null;
    let filePerm = user 
        && user.permission
        ? user.permission.createManagementFile
        || user.permission.createServiceFile
        ? true
        : false
        : false;
        
    return (
        <>
        { filePerm && (
            <div id="export-button-portal" >
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
            </div>
        )}
        <TableView
            title={'In-Process files'}
            data={applications}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('inProcessFile', fetchData)}
            exportFileName={'In-process files'}
        />
        </>
    )
}

export default View
