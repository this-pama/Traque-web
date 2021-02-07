import { globalFilterParams, cellRenderBasedOnKey } from '../../../shared/utils'
import moment from 'moment'
import React from 'react'


export const firstName = () => ({
    headerName: 'First name',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'firstName',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const lastName = () => ({
    headerName: 'Last name',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'lastName',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const gender = () => ({
    headerName: 'Gender',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'gender',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const email = () => ({
    headerName: 'Email',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'email',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})


export const designation = () => ({
    headerName: 'Designation',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'designation',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const telephone = () => ({
    headerName: 'Telephone',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'telephone',
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

export const ministry = () => ({
    headerName: 'Ministry',
    // width: 140,
    editable: false,
    lockPosition: true,
    valueGetter: ({ data }) => 
        data.ministry 
        ? `${data.ministry.name}`
        : null,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'ministry',
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
    cellRenderer: "AdminAction",
    cellRendererParams: ({data}) => ({
        onValueChange,
        // id: data.sbp_request_id
    }),
    filter: false,
})


export default [
    firstName,
    lastName,
    email,
    telephone,

    gender,
    designation,

    ministry,
    action
]