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

    const endpoint = `/v1/file/outgoing/${user && user._id}`

    const { data } = useSWR(endpoint)
    const fetchData = () => true;
    const applications = data ? data.data.data : null;
    return (
        <>
        <div id="export-button-portal" >
            <Button
               onClick={(data)=> {
                   props.history.push('/create-department')
               }}
                icon={iconAddOutline}
                kind="secondary"
                small
            >
                Create file
            </Button>
        </div>
        <TableView
            title={'Outgoing files'}
            data={applications}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('outgoingFile', fetchData)}
            exportFileName={'incoming files'}
        />
        </>
    )
}

export default View
