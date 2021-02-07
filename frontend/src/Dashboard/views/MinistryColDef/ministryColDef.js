import { globalFilterParams, cellRenderBasedOnKey } from '../../../shared/utils'
import moment from 'moment'
import React from 'react'


export const name = () => ({
    headerName: 'Ministry name',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'name',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const createdAt = () => ({
    headerName: 'Created At',
    // width: 140,
    editable: false,
    lockPosition: true,
    field: 'createdAt',
    keyCreator: cellRenderBasedOnKey,
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
    __isExported: true,
    comparator: (date1, date2) => new Date(date1) - new Date(date2),
    valueGetter: (params) => {
        return moment(params.data.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
})

export const admin = () => ({
    headerName: 'Designated Admin',
    // width: 140,
    editable: false,
    lockPosition: true,
    valueGetter: ({ data }) => 
        data.userId 
        ? `${data.userId.firstName} ${data.userId.lastName}`
        : null,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'userId',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const action = (onValueChange) => ({
    headerName: 'Action',
    lockPosition: true,

    __isExported: false,
    hide: false,
    editable: false,
    field: 'action',
    cellRenderer: "MinistryAction",
    cellRendererParams: ({data}) => ({
        onValueChange,
        // id: data.sbp_request_id
    }),
    filter: false,
})


export default [
    name,
    admin,
    createdAt,
    action
]