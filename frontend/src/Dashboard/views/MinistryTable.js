import React from 'react'
import useSWR, { trigger } from 'swr'

import TableView from '../TableView'
import getColumnDefs from '../../shared/columnDefs'

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
const endpoint = '/v1/ministry/'

const GlobalView = () => {
    const { data } = useSWR(endpoint)
    const fetchData = () => trigger(endpoint)
    const applications = data ? data.data.data : null
    const id = data ? data.data.data.id : null
    const state = data ? data.data.data.state : null

    return (
        <TableView
            title={'Screening Overview 123'}
            data={applications}
            filters={filters}
            fetchData={fetchData}
            gridConfig={getColumnDefs('ministry', fetchData)}
            exportFileName={'Ministry details'}
        />
    )
}

export default GlobalView
