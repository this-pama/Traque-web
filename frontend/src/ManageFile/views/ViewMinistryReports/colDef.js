import {
  globalFilterParams,
  cellRenderBasedOnKey,
} from "../../../shared/utils";
import moment from "moment";
import React from "react";
import { phoneNumber } from "../IncomingColDef/incomingColDef";

export const name = () => ({
  headerName: "Ministry",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "name",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data && data.ministry ? data.ministry.ministry.name : null
});

export const totalFile = () => ({
  headerName: "Total file",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "totalFile",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data  ? data.totalFile + ' files' : null
});

export const file_day = () => ({
  headerName: "Avg file/day",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "avgPerDay",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data  ? data.avgPerDay + ' files' : null
});

export const file_week = () => ({
  headerName: "Avg file/week",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "avgPerWeek",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data  ? data.avgPerWeek + ' files' : null
});

export const file_month = () => ({
  headerName: "Avg file/month",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "avgPerMonth",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data  ? data.avgPerMonth + ' files' : null
});


export const sla0_30 = () => ({
  headerName: "SLA btw 0-30 days",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "TtFileExceedSla30",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data  ? data.TtFileExceedSla30 + ' files' : null
});

export const sla31_60 = () => ({
  headerName: "SLA btw 31-60 days",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "TtFileExceedSlaBtw30_60",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data ? data.TtFileExceedSlaBtw30_60 + ' files' : null
});

export const sla61_90 = () => ({
  headerName: "SLA btw 61-90 days",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "TtFileExceedSlaBtw60_90",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data ? data.TtFileExceedSlaBtw60_90 + ' files' : null
});

export const sla91_120 = () => ({
  headerName: "SLA btw 91-120 days",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "TtFileExceedSla90",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data ? data.TtFileExceedSla90 + ' files' : null
});

export const sla120 = () => ({
  headerName: "SLA above 120 days",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "slaAbove121",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  filter: false,
  valueGetter: ({ data }) => data ? data.slaAbove121 + ' files' : null
});

export const action = (onValueChange) => ({
  headerName: "Action",
  lockPosition: true,
  __isExported: false,
  hide: false,
  editable: false,
  field: "action",
  cellRenderer: "ViewMinistryReportAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
  // width: 300,
});

export default [
  name, 
  totalFile,
  file_day,
  file_week,
  file_month, 
  
  sla0_30,
  sla31_60,
  sla61_90,

  sla91_120,
  sla120,
  action
];
