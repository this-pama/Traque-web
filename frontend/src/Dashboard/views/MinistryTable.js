import React from 'react'
import useSWR, { trigger } from 'swr'
import { Button } from '@wfp/ui'
import {iconAddOutline} from '@wfp/icons';

import TableView from '../TableView'
import getColumnDefs from '../../shared/columnDefs'
import Can from '../../shared/Can'

const filters = [
    {
        title: 'Assigned',
        role: 'Admin',
        comparator: (rowData) =>
            rowData.userId.firstName != null
    },
    {
        title: 'Not assigned',
        role: 'Admin',
        warning: true,
        comparator: (rowData) =>
        rowData.userId.firstName == null
    },
]
const endpoint = '/v1/ministry/'

const MinistryView = ({props}) => {
    const { data } = useSWR(endpoint)
    const fetchData = () => true
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
                perform={'manageMinistry'}
                yes={() => (
                <Button
                onClick={(data)=> {
                    console.log(data)
                    props.history.push('/create-ministry')
                }}
                    icon={iconAddOutline}
                    kind="secondary"
                    small
                >
                    Create ministry
                </Button>
                )}
        />
        </div>
        <TableView
            title={'Created ministries'}
            data={applications}
            filters={[]}
            fetchData={fetchData}
            gridConfig={getColumnDefs('ministry', fetchData)}
            exportFileName={'Ministry details'}
        />
        </>
    )
}

export default MinistryView
