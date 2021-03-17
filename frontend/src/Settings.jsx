import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import _ from "lodash";
import { Row, Col } from "react-flexbox-grid";
import { toast } from "react-toastify";
import Select from "react-select";

import { connect } from "react-redux";

import MySecondaryNavigation from "./Dashboard/MySecondaryNavigation";
import {
  Wrapper,
  Loading,
  Module,
  ModuleHeader,
  ModuleBody,
  ModuleFooter,
  Button,
  FormGroup,
  Modal,
  ReduxFormWrapper,
  Checkbox,
  InputGroup,
} from "@wfp/ui";
import { iconCloseOutline } from "@wfp/icons";

import { Form, FormSpy, Field } from "react-final-form";

class Settings extends React.Component {
  state = {
    lastSaved: null,
    formData: null,
    showErrors: false,
    loading: false,
    userSettings: {
      emailNotification: false,
      smsNotification: false
    },
    message: '', 
    showSuccess: false,
    showFailed: false,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchUserSettings();
  }

  fetchUserSettings = async () => {
    const { user } = this.props;
    
    this.setState({ loading: true });
    try {
      await axios
        .get(`/v1/settings/${user && user._id}`)
        .then((data) => this.setState({ userSettings: data.data.data, loading: false }));
    } catch (err) {
      console.log("Error while loading data", err);
      this.setState({ loading: false });
    }
  };

  onSubmit = async (values) => {
    this.setState({ loading: true });
    const { userSettings } = this.state;
    const { user } = this.props;
    const { smsNotification, emailNotification } = values;
    let formData = {
      smsNotification,
      emailNotification
    }

    try {
        await 
        axios
          .post(`/v1/settings/${user && user._id}`, formData)
          .then(() => this.setState({ loading: false, showSuccess: true, message: 'Successfully updated seetings' }));
    } catch (err) {
      console.log("Ooops! error occurred, please try again", err);;
      this.setState({ loading: false, showFailed: true, message: 'Error occurred, please try again' });
    }
  };

  render() {
    const { showErrors, message, showSuccess, showFailed } = this.state;
    const { formData, loading, userSettings } = this.state;
    const { location, user } = this.props;
    const { state } = location;

    return (
      <>
        <MySecondaryNavigation
          l1Label="Settings"
          l1Link="#"
          l2Label={'Notification settings'}
          l2Link="#"
          pageTitle={'Notification settings'}
        />

        {loading ? <Loading active={loading} withOverlay={true} />
          :
          <>
        <div className="wfp--module__background" style={{ minHeight: "400px" }}>
          <Wrapper pageWidth="lg" spacing="md" mobilePageWidth="full">
            <Form
              onSubmit={this.onSubmit}
              initialValues={userSettings}
              render={({ values, onSave, valid, reset }) => (
                <form>
                  <Module noMargin>
                    <ModuleHeader>
                      <span style={{ fontSize: 20 }}>
                        { user && user.isAdmin ? 'Ministry ' : null } Settings
                      </span>
                    </ModuleHeader>
                    <ModuleBody>

                      <FieldWrapper>
                            <InputGroup
                              helperText="Select appropriate notification type. Please note that you will receive mobile push notification irrespective of your selection type."
                              labelText="Notifications"
                              vertical
                            >
                              <Row>
                                  <Col md={8} sm={8} xs={12}>
                                    <Field component={ReduxFormWrapper} name="smsNotification">
                                      {({ input, meta }) => (
                                          <Checkbox
                                          value={
                                            userSettings
                                                ? userSettings.smsNotification
                                                : false
                                            }
                                            defaultChecked={
                                              userSettings
                                                ? userSettings.smsNotification
                                                : false
                                            }
                                            {...input}
                                            {...meta}
                                            // id={p}
                                            labelText={'Enable SMS notification'}
                                          />
                                      )}
                                      </Field>

                                  </Col>

                                  <Col md={8} sm={8} xs={12}>
                                    <Field component={ReduxFormWrapper} name="emailNotification">
                                      {({ input, meta }) => (
                                          <Checkbox
                                          value={
                                            userSettings
                                              ? userSettings.emailNotification
                                              : false
                                          }
                                          defaultChecked={
                                            userSettings
                                              ? userSettings.emailNotification
                                              : false
                                          }
                                            {...input}
                                            {...meta}
                                            labelText={'Enable email notification'}
                                          />
                                      )}
                                    </Field>
                                  </Col>
                              </Row>
                            </InputGroup>
                      </FieldWrapper>
                    </ModuleBody>
                    <ModuleFooter>
                      <div></div>
                      <div
                        style={{
                          width: "100%",
                          textAlign: "right",
                          margin: "1.5rem 0",
                        }}
                      >
                        <Button
                          kind="secondary"
                          onClick={() => this.props.history.goBack()}
                        >
                          Go back
                        </Button>

                        <Button
                          // disabled={!valid}
                          onClick={(e) => {
                            e.preventDefault();
                            this.onSubmit(values);
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </ModuleFooter>
                  </Module>
                  {showErrors && (
                    <div
                      style={{
                        padding: "5px",
                        width: "100%",
                        background: "#C5192D",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Please fill in all required fields
                    </div>
                  )}
                </form>
              )}
            />
          </Wrapper>
        </div>

        <Modal
              modalHeading=""
              modalLabel="SUCCESS"
              primaryButtonText="OK"
              onRequestClose={()=>this.setState({ showSuccess: false})}
              onRequestSubmit={()=>this.props.history.goBack()}
              open={showSuccess}
            >
              {message}
            </Modal>

            <Modal
              modalHeading=""
              modalLabel="Ooops!!!"
              primaryButtonText="Try again"
              onRequestClose={()=>this.setState({ showFailed: false})}
              onRequestSubmit={()=>this.setState({ showFailed: false})}
              open={showFailed}
              type='danger'
              danger
            >
              {message}
            </Modal>
          </>
  }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};


export default connect(mapStateToProps, null)(Settings);

const FieldWrapper = styled.div`
  margin-bottom: 30px;
`;
