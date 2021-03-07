import {
  globalFilterParams,
  cellRenderBasedOnKey,
} from "../../../shared/utils";
import moment from "moment";
import React from "react";

export const firstName = () => ({
  headerName: "First name",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "firstName",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const lastName = () => ({
  headerName: "Last name",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "lastName",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const gender = () => ({
  headerName: "Gender",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "gender",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  width: 80,
});

export const email = () => ({
  headerName: "Email",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "email",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const designation = () => ({
  headerName: "Designation",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "designation",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const telephone = () => ({
  headerName: "Telephone",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "telephone",
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

export const ministry = () => ({
  headerName: "Ministry",
  // width: 140,
  editable: false,
  lockPosition: true,
  valueGetter: ({ data }) => (data.ministry ? `${data.ministry.name}` : null),
  __isExported: true,
  hide: false,
  editable: false,
  field: "ministry",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const subDepartment = () => ({
  headerName: "Sub department",
  // width: 140,
  editable: false,
  lockPosition: true,
  valueGetter: ({ data }) =>
    data.subDepartment ? `${data.subDepartment.name}` : null,
  __isExported: true,
  hide: false,
  editable: false,
  field: "subDepartment",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const department = () => ({
  headerName: "Department",
  // width: 140,
  editable: false,
  lockPosition: true,
  valueGetter: ({ data }) =>
    data.department ? `${data.department.name}` : null,
  __isExported: true,
  hide: false,
  editable: false,
  field: "department",
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const userRole = () => ({
  headerName: "Role",
  // width: 140,
  editable: false,
  lockPosition: true,
  valueGetter: ({ data }) => (data.userRole ? `${data.userRole.name}` : null),
  __isExported: true,
  hide: false,
  editable: false,
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
  cellRenderer: "StaffAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
  // width: 120,
});

export default [
  firstName,
  lastName,
  email,
  telephone,

  // gender,
  userRole,
  // designation,

  department,
  subDepartment,

  ministry,
  action,
];
