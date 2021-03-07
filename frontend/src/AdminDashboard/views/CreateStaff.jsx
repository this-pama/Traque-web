import React from "react";
import axios from "axios";
import styled from "styled-components";
import _ from "lodash";
import { Row, Col } from "react-flexbox-grid";
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
  RadioButton,
  InputGroup,
} from "@wfp/ui";
import { gradeLevel, gender } from "../../shared/utils";

import { Form, FormSpy, Field } from "react-final-form";
import { toast } from "react-toastify";

class Create extends React.Component {
  state = {
    lastSaved: null,
    formData: null,
    showErrors: false,
    loading: false,
    department: [],
    role: [],
    departmentValue: null,
    subDepartmentList: [],
    message: '', 
    showSuccess: false,
    showFailed: false,
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchDept();
    this.fetchRole();

    const { location } = this.props;
    const { state } = location;

    if (state && state.edit && state.data) {
      const {
        firstName,
        lastName,
        email,
        gender,
        telephone,
        gradeLevel,
        designation,
        department,
        subDepartment,
        userRole,
      } = state.data;

      this.setState({
        formData: {
          firstName,
          lastName,
          email,
          gender: { label: gender, value: gender },
          telephone,
          gradeLevel: { label: gradeLevel, value: gradeLevel },
          designation,
          // staffId,
          department,
          subDepartment,

          role: userRole && userRole._id,
        },
      });
    }
  }

  fetchDept = async () => {
    try {
      axios
        .get(`/v1/department`)
        .then((data) => this.setState({ department: data.data }));
    } catch (err) {
      console.log("Error while loading department", err);
    }
  };

  fetchRole = async () => {
    try {
      axios
        .get(`/v1/role`)
        .then((data) =>
          this.setState({
            role: data.data.filter(
              (p) => p.name != "Super Admin" && p.name != "Admin"
            ),
          })
        );
    } catch (err) {
      console.log("Error while loading roles", err);
    }
  };

  fetchSubDept = async (val) => {
    this.setState({ loading: true });
    try {
      axios
        .get(`/v1/department/details/${val._id}`)
        .then((data) =>
          this.setState({
            subDepartmentList: data.data.data.subDepartment,
            loading: false,
          })
        );
    } catch (err) {
      console.log("Error while loading sub department", err);
      this.setState({ loading: false });
    }
  };

