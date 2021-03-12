import React from "react";
import useSWR, { trigger } from "swr";
import { Button } from "@wfp/ui";
import { iconAddOutline, iconDocument } from "@wfp/icons";

import TableView from "../../Dashboard/TableView";
import getColumnDefs from "../../shared/columnDefs";
import store from "../../store";
import Can from "../../shared/Can";

const filters = [
  {
    title: "Inbox",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.pending && rowData.pending.value,
  },
  {
    title: "Delayed",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.delayed && rowData.delayed.value,
  },
  {
    title: "Archived",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.archived && rowData.archived.value,
  },
  {
    title: "Exceed SLA",
    role: "Type",
    amountLabel: "FILE",
    warning: true,
    comparator: (rowData) => rowData && rowData.exceedSLA,
  },

  {
    title: "In Registry",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) =>
      rowData &&
      rowData.archived.value == false &&
      rowData.incoming.value == false &&
      rowData.outgoing.value == false &&
      rowData.delayed.value == false &&
      rowData.pending.value == false &&
      rowData.delated == false &&
      rowData.sent.filter((p) => p.value == false).length == 0,
  },

  {
    title: "Deleted",
    role: "Type",
    amountLabel: "FILE",
    warning: true,
    comparator: (rowData) => rowData.delated,
  },
  {
    title: "Service file",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.type == "Service file",
  },
  {
    title: "Management file",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.type == "Management file",
  },
  {
    title: "Uncategorized file",
    role: "Type",
    amountLabel: "FILE",
    warning: true,
    comparator: (rowData) => rowData.type == null,
  },

  {
    title: "Total files",
    role: "Type",
    amountLabel: "FILE",
    comparator: (rowData) => rowData.type,
  },
];

const View = ({ props }) => {
  const storeData = store.getState();
  const { user } = storeData;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  const endpoint = `/v1/file/department/${user && user.department}`;

  const { data } = useSWR(endpoint);
  const fetchData = () => trigger(endpoint);
  const applications = data ? data.data.data : null;

  let filePerm = permissions
    ? permissions.includes("createManagementFile")
      ? "createManagementFile"
      : permissions.includes("createServiceFile")
      ? "createServiceFile"
      : "does-not-exit"
    : "does-not-exit";

  return (
    <>
      <div id="export-button-portal">
        <Can
          rules={permissions}
          userRole={userRole}
          perform={filePerm}
          yes={() => (
            <Button
              onClick={(data) => {
                props.history.push("/create-file");
              }}
              icon={iconAddOutline}
              kind="secondary"
              small
            >
              Create file
            </Button>
          )}
        />
      </div>

      <TableView
        title={"File Report"}
        data={applications}
        filters={filters}
        fetchData={fetchData}
        gridConfig={getColumnDefs("sectionReport", fetchData)}
        exportFileName={"Section files"}
      />
    </>
  );
};

export default View;
