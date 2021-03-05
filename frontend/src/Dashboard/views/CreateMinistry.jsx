import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import _ from "lodash";
import { Row, Col } from "react-flexbox-grid";
import { toast } from "react-toastify";
import { Modal, } from "@wfp/ui";
import Select from "react-select";

import MySecondaryNavigation from "../MySecondaryNavigation";
import {
  Wrapper,
  Loading,
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
    this.fetchAdmin();

    const { location } = this.props;
    const { state } = location;

    if (state && state.edit && state.data) {
      this.setState({
        formData: {
          ministry: state.data.name,
          admin: state.data.userId,
        },
      });
    }
  }

  fetchAdmin = async () => {
    try {
      axios
        .get(`/v1/user/admin/admin-list`)
        .then((data) => this.setState({ admin: data.data.data }));
    } catch (err) {
      console.log("Error while loading ministry", err);
    }
  };

  onSubmit = async (values) => {
    this.setState({ loading: true });
    const { location } = this.props;
    const { state } = location;
    let formData;

    try {
      if (state && state.edit) {
        formData = {
          name: values.ministry,
          userId: values.admin._id,
        };

        await axios
          .put(`/v1/ministry/update/${state.id}`, formData)
          .then(() => 
          this.setState({ 
            loading: false,
            message: 'Successfully updated ministry', 
            showSuccess: true 
          }));
        
      } else {
        await axios
          .post(`/v1/ministry/add`, { name: values.ministry })
          .then(() => 
            this.setState({ 
              loading: false,
              message: 'Successfully created a ministry', 
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

  render() {
    const { showErrors, message, showSuccess, showFailed } = this.state;
    const { formData, loading, admin } = this.state;
    const { location } = this.props;
    const { state } = location;
    return (
      <>
        <MySecondaryNavigation
          l1Label="Ministry"
          l1Link="/ministry"
          l2Label={state && state.edit ? "Update ministry" : "Create ministry"}
          l2Link="#"
          pageTitle={
            state && state.edit ? "Update ministry" : "Create ministry"
          }
        />
          <Loading active={loading} withOverlay={true} />
         
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
                  const { ministry } = values;

                  if (!ministry) {
                    errors.ministry = {
                      value: "Ministry name is required",
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
                            ? "Update ministry"
                            : "Create ministry"}
                        </span>
                      </ModuleHeader>
                      <ModuleBody>
                        <Col md={6} sm={6} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              inputComponent={TextInput}
                              id="ministry"
                              name="ministry"
                              type="text"
                              labelText="Ministry name"
                            />
                          </FieldWrapper>
                        </Col>

                        {state && state.edit ? (
                          <Col md={6} sm={6} xs={12}>
                            <FieldWrapper>
                              <Field
                                component={ReduxFormWrapper}
                                name="admin"
                                labelText="Admin"
                                placeholder="Select designated admin"
                              >
                                {({ input, meta }) => (
                                  <>
                                    <div className="wfp--label">
                                      Designated Admin
                                    </div>
                                    <Select
                                      className="wfp--react-select-container auto-width"
                                      classNamePrefix="wfp--react-select"
                                      closeMenuOnSelect={true}
                                      // onChange={(vars) => {
                                      //     this.languageChange(vars, originalOnChange)
                                      // }}
                                      options={admin}
                                      getOptionValue={(option) => option["_id"]}
                                      getOptionLabel={(option) =>
                                        option["firstName"] +
                                        " " +
                                        option["lastName"]
                                      }
                                      {...input}
                                      {...meta}
                                    />
                                  </>
                                )}
                              </Field>
                            </FieldWrapper>
                          </Col>
                        ) : null}
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
        
      </>
    );
  }
}

export default withRouter(Create);
const FieldWrapper = styled.div`
  margin-bottom: 30px;
`;
