import {
  globalFilterParams,
  cellRenderBasedOnKey,
} from "../../../shared/utils";
import moment from "moment";
import React from "react";

export const name = () => ({
  headerName: "Name",
  width: 80,
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
  width: 80,
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

export const permission = () => ({
  headerName: "Permission",
  editable: false,
  lockPosition: true,
  cellRenderer: ({ data }) =>
    data.permission
      ? `<div>
        <div>${data.permission.map((p) => p)}</div>
    </div>`
      : null,
  __isExported: true,
  hide: false,
  editable: false,
  filter: "agTextColumnFilter",
  filterParams: globalFilterParams,
});

export const action = (onValueChange) => ({
  headerName: "Action",
  lockPosition: true,
  width: 80,
  __isExported: false,
  hide: false,
  editable: false,
  field: "action",
  cellRenderer: "UserRoleAction",
  cellRendererParams: ({ data }) => ({
    onValueChange,
    // id: data.sbp_request_id
  }),
  filter: false,
});

export default [name, permission, createdAt, action];
