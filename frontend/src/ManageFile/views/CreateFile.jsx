import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import _ from "lodash";
import { Row, Col } from "react-flexbox-grid";
import { toast } from "react-toastify";
import Select from "react-select";
import { connect } from "react-redux";
import "react-dates/initialize";
import { SingleDatePickerInput } from "@wfp/ui";
import { SingleDatePicker } from "react-dates";

import MySecondaryNavigation from "../../Dashboard/MySecondaryNavigation";
import {
  Wrapper,
  Loading,
  Modal,
  Module,
  ModuleHeader,
  ModuleBody,
  ModuleFooter,
  Button,
  FormGroup,
  TextInput,
  ReduxFormWrapper,
} from "@wfp/ui";
import { iconCloseOutline } from "@wfp/icons";

import { Form, FormSpy, Field } from "react-final-form";
import { deptType, fileType } from "../../shared/utils";
import moment from "moment";

class Create extends React.Component {
  state = {
    lastSaved: null,
    formData: null,
    showErrors: false,
    loading: false,
    date: moment(),
    focused: null,
    serviceType: [],
    message: '', 
    showSuccess: false,
    showFailed: false,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchService();

    const { location } = this.props;
    const { state } = location;

    if (state && state.edit && state.data) {
      let oldNumber =
        state.data && state.data.fileNo ? state.data.fileNo.slice(11) : null;

      this.setState({
        formData: {
          name: state.data.name,
          type: {
            value: state.data.type,
            label: state.data.type,
          },
          fileNo: oldNumber,
        },
        date: state.data.createdDate
          ? moment(state.data.createdDate)
          : moment(),
        serviceType: {
          id: state.data.serviceFileType,
        },
      });
    }
  }

  onSubmit = async (values) => {
    this.setState({ loading: true });
    const { location, userId } = this.props;
    const { state } = location;
    let formData = {
      name: values.name,
      type: values.type.value,
      fileNo: values.fileNo,
      createdDate: this.state.date,
      serviceFileType:
        values.type.value == "Service file"
          ? values.serviceType && values.serviceType._id
          : null,
    };

    try {
      if (state && state.edit) {
        let oldNumber =
          state && state.data.fileNo ? state.data.fileNo.slice(0, 11) : null;
        let fileNo = oldNumber ? oldNumber + values.fileNo : values.fileNo;

        await axios
          .put(`/v1/file/update/${state.id}`, { ...formData, fileNo })
          .then(() => 
            this.setState({ 
              loading: false,
              message:"File successfully updated", 
              showSuccess: true 
            }));
      } else {
        await axios
          .post(`/v1/file/add/${userId}`, formData)
          .then(() => 
          this.setState({ 
            loading: false,
            message:"File successfully created", 
            showSuccess: true 
          }));
      }
    } catch (err) {
      this.setState({ 
        loading: false, 
        message: "Error occurred, please try again", 
        showFailed: true 
      });
    }
  };

  fetchService = async () => {
    const { user } = this.props;
    try {
      axios
        .get(`/v1/service/file/${user && user.ministry}`)
        .then((data) => this.setState({ serviceType: data.data.data }));
    } catch (err) {
      console.log("Error while loading department", err);
    }
  };

