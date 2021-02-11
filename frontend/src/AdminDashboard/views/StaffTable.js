import React from 'react'
import TableView from '../../Dashboard/TableView'
import getColumnDefs from '../../shared/columnDefs'
import { Button } from '@wfp/ui'
import {iconAddOutline, iconDocument} from '@wfp/icons';
import useSWR, { trigger } from 'swr'

const filters = [
    {
        title: 'Pending Screening',
        role: 'Screener',
        warning: true,
        comparator: (rowData) =>
            rowData.lastName == null,
    },
   
]


const Admin = ({props}) => {
    const {user} = props;

    const endpoint = `/v1/user/staff-list/${user && user._id}`
    const { data } = useSWR(endpoint)
    const fetchData = () => trigger(endpoint)
    const applications = data ? data.data.data : null;

    return (
        <>
        <div id="export-button-portal" >
            <Button
                onClick={(data)=> {
                    props.history.push(`/create-sub-department/`)
                }}
                    icon={iconDocument}
                    kind="secondary"
                    small
            >
                    Manage file
            </Button>
            <span style={{ paddingLeft: 20 }} />

            <Button
                onClick={()=> props.history.push('/create-staff')}
                icon={iconAddOutline}
                kind="secondary"
                small
            >
                Create staff
            </Button>
        </div>
        <TableView
            title={'Staff list'}
            data={applications}
            filters={[]}
            fetchData={fetchData}
            gridConfig={getColumnDefs('staff', fetchData)}
            // exportFileName={'Admin details'}
        />
        </>
    )
}

export default Admin
