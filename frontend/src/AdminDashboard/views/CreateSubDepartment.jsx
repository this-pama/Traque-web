import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import _ from "lodash";
import { Row, Col } from "react-flexbox-grid";
import { toast } from "react-toastify";
import Select from "react-select";
import { connect } from "react-redux";

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
import { deptType } from "../../shared/utils";

class Create extends React.Component {
  state = {
    lastSaved: null,
    formData: null,
    showErrors: false,
    loading: false,
    admin: [],
    message: '', 
    showSuccess: false,
    showFailed: false,
  };
  componentDidMount() {
    window.scrollTo(0, 0);

    const { location } = this.props;
    const { state } = location;

    if (state && state.edit && state.data) {
      this.setState({
        formData: {
          name: state.data.name,
          type: {
            value: state.data.type,
            label: state.data.type,
          },
        },
      });
    }
  }

  onSubmit = async (values) => {
    this.setState({ loading: true });
    const { location, id, userId } = this.props;
    const { state } = location;
    let formData = {
      name: values.name,
      type: values.type.value,
    };

    try {
      if (state && state.edit) {
        await axios
          .put(`/v1/department/sub/update/${state.id}`, formData)
          .then(() => this.setState({ loading: false }));
            toast("Successfully updated sub department", {
              closeOnClick: true,
              autoClose: 1000,
            });
        this.props.history.goBack();
      } else {
        await axios
          .post(`/v1/department/sub/add/${id}/${userId}`, formData)
          .then(() => this.setState({ loading: false }));
            toast("Successfully created a sub department", {
              closeOnClick: true,
              autoClose: 1000,
            });
            this.props.history.goBack();
      }
    } catch (err) {
      console.log("Ooops! error occurred, please try again", err);
      this.setState({ 
        loading: false, 
        message: "Error occurred, please try again", 
        showFailed: true 
      });
    }
  };

  render() {
    const { showErrors, message, showFailed } = this.state;
    const { formData, loading, admin } = this.state;
    const { location, id } = this.props;
    const { state } = location;
    console.log('statw', state)
    return (
      <>
        <MySecondaryNavigation
          l1Label="Department"
          l1Link="/department"
          l2Label="Sub Department"
          // l2Link=""
          l3Label={
            state && state.edit
              ? "Update sub department"
              : "Create sub department"
          }
          // l3Link="#"
          pageTitle={ state && state.data.name + ' - ' + state.data.type }
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
                  const { name, type } = values;

                  if (!name) {
                    errors.name = {
                      value: "Sub Department name is required",
                      show: showErrors,
                    };
                  }

                  if (!type) {
                    errors.name = {
                      value: "Sub Department type is required",
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
                          {state && state.edit
                            ? "Update Sub department"
                            : "Create Sub department"}
                        </span>
                      </ModuleHeader>
                      <ModuleBody>
                        <Col md={6} sm={6} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              name="type"
                              labelText="Type"
                              placeholder="Select department type"
                            >
                              {({ input, meta }) => (
                                <>
                                  <div className="wfp--label">
                                    Sub Department type
                                  </div>
                                  <Select
                                    className="wfp--react-select-container auto-width"
                                    classNamePrefix="wfp--react-select"
                                    closeMenuOnSelect={true}
                                    options={deptType}
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

                        <Col md={6} sm={6} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              inputComponent={TextInput}
                              id="subdepartment"
                              name="name"
                              type="text"
                              labelText="Sub Department name"
                            />
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
  };
};

export default connect(mapStateToProps, null)(Create);

const FieldWrapper = styled.div`
  margin-bottom: 30px;
`;
