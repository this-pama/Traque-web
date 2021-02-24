import React from "react";
import TableView from "../TableView";
import getColumnDefs from "../../shared/columnDefs";
import { Button } from "@wfp/ui";
import { iconAddOutline } from "@wfp/icons";
import useSWR, { trigger } from "swr";
import Can from "../../shared/Can";

const filters = [
  {
    title: "Pending Screening",
    role: "Screener",
    warning: true,
    comparator: (rowData) => rowData.lastName == null,
  },
];
const endpoint = "/v1/user/admin/admin-list";

const Admin = ({ props }) => {
  const { data } = useSWR(endpoint);
  const fetchData = () => trigger(endpoint);
  const applications = data ? data.data.data : null;

  const { user } = props;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  return (
    <>
      <div id="export-button-portal">
        <Can
          rules={permissions}
          userRole={userRole}
          perform={"manageAdmin"}
          yes={() => (
            <Button
              onClick={() => props.history.push("/create-admin")}
              icon={iconAddOutline}
              kind="secondary"
              small
            >
              Create admin
            </Button>
          )}
        />
      </div>
      <TableView
        title={"Ministry Administrators"}
        data={applications}
        filters={[]}
        fetchData={fetchData}
        gridConfig={getColumnDefs("admin", fetchData)}
        // exportFileName={'Admin details'}
      />
    </>
  );
};

export default Admin;
