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

export const sentBy = () => ({
  headerName: "Sent from",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "incoming",
  valueGetter: ({ data }) => {
    return data.incoming && data.incoming.sentBy
      ? `${data.incoming.sentBy.firstName}  ${data.incoming.sentBy.lastName}`
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
    return data.incoming && data.incoming.originatingDept
      ? `${data.incoming.originatingDept.name}`
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
    return data.incoming && data.incoming.originatingSubDept
      ? `${data.incoming.originatingSubDept.name}`
      : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const sentDate = () => ({
  headerName: "Sent date",
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
    return data.incoming && data.incoming.sentDate
      ? new Date(data.incoming.sentDate).toDateString()
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
  cellRenderer: "IncomingFileAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
  width: 300,
});

export default [
  name,
  no,
  type,

  sentBy,
  department,
  subDepartment,

  sentDate,

  action,
];
