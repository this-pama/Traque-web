import React from "react";
import { SWRConfig } from "swr";
import axios from "axios";
import { Switch, BrowserRouter } from "react-router-dom";
import { Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { checkLoginStatus, logout } from "./store/actions";
import ProtectedRoute from "./ProtectedRoute";
import IdleTimer from "react-idle-timer";
import { Modal, Wrapper, Loading, Blockquote } from "@wfp/ui";
import Login from "./Login";
import Activate from "./Activate";
import CreateMinistry from "./Dashboard/views/CreateMinistry";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./shared/Footer";

import Settings from './Settings'

// import 'ag-grid-enterprise'
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import "./App.css";
import ResetPassword from "./ResetPassword";
import SA_Landing from "./SuperAdmin/Landing";
import Dashboard from "./Dashboard";
import CreateAdmin from "./Dashboard/views/CreateAdmin";
import AdminDashboard from "./AdminDashboard";
import CreateDepartment from "./AdminDashboard/views/CreateDepartment";
import ViewSubDepartment from "./AdminDashboard/views/SubDepartment";
import CreateSubDepartment from "./AdminDashboard/views/CreateSubDepartment";
import CreateStaff from "./AdminDashboard/views/CreateStaff";
import ManageFile from "./ManageFile";
import ViewFileHistory from "./ManageFile/views/ViewHistory";
import CreateFile from "./ManageFile/views/CreateFile";
import MyMainNavigation from "./shared/MyMainNavigation";
import ForwardFile from "./ManageFile/views/ForwardFile";
import NotAuthorized from "./NotAuthorized";
import CreateUserRole from "./Dashboard/views/CreateUserRole";
import ServiceFileTypes from "./AdminDashboard/views/CreateServiceFileType";
import CreateServiceFileType from "./AdminDashboard/views/CreateServiceFileType";
import OutdatedBrowser from "./OutdatedBrowser";
import styled from "styled-components";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: 1000 * 60 * 10,
      showModal: false,
      isTimedOut: false,
    };

    this.idleTimer = null;
    this.onIdle = this._onIdle.bind(this);
  }

  _onIdle(e) {
    if (
      window.location.pathname != "/login" &&
      window.location.pathname != "/reset-password" &&
      window.location.pathname != "/activate"
    ) {
      this.setState({ showModal: true });
      this.timeOut();
    }
  }

  timeOut = () =>
    setTimeout(() => {
      if (this.state.showModal) {
        this.setState({ showModal: false });
        return this.props.logout();
      }

      return this.setState({ showModal: false });
    }, 3 * 60 * 1000);

  componentDidMount() {
    const { checkLoginStatus, user } = this.props;
    // even tho we keep user data in local storage,
    // refetch user data on mount because it might have been updated

    checkLoginStatus(user);
  }

  toggleModal = () => {
    this.setState((state) => ({
      showModal: !state.showModal,
    }));
    this.idleTimer.reset();
    this.props.checkLoginStatus(this.props.user);
  };

  logOut = () => {
    this.setState((state) => ({
      showModal: false,
    }));

    this.props.logout();
  };

  render() {
    const { user } = this.props;
    const isLogged = user ? true : false;

    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/ false || !!document.documentMode;

    return (
      <SWRConfig
        value={{
          fetcher: axios,
          revalidateOnFocus: false,
          dedupingInterval: 300,
        }}
      >
        <AppWrapper>
          <IdleTimer
            ref={(ref) => {
              this.idleTimer = ref;
            }}
            element={document}
            onIdle={this.onIdle}
            debounce={250}
            timeout={this.state.timeout}
          />

          <BrowserRouter>
            <>
              <Switch>
                <Route
                  exact
                  path="/login"
                  component={(props) => <Login {...props} />}
                />

                <Route path="/outdated-browser" component={OutdatedBrowser} />

                <Route
                  exact
                  path="/activate"
                  component={(props) => <Activate {...props} />}
                />

                <Route
                  exact
                  path="/reset-password"
                  component={(props) => <ResetPassword {...props} />}
                />

                <MyMainNavigation />
              </Switch>

              {!isLogged ? (
                <Switch>
                  <Redirect to={`/login`} />
                </Switch>
              ) : (
                <>
                  <Switch>
                    {isIE && <Redirect to="/outdated-browser" />}

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/ministry"
                      component={(props) => (
                        <Dashboard {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-ministry"
                      component={(props) => (
                        <CreateMinistry {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-admin"
                      component={(props) => (
                        <CreateAdmin {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-staff"
                      component={(props) => (
                        <CreateStaff {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/department"
                      component={(props) => (
                        <AdminDashboard {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-department"
                      component={(props) => (
                        <CreateDepartment {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/sub/department/:id"
                      component={(props) => (
                        <ViewSubDepartment
                          {...props}
                          id={props.match.params.id}
                        />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-sub-department/:id"
                      component={(props) => (
                        <CreateSubDepartment
                          {...props}
                          user={user}
                          id={props.match.params.id}
                        />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-service-file-type"
                      component={(props) => (
                        <CreateServiceFileType {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/file"
                      component={(props) => (
                        <ManageFile {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/history/file/:id"
                      component={(props) => (
                        <ViewFileHistory
                          {...props}
                          user={user}
                          id={props.match.params.id}
                        />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-file"
                      component={(props) => (
                        <CreateFile
                          {...props}
                          user={user}
                          id={props.match.params.id}
                        />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/forward/file/:id"
                      component={(props) => (
                        <ForwardFile
                          {...props}
                          user={user}
                          id={props.match.params.id}
                        />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/create-user-role"
                      component={(props) => (
                        <CreateUserRole {...props} user={user} />
                      )}
                    />

                    <ProtectedRoute
                      isAllowed={isLogged}
                      path="/settings"
                      component={(props) => (
                        <Settings {...props} user={user} />
                      )}
                    />

                    <Route path="/not-authorized" component={NotAuthorized} />
                  </Switch>
                </>
              )}
              {isLogged && <Footer />}

              <Modal
                open={this.state.showModal}
                primaryButtonText="Stay"
                onRequestSubmit={this.toggleModal}
                secondaryButtonText="Log out"
                onSecondarySubmit={this.logOut}
                onRequestClose={this.toggleModal}
                modalHeading="You have been inactive!"
              >
                <p className="wfp--modal-content__text">
                  You will get timed out. You want to continue with your
                  session?
                </p>
              </Modal>
            </>
            {/* <ToastContainer closeOnClick autoClose={1000} /> */}
          </BrowserRouter>
          
        </AppWrapper>
      </SWRConfig>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  checkLoginStatus: (data) => dispatch(checkLoginStatus(data)),
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

const AppWrapper = styled.div`
  .wfp--link {
    color: #1841ba;
  }
  .wfp--tabs__nav-item--selected .wfp--tabs__nav-link {
    color: #1841ba;
  }
  .wfp--tabs__nav__bar {
    background: #1841ba;
  }
  .wfp--breadcrumb-home {
    fill: #1841ba;
  }
`;
