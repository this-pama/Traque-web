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

    const endpoint = `/v1/file/sent/${user && user._id}`

    const { data } = useSWR(endpoint)
    const fetchData = () => true;
    const applications = data ? data.data.data : null;
    const mapData = applications && applications.map(p=>
        ({
            _id: p._id,
            fileNo: p.fileNo,
            name: p.name,
            type: p.type,
            sent: p.sent.filter(p => p.sentBy && p.sentBy._id == user._id)
        })
    )

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
            title={'Sent files'}
            data={mapData}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('sentFile', fetchData)}
            exportFileName={'sent files'}
        />
        </>
    )
}

export default View
