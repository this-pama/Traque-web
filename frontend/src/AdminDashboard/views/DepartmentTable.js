import React from 'react'
import useSWR, { trigger } from 'swr'
import { Button } from '@wfp/ui'
import {iconAddOutline, iconDocument} from '@wfp/icons';

import TableView from '../../Dashboard/TableView'
import getColumnDefs from '../../shared/columnDefs'
import store from '../../store'

const filters = [
    {
        title: 'Agency',
        role: 'Type',
        amountLabel: 'Section',
        comparator: (rowData) =>
            rowData.type == "Agency"
    },
    {
        title: 'Department',
        role: 'Type',
        amountLabel: 'Section',
        comparator: (rowData) =>
        rowData.type == "Department"
    },

    {
        title: 'Unit',
        role: 'Type',
        amountLabel: 'Section',                 
        comparator: (rowData) =>
        rowData.type == "Unit"
    },

    {
        title: 'Uncategorized',
        role: 'Type',
        amountLabel: 'Section',
        warning: true,
        comparator: (rowData) =>
        rowData.type == null
    },
]


const View = ({props}) => {

    const storeData = store.getState();
    const {user} = storeData;

    const endpoint = `/v1/department/department-list/${user && user._id}`

    const { data } = useSWR(endpoint)
    const fetchData = () => true;
    const applications = data ? data.data.data : null;
    return (
        <>
        <div id="export-button-portal" >
            <Button
                onClick={(data)=> {
                    props.history.push(`/file`)
                }}
                    icon={iconDocument}
                    kind="secondary"
                    small
            >
                    Manage file
            </Button>
            <span style={{ paddingLeft: 20 }} />
            <Button
               onClick={(data)=> {
                   props.history.push('/create-department')
               }}
                icon={iconAddOutline}
                kind="secondary"
                small
            >
                Create department
            </Button>
        </div>
        <TableView
            title={'Departments'}
            data={applications}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('department', fetchData)}
            exportFileName={'department details'}
        />
        </>
    )
}

export default View
