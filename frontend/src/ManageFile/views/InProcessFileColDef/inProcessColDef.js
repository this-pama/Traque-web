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
        return data.pending  && data.pending.sentBy
        ? `${data.pending.sentBy.firstName}  ${data.pending.sentBy.lastName}`
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
    field: 'pending',
    valueGetter: ({data}) => {
        return data.pending && data.pending.originatingDept
        ? `${data.pending.originatingDept.name}`
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
    field: 'pending',
    valueGetter: ({data}) => {
        return data.pending && data.pending.originatingSubDept
        ? `${data.pending.originatingSubDept.name}`
        : null
    },
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
})

export const sentDate = () => ({
    headerName: 'Sent date',
    editable: false,
    lockPosition: true,
    keyCreator: cellRenderBasedOnKey,
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
    __isExported: true,
    comparator: (date1, date2) => new Date(date1) - new Date(date2),
    valueGetter: ({data }) => {
        return data.pending && data.pending.receivedDate 
        ? new Date(data.pending.receivedDate).toDateString()
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
    cellRenderer: "InProcessFileAction",
    cellRendererParams: ({data}) => ({
        onValueChange,
        // id: data.sbp_request_id
    }),
    filter: false,
    width: 450,
})


export default [
    name,
    no,
    type,

    sentBy,
    department,
    subDepartment,

    sentDate,

    action
]