import React from 'react'
import TableView from '../TableView'
import getColumnDefs from '../../shared/columnDefs'
import { Button } from '@wfp/ui'
import {iconAddOutline} from '@wfp/icons';
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
const endpoint = '/v1/role'

const Admin = ({props}) => {
    const { data } = useSWR(endpoint)
    const fetchData = () => trigger(endpoint)
    const applications = data ? data.data : null;

    const { user } = props;
    const permissions = user && user.userRole ? user.userRole.permission : [];
    const userRole = user && user.userRole ? user.userRole.name : null;

    return (
        <>
        <div id="export-button-portal" >
            <Can
                rules={permissions}
                userRole={userRole}
                perform={'manageUserRole'}
                yes={() => (
            <Button
                onClick={()=> props.history.push('/create-user-role')}
                icon={iconAddOutline}
                kind="secondary"
                small
            >
                Create user role
            </Button>
                )}
        />
        </div>
        <TableView
            title={'User roles and permissions'}
            data={applications}
            filters={[]}
            fetchData={fetchData}
            gridConfig={getColumnDefs('userRole', fetchData)}
            // exportFileName={'Admin details'}
        />
        </>
    )
}

export default Admin
