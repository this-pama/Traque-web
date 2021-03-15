import {
  globalFilterParams,
  cellRenderBasedOnKey,
} from "../../../shared/utils";
import moment from "moment";
import React from "react";

export const name = () => ({
  headerName: "Name",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "name",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const createdAt = () => ({
  headerName: "Created on",
  // width: 140,
  editable: false,
  lockPosition: true,
  field: "createdAt",
  keyCreator: cellRenderBasedOnKey,
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  __isExported: true,
  comparator: (date1, date2) => new Date(date1) - new Date(date2),
  valueGetter: (params) => {
    return (
      params.data.createdAt && new Date(params.data.createdAt).toDateString()
    );
  },
});

export const no_of_staff = () => ({
  headerName: "No of staff",
  // width: 140,
  editable: false,
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  // field: 'staff',
  valueGetter: ({ data }) => (data.staff ? data.staff.length : 0),
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const sub = () => ({
  headerName: "No of Office/Unit",
  // width: 140,
  editable: false,
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  valueGetter: ({ data }) =>
    data.subDepartment ? data.subDepartment.length : 0,
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const type = () => ({
  headerName: "Type",
  // width: 140,
  editable: false,
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "type",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const action = (onValueChange) => ({
  headerName: "Action",
  lockPosition: true,

  __isExported: false,
  hide: false,
  editable: false,
  field: "action",
  cellRenderer: "SubDepartmentAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
});

export default [
  name,
  type,
  no_of_staff,
  // sub,
  createdAt,
  action,
];