  onSubmit = async (values) => {
    this.setState({ loading: true });

    const {
      firstName,
      lastName,
      email,
      gender,
      telephone,
      gradeLevel,
      designation,
      department,
      subDeparment,
      role,
    } = values;
    const { user } = this.props;

    const formData = {
      firstName,
      lastName,
      email,

      gender: gender && gender.value,
      telephone,
      gradeLevel: gradeLevel && gradeLevel.value,
      designation,

      ministry: user && user.ministry,
      department: department && department._id,
      subDeparment: subDeparment && subDeparment._id,
      isAdmin: false,
      isSuper: false,
      isStaff: true,

      userRole: role,
    };

    const { location } = this.props;
    const { state } = location;

    try {
      if (state && state.edit) {
        await axios
          .put(`/v1/user/update/${state.id}`, formData)
          .then(() => 
          this.setState({ 
            loading: false,
            message: 'Successfully updated', 
            showSuccess: true 
          }));
      } else {
        await axios
          .post(`/v1/user/add/staff`, formData)
          .then(() =>
          this.setState({ 
            loading: false,
            message: 'Successfully created', 
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
    const { showErrors, role, message, showSuccess, showFailed } = this.state;
    const { formData, loading, department, subDepartmentList } = this.state;
    const { id } = this.props.match.params;
    const { location } = this.props;
    const { state } = location;

    return (
      <>
        <MySecondaryNavigation
          l1Label="Admin dashboard"
          l1Link="/department"
          l2Label={state && state.edit ? "Update staff" : "Create staff"}
          l2Link="#"
          pageTitle={state && state.edit ? "Update staff" : "Create staff"}
        />
        <Loading active={loading} withOverlay={true} />
        <div className="wfp--module__background" style={{ minHeight: "400px" }}>
          <Wrapper pageWidth="lg" spacing="md" mobilePageWidth="full">
            <Form
              onSubmit={this.onSubmit}
              initialValues={formData}
              validate={(values) => {
                const { departmentValue } = this.state;
                const errors = {};
                const {
                  department,
                  firstName,
                  lastName,
                  email,
                  telephone,
                  gender,
                  designation,
                  role,
                } = values;

                if (
                  !firstName 
                ) {
                  errors.firstName = {
                    value: "Required",
                    show: showErrors,
                  };
                }

                if (
                  !lastName 
                ){
                  errors.lastName = {
                    value: "Required",
                    show: showErrors,
                  };
                }

                if (
                  !department 
                ){
                  errors.department = {
                    value: "Required",
                    show: showErrors,
                  };
                }

                if (!email ){
                  errors.email = {
                    value: "Required",
                    show: showErrors,
                  };
                }

                if (!telephone ){
                  errors.telephone = {
                    value: "Required",
                    show: showErrors,
                  };
                }

                if (!role ){
                  errors.role = {
                    value: "Required",
                    show: showErrors,
                  };
                }

                if (
                  department &&
                  department._id &&
                  department._id != departmentValue
                ) {
                  this.fetchSubDept(department);
                  this.setState({ departmentValue: department._id });
                }

                return errors;
              }}
              render={({ values, onSave, valid, reset }) => (
                <form>
                  <Module noMargin>
                    <ModuleHeader>
                      <span style={{ fontSize: 20 }}>Create Staff</span>
                    </ModuleHeader>
                    <ModuleBody>
                      <Row>
                        <Col md={6} sm={6} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              inputComponent={TextInput}
                              id="firstName"
                              name="firstName"
                              type="text"
                              labelText="First name"
                            />
                          </FieldWrapper>
                        </Col>

                        <Col md={5} sm={5} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              inputComponent={TextInput}
                              id="lastName"
                              name="lastName"
                              type="text"
                              labelText="Last name"
                            />
                          </FieldWrapper>
                        </Col>
                      </Row>

                      <Col md={6} sm={6} xs={12}>
                        <FieldWrapper>
                          <Field
                            component={ReduxFormWrapper}
                            inputComponent={TextInput}
                            id="email"
                            name="email"
                            type="text"
                            labelText="Email"
                          />
                        </FieldWrapper>
                      </Col>

                      <Col md={6} sm={6} xs={12}>
                        <FieldWrapper>
                          <Field
                            component={ReduxFormWrapper}
                            inputComponent={TextInput}
                            id="telephone"
                            name="telephone"
                            type="text"
                            labelText="Telephone"
                            helperText="Acceptable format is 2348021212121"
                          />
                        </FieldWrapper>
                      </Col>
                      <Row>
                        <Col md={6} sm={6} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              name="gender"
                              labelText="gender"
                              placeholder="Select gender"
                            >
                              {({ input, meta }) => (
                                <>
                                  <div className="wfp--label">Gender</div>
                                  <Select
                                    className="wfp--react-select-container auto-width"
                                    classNamePrefix="wfp--react-select"
                                    closeMenuOnSelect={true}
                                    options={gender}
                                    getOptionValue={(option) =>
                                      option["value"]
                                        ? option["value"]
                                        : option["id"]
                                    }
                                    getOptionLabel={(option) => option["label"]}
                                    {...input}
                                    {...meta}
                                  />
                                </>
                              )}
                            </Field>
                          </FieldWrapper>
                        </Col>

                        <Col md={5} sm={5} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              inputComponent={TextInput}
                              id="designation"
                              name="designation"
                              type="text"
                              labelText="Designation"
                            />
                          </FieldWrapper>
                        </Col>
                      </Row>

                      <Col md={6} sm={6} xs={12}>
                        <FieldWrapper>
                          <Field
                            component={ReduxFormWrapper}
                            name="gradeLevel"
                            labelText="Grade level"
                            placeholder="Select grade level"
                          >
                            {({ input, meta }) => (
                              <>
                                <div className="wfp--label">Grade level</div>
                                <Select
                                  className="wfp--react-select-container auto-width"
                                  classNamePrefix="wfp--react-select"
                                  closeMenuOnSelect={true}
                                  // onChange={(vars) => {
                                  //     this.languageChange(vars, originalOnChange)
                                  // }}
                                  options={gradeLevel}
                                  getOptionValue={(option) =>
                                    option["value"]
                                      ? option["value"]
                                      : option["id"]
                                  }
                                  getOptionLabel={(option) => option["label"]}
                                  {...input}
                                  {...meta}
                                />
                              </>
                            )}
                          </Field>
                        </FieldWrapper>
                      </Col>

                      <Row>
                        <Col md={6} sm={6} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              name="department"
                              labelText="Department"
                              placeholder="Select department"
                            >
                              {({ input, meta }) => (
                                <>
                                  <div className="wfp--label">Department</div>
                                  <Select
                                    className="wfp--react-select-container auto-width"
                                    classNamePrefix="wfp--react-select"
                                    closeMenuOnSelect={true}
                                    onChange={(val) => this.fetchSubDept(val)}
                                    options={department}
                                    getOptionValue={(option) => option["_id"]}
                                    getOptionLabel={(option) => option["name"]}
                                    {...input}
                                    {...meta}
                                  />
                                </>
                              )}
                            </Field>
                          </FieldWrapper>
                        </Col>

                        <Col md={5} sm={5} xs={12}>
                          <FieldWrapper>
                            <Field
                              component={ReduxFormWrapper}
                              name="subDepartment"
                              labelText="Sub Department"
                              placeholder="Select sub department"
                            >
                              {({ input, meta }) => (
                                <>
                                  <div className="wfp--label">
                                    Sub Department
                                  </div>
                                  <Select
                                    className="wfp--react-select-container auto-width"
                                    classNamePrefix="wfp--react-select"
                                    closeMenuOnSelect={true}
                                    options={subDepartmentList}
                                    getOptionValue={(option) => option["_id"]}
                                    getOptionLabel={(option) => option["name"]}
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
                            <Field component={ReduxFormWrapper} name="role">
                              {({ input, meta }) => {
                                return (
                                  <>
                                    <div className="wfp--label">
                                      Please select user role
                                    </div>
                                    {role.map((option, i) => (
                                      <>
                                        <RadioButton
                                          key={i}
                                          {...input}
                                          {...meta}
                                          labelText={option.name}
                                          value={option._id}
                                          checked={input.value === option._id}
                                          // disabled={}
                                        />
                                        <br />
                                      </>
                                    ))}
                                  </>
                                );
                              }}
                            </Field>
                          </FieldWrapper>
                        </Col>
                      </Row>
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
                          disabled={!valid}
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

const mapStateToProps = (state) => {
  return {
    userId: state.user._id,
  };
};

export default connect(mapStateToProps, null)(Create);

const FieldWrapper = styled.div`
  margin-bottom: 30px;
`;
