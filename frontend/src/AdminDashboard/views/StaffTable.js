import React from 'react'
import TableView from '../../Dashboard/TableView'
import getColumnDefs from '../../shared/columnDefs'
import { Button } from '@wfp/ui'
import {iconAddOutline, iconDocument} from '@wfp/icons';
import useSWR, { trigger } from 'swr'
import Can from '../../shared/Can'

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
    const permission = user && user.userRole ? user.userRole.permission : [];
    const userRole = user && user.userRole ? user.userRole.name : null;

    const endpoint = `/v1/user/staff-list/${user && user._id}`
    const { data } = useSWR(endpoint)
    const fetchData = () => trigger(endpoint)
    const applications = data ? data.data.data : null;

    return (
        <>
        <div id="export-button-portal" >
        <Can
            rules={permission}
            userRole={userRole}
            perform="viewIncoming"
            yes={() => (
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
            )}
        />
            <span style={{ paddingLeft: 20 }} />
        <Can
            rules={permission}
            userRole={userRole}
            perform="createUser"
            yes={() => (
            <Button
                onClick={()=> props.history.push('/create-staff')}
                icon={iconAddOutline}
                kind="secondary"
                small
            >
                Create staff
            </Button>
            )}
        />
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
