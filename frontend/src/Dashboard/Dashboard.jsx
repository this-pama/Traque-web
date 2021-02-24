import React from "react";
import styled from "styled-components";
import MySecondaryNavigation from "./MySecondaryNavigation";
import { Wrapper, Tabs, Tab, MainNavigationItem } from "@wfp/ui";

import MinistryTable from "./views/MinistryTable";
import AdminTable from "./views/AdminTable";
import UserRoleTable from "./views/UserRoleTable";

import { Redirect, Route, Switch } from "react-router";
import { Link } from "react-router-dom";

const listElReactRouter = ({
  index,
  selected,
  label,
  to,
  exact,
  handleTabClick,
}) => (
  <Route
    path={to}
    exact={exact}
    children={({ match }) => {
      if (match && !selected) {
        /* handle the Tab changes */
        handleTabClick(index, label);
      }
      return (
        <div
          className={
            match
              ? "wfp--tabs__nav-item wfp--tabs__nav-item--selected"
              : "wfp--tabs__nav-item"
          }
        >
          <Link className="wfp--tabs__nav-link" to={to}>
            {label}
          </Link>
        </div>
      );
    }}
  />
);
const Dashboard = (props) => {
  const { user } = props;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  const views = [
    {
      permissions: ["manageMinistry"],
      defaultsForUserType: ["Super Admin"],
      label: "Ministry",
      path: "/ministry/list",
      component: () => <MinistryTable props={props} />,
    },

    {
      permissions: ["manageAdmin"],
      label: "Admin",
      path: "/ministry/admin",
      component: () => <AdminTable props={props} />,
    },

    {
      permissions: ["manageUserRole"],
      label: "User roles",
      path: "/ministry/roles",
      component: () => <UserRoleTable props={props} />,
    },
  ];

  const defaultView = views.find(
    (view) =>
      view.defaultsForUserType &&
      view.defaultsForUserType.filter((el) => userRole && userRole.includes(el))
        .length > 0
  );
  const allowedViews = views.filter((view) =>
    view.permissions.find((permission) => permissions.includes(permission))
  );

  return (
    <div>
      {/* <Header /> */}
      <MySecondaryNavigation
        l1Label="Traquer"
        l1Link="#"
        pageTitle={`Traquer`}
        tabs={
          <Tabs customTabContent={true}>
            {allowedViews.map((view, i) => (
              <Tab
                key={i}
                label={view.label}
                to={view.path}
                renderListElement={listElReactRouter}
              ></Tab>
            ))}
          </Tabs>
        }
      ></MySecondaryNavigation>
      <div className="wfp--module__background" style={{ minHeight: "400px" }}>
        <Wrapper pageWidth="lg" spacing="md">
          <InnerWrapper>
            {/* <div id="export-button-portal" /> */}
            <Switch>
              {allowedViews.map((view, i) => (
                <Route key={i} path={view.path} render={view.component} />
              ))}

              <Redirect
                to={defaultView ? defaultView.path : "/not-authorized"}
              />
            </Switch>
          </InnerWrapper>
        </Wrapper>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Dashboard;

const InnerWrapper = styled.div`
  position: relative;
  padding-bottom: 1rem;
  #export-button-portal {
    position: absolute;
    right: 0;
    top: -95px;
  }
`;
