import {
  globalFilterParams,
  cellRenderBasedOnKey,
} from "../../../shared/utils";
import moment from "moment";
import React from "react";
import { phoneNumber } from "../IncomingColDef/incomingColDef";

export const name = () => ({
  headerName: "File Name/Title",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "name",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const no = () => ({
  headerName: "File number",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "fileNo",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const type = () => ({
  headerName: "File type",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "type",
  cellRenderer: ({ data})=>`
  <div>
  ${data.type == 'Service file' && data.serviceFileType && data.serviceFileType.name
? data.serviceFileType.name
: data.type}
  </div>`,
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const justification = () => ({
  headerName: "Justification",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "delayed",
  valueGetter: ({ data }) => {
    return data.delayed && data.delayed.justification
      ? data.delayed.justification
      : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const department = () => ({
  headerName: "Department",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "incoming",
  valueGetter: ({ data }) => {
    return data.delayed && data.delayed.delayedDept
      ? `${data.delayed.delayedDept.name}`
      : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const subDepartment = () => ({
  headerName: "Office/Unit",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "incoming",
  valueGetter: ({ data }) => {
    return data.delayed && data.delayed.delayedSubDept
      ? `${data.delayed.delayedSubDept.name}`
      : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const delayedDate = () => ({
  headerName: "Delayed date",
  // width: 140,
  editable: false,
  lockPosition: true,
  // field: 'createdAt',
  keyCreator: cellRenderBasedOnKey,
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  __isExported: true,
  comparator: (date1, date2) => new Date(date1) - new Date(date2),
  valueGetter: ({ data }) => {
    return data.delayed && data.delayed.delayedDate
      ? new Date(data.delayed.delayedDate).toDateString()
      : null;
  },
});

export const action = (onValueChange) => ({
  headerName: "Action",
  lockPosition: true,
  __isExported: false,
  hide: false,
  editable: false,
  field: "action",
  cellRenderer: "DelayedFileAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
  width: 400,
});

export default [
  name,
  no,
  phoneNumber,
  type,

  department,
  subDepartment,

  delayedDate,
  justification,

  action,
];
