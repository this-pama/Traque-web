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


export const openingDate = () => ({
    headerName: 'Opening date',
    editable: false,
    lockPosition: true,
    keyCreator: cellRenderBasedOnKey,
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
    __isExported: true,
    comparator: (date1, date2) => new Date(date1) - new Date(date2),
    valueGetter: ({data }) => {
        return data.createdDate  
        ? new Date(data.createdDate).toDateString()
        : null
    },
})


export const closingDate = () => ({
    headerName: 'Closing date',
    editable: false,
    lockPosition: true,
    keyCreator: cellRenderBasedOnKey,
    filter: 'agTextColumnFilter',
    filterParams: globalFilterParams,
    __isExported: true,
    comparator: (date1, date2) => new Date(date1) - new Date(date2),
    valueGetter: ({data }) => {
        return data.archived && data.archived.archivedDate  
        ? new Date(data.archived.archivedDate).toDateString()
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



export default [
    name,
    no,
    type,

    openingDate,
    closingDate,

    action
]