  render() {
    const { showErrors, serviceType, message, showSuccess, showFailed } = this.state;
    const { formData, loading, admin } = this.state;
    const { location, userId, user } = this.props;
    const { state } = location;

    const permissions = user && user.userRole ? user.userRole.permission : [];
    const userRole = user && user.userRole ? user.userRole.name : null;

    const fileList = fileType.filter(
      (p) =>
        (p.label == "Service file" &&
          permissions.includes("createServiceFile")) ||
        (p.label == "Management file" &&
          permissions.includes("createManagementFile"))
    );

    return (
      <>
        <MySecondaryNavigation
          l1Label="Manage File"
          l1Link="/file"
          l2Label={state && state.edit ? "Update file" : "Create file"}
          l2Link="#"
          pageTitle={state && state.edit ? "Update file" : "Create file"}
        />
        {loading ? (
          <Loading active={true} withOverlay={true} />
        ) : (
          <div
            className="wfp--module__background"
            style={{ minHeight: "400px" }}
          >
            <Wrapper pageWidth="lg" spacing="md" mobilePageWidth="full">
              <Form
                onSubmit={this.onSubmit}
                initialValues={formData}
                validate={(values) => {
                  const errors = {};
                  const { name, type, fileNo } = values;

                  if (!name) {
                    errors.name = {
                      value: "File name is required",
                      show: showErrors,
                    };
                  }

                  if (!type) {
                    errors.type = {
                      value: "Type is required",
                      show: showErrors,
                    };
                  }

                  if (!fileNo) {
                    errors.fileNo = {
                      value: "File number is required",
                      show: showErrors,
                    };
                  }
                  return errors;
                }}
                render={({ values, onSave, valid, reset }) => (
                  <form>
                    <Module noMargin>
                      <ModuleHeader>
                        <span style={{ fontSize: 20 }}>
                          {state && state.edit ? "Update File" : "Create File"}
                        </span>
                      </ModuleHeader>
                      <ModuleBody>
                        <Col md={8} sm={8} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              inputComponent={TextInput}
                              id="name"
                              name="name"
                              type="text"
                              labelText="File name/title"
                            />
                          </FieldWrapper>
                        </Col>

                        <Col md={8} sm={8} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              inputComponent={TextInput}
                              id="fileNo"
                              name="fileNo"
                              type="text"
                              labelText="File number"
                            />
                          </FieldWrapper>
                        </Col>

                        <Col md={8} sm={8} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              name="type"
                              labelText="File Type"
                              placeholder="Select file type"
                            >
                              {({ input, meta }) => (
                                <>
                                  <div className="wfp--label">File type</div>
                                  <Select
                                    className="wfp--react-select-container auto-width"
                                    classNamePrefix="wfp--react-select"
                                    closeMenuOnSelect={true}
                                    options={fileList}
                                    getOptionValue={(option) => option["value"]}
                                    getOptionLabel={(option) => option["label"]}
                                    {...input}
                                    {...meta}
                                  />
                                </>
                              )}
                            </Field>
                          </FieldWrapper>
                        </Col>

                        {fileList.filter((p) => p.label == "Service file")
                          .length > 0 && (
                          <Col md={8} sm={8} xs={12}>
                            <FieldWrapper>
                              <Field
                                component={ReduxFormWrapper}
                                name="serviceType"
                                labelText="Service File Type"
                                placeholder="Select service file type"
                              >
                                {({ input, meta }) => (
                                  <>
                                    <div className="wfp--label">
                                      Service File type
                                    </div>
                                    <Select
                                      className="wfp--react-select-container auto-width"
                                      classNamePrefix="wfp--react-select"
                                      closeMenuOnSelect={true}
                                      options={serviceType}
                                      getOptionValue={(option) => option["_id"]}
                                      getOptionLabel={(option) =>
                                        option["name"]
                                      }
                                      {...input}
                                      {...meta}
                                      isDisabled={
                                        values.type &&
                                        values.type.label == "Management file"
                                      }
                                    />
                                  </>
                                )}
                              </Field>
                            </FieldWrapper>
                          </Col>
                        )}

                        <Col md={8} sm={8} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              name="date"
                              id="date"
                            >
                              {({ input, meta }) => (
                                <SingleDatePickerInput
                                  date={this.state.date}
                                  datePicker={SingleDatePicker}
                                  inputIconPosition="after"
                                  labelText="Opening date"
                                  onDateChange={(date) =>
                                    this.setState({ date: moment(date) })
                                  }
                                  onChange={(date) => this.setState({ date })}
                                  focused={this.state.focused}
                                  onFocusChange={({ focused }) =>
                                    this.setState({ focused })
                                  }
                                  placeholder="Select opening date"
                                  numberOfMonths={1}
                                  showDefaultInputIcon
                                  isOutsideRange={() => false}
                                  {...input}
                                  {...meta}
                                />
                              )}
                            </Field>
                          </FieldWrapper>
                        </Col>
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
                            disabled={values.name && values.type ? false : true}
                          >
                            {state && state.edit ? "Update" : "Create"}
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
            </Wrapper>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.user._id,
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(Create);

const FieldWrapper = styled.div`
  margin-bottom: 30px;
  .SingleDatePicker {
    position: relative;
    order: 3;
    width: 100%;
  }
  .DateInput {
    width: 100%;
  }
  .SingleDatePickerInput {
    width: 100%;
  }
`;
