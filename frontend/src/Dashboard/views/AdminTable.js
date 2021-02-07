import React from 'react'
import TableView from '../TableView'
import getColumnDefs from '../../shared/columnDefs'

import useSWR, { trigger } from 'swr'

const filters = [
    {
        title: 'Pending Screening',
        role: 'Screener',
        warning: true,
        comparator: (rowData) =>
            rowData.status.grouping === 'pending_screening_screener',
    },
    {
        title: 'Not recommended',
        role: 'Screener',
        comparator: (rowData) =>
            rowData.status.grouping === 'not_recommended_screener',
    },
    {
        title: 'Pending Release',
        role: 'Director',
        warning: true,
        comparator: (rowData) =>
            rowData.status.grouping === 'pending_release_director',
    },
    {
        title: 'Not Released',
        role: 'Director',
        comparator: (rowData) =>
            rowData.status.grouping === 'not_released_director',
    },
    {
        title: 'Released',
        role: 'Director',
        comparator: (rowData) =>
            rowData.status.grouping === 'released_director',
    },
]
const endpoint = '/api/screening/hr/my-region'

const RegionView = () => {
    const { data } = useSWR(endpoint)
    const fetchData = () => trigger(endpoint)
    const applications = data ? data.data.data : null;

    return (
        <TableView
            title={'Screening Overview'}
            data={applications}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('admin', fetchData)}
            exportFileName={'Admin details'}
        />
    )
}

export default RegionView
