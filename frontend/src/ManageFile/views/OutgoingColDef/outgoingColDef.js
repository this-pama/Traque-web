import {
  globalFilterParams,
  cellRenderBasedOnKey,
} from "../../../shared/utils";
import moment from "moment";
import React from "react";
import { phoneNumber } from '../IncomingColDef/incomingColDef'

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

export const destination = () => ({
  headerName: "Destination",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "outgoing",
  valueGetter: ({ data }) => {
    return data.outgoing && data.outgoing.receivingDept
      ? `${data.outgoing.receivingDept.name}`
      : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const destinationSubDept = () => ({
  headerName: "Office/Unit",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "outgoing",
  valueGetter: ({ data }) => {
    return data.outgoing && data.outgoing.receivingSubDept
      ? `${data.outgoing.receivingSubDept.name}`
      : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const designationOfficer = () => ({
  headerName: "Designated Officer",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  field: "outgoing",
  valueGetter: ({ data }) => {
    return data.outgoing && data.outgoing.receivedBy
      ? `${data.outgoing.receivedBy.firstName} ${data.outgoing.receivedBy.lastName}`
      : null;
  },
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const date = () => ({
  headerName: "Date forwarded",
  editable: false,
  lockPosition: true,
  keyCreator: cellRenderBasedOnKey,
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
  __isExported: true,
  comparator: (date1, date2) => new Date(date1) - new Date(date2),
  valueGetter: ({ data }) => {
    return data.outgoing && data.outgoing.sentDate
      ? new Date(data.outgoing.sentDate).toDateString()
      : null;
  },
});

export const status = () => ({
  headerName: "Status",
  lockPosition: true,
  __isExported: true,
  hide: false,
  editable: false,
  valueGetter: ({ data }) => "Awaiting response",
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
  cellRenderer: "OutgoingFileAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
});

export default [
  name,
  no,
  phoneNumber,
  type,

  destination,
  destinationSubDept,
  designationOfficer,

  date,
  status,

  action,
];
