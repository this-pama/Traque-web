import React from "react";
import useSWR, { trigger } from "swr";
import { Button, Wrapper } from "@wfp/ui";
import { iconAddOutline, iconDocument } from "@wfp/icons";

import TableView from "../../Dashboard/TableView";
import getColumnDefs from "../../shared/columnDefs";
import MySecondaryNavigation from "../../Dashboard/MySecondaryNavigation";
import styled from "styled-components";

import store from "../../store";
import Can from "../../shared/Can";

const filters = [
  {
    title: "Agency",
    role: "Type",
    amountLabel: "Section",
    comparator: (rowData) => rowData.type == "Agency",
  },
  {
    title: "Department",
    role: "Type",
    amountLabel: "Section",
    comparator: (rowData) => rowData.type == "Department",
  },

  {
    title: "Unit",
    role: "Type",
    amountLabel: "Section",
    comparator: (rowData) => rowData.type == "Unit",
  },

  {
    title: "Uncategorized",
    role: "Type",
    amountLabel: "Section",
    warning: true,
    comparator: (rowData) => rowData.type == null,
  },
];

const View = (props) => {
  const { id } = props;

  const storeData = store.getState();
  const { user } = storeData;
  const permission = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  const endpoint = `/v1/department/details/${id}`;

  const { data } = useSWR(endpoint);
  const fetchData = () => trigger(endpoint);
  const applications = data ? data.data.data.subDepartment : null;

  return (
    <>
      <MySecondaryNavigation
        l1Label="Traquer"
        l1Link="/department"
        l2Label="Department"
        l2Link="/department"
        l3Label="Sub department"
        l3Link="#"
        pageTitle={`Traquer`}
      />
      <div className="wfp--module__background" style={{ minHeight: "400px" }}>
        <Wrapper pageWidth="lg" spacing="md">
          <InnerWrapper>
            <div id="export-button-portal">
            <Can
            rules={permission}
            userRole={userRole}
            perform="viewIncoming"
            yes={() => (
              <Button
                onClick={(data) => {
                  props.history.push(`/file`);
                }}
                icon={iconDocument}
                kind="secondary"
                small
              >
                Manage file
              </Button>
            )}
          />

              <span style={{ paddingLeft: 20 }} />
              <Can
              rules={permission}
              userRole={userRole}
              perform="manageDepartment"
              yes={() => (
                  <Button
                    onClick={(data) => {
                      props.history.push(`/create-sub-department/${id}`);
                    }}
                    icon={iconAddOutline}
                    kind="secondary"
                    small
                  >
                    Create sub department
                  </Button>
              )}
          />
            </div>
            <TableView
              title={"Sub Departments"}
              data={applications}
              filters={filters}
              fetchData={fetchData}
              gridConfig={getColumnDefs("subDepartment", fetchData)}
              exportFileName={"sub department details"}
            />
          </InnerWrapper>
        </Wrapper>
      </div>
    </>
  );
};

export default View;

const InnerWrapper = styled.div`
  position: relative;
  padding-bottom: 1rem;
  #export-button-portal {
    position: absolute;
    right: 0;
    top: -95px;
  }
`;
