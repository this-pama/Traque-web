import {
  globalFilterParams,
  cellRenderBasedOnKey,
} from "../../../shared/utils";
import moment from "moment";
import React from "react";

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

export const createdBy = () => ({
  headerName: "Created by",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "createdBy",
  valueGetter: ({ data }) => {
    return data && data.createdBy
      ? `${data.createdBy.firstName}  ${data.createdBy.lastName}`
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
  field: "department",
  valueGetter: ({ data }) => {
    return data && data.department ? `${data.department.name}` : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const subDepartment = () => ({
  headerName: "Sub Department",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "subDepartment",
  valueGetter: ({ data }) => {
    return data && data.subDepartment ? `${data.subDepartment.name}` : null;
  },
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
  cellRenderer: "SectionReportAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
  // width: 300,
});

export default [name, no, type, createdBy, department, subDepartment, action];
