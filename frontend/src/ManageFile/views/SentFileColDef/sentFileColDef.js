import { globalFilterParams, cellRenderBasedOnKey } from '../../../shared/utils'
import moment from 'moment'
import React from 'react'


export const name = () => ({
    headerName: 'File Name/Title',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'name',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const no = () => ({
    headerName: 'File number',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'fileNo',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const type = () => ({
    headerName: 'File type',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'type',
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const sentBy = () => ({
    headerName: 'Sent from',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'incoming',
    valueGetter: ({data}) => {
        return data.sent && data.sent[0].sentBy
        ? `${data.sent[0].sentBy.firstName}  ${data.sent[0].sentBy.lastName}`
        : null
    },
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const department = () => ({
    headerName: 'Department',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'incoming',
    valueGetter: ({data}) => {
        return data.sent && data.sent[0].originatingDept
        ? `${data.sent[0].originatingDept.name}`
        : null
    },
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})



export const subDepartment = () => ({
    headerName: 'Sub Department',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    field: 'incoming',
    valueGetter: ({data}) => {
        return data.sent && data.sent[0].originatingSubDept
        ? `${data.sent[0].originatingSubDept.name}`
        : null
    },
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const sentDate = () => ({
    headerName: 'Sent date',
    // width: 140,
    editable: false,
    lockPosition: true,
    // field: 'createdAt',
    keyCreator: cellRenderBasedOnKey,
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
    __isExported: true,
    comparator: (date1, date2) => new Date(date1) - new Date(date2),
    valueGetter: ({data }) => {
        return data.sent && data.sent[0].sentDate 
        ? new Date(data.sent[0].sentDate).toDateString()
        : null
    },
})

export const action = (onValueChange) => ({
    headerName: 'Action',
    lockPosition: true,
    __isExported: false,
    hide: false,
    editable: false,
    field: 'action',
    cellRenderer: "SentFileAction",
    cellRendererParams: ({data}) => ({
        onValueChange,
        // id: data.sbp_request_id
    }),
    filter: false,
    // width: 300,
})

export const status = () => ({
    headerName: 'Status',
    lockPosition: true,
    __isExported: true,
    hide: false,
    editable: false,
    valueGetter: ({data}) => "File received",
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})


export default [
    name,
    no,
    type,

    sentBy,
    department,
    subDepartment,

    sentDate,
    status,

    action
]