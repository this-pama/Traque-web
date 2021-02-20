import React from 'react'
import useSWR, { trigger } from 'swr'
import { Button } from '@wfp/ui'
import {iconAddOutline, iconDocument} from '@wfp/icons';

import TableView from '../../Dashboard/TableView'
import getColumnDefs from '../../shared/columnDefs'
import store from '../../store'
import Can from '../../shared/Can'

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
    const permissions = user && user.userRole ? user.userRole.permission : [];
    const userRole = user && user.userRole ? user.userRole.name : null;


    const endpoint = `/v1/file/incoming/${user && user._id}`

    const { data } = useSWR(endpoint)
    const fetchData = () => trigger(endpoint)
    const applications = data ? data.data.data : null;

    let filePerm = permissions ? permissions.includes('createManagementFile')
                    ? 'createManagementFile'
                    : permissions.includes('createServiceFile')
                    ? 'createServiceFile'
                    : 'does-not-exit'
                    : 'does-not-exit';

    return (
        <>
            <div id="export-button-portal" >
            <Can
                rules={permissions}
                userRole={userRole}
                perform={filePerm}
                yes={() => (
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
                )}
            />
            </div>
        
        <TableView
            title={'Incoming files'}
            data={applications}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('incomingFile', fetchData)}
            exportFileName={'incoming files'}
        />
        </>
    )
}

export default View
