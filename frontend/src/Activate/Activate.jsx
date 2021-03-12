import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import SignUp from "../assets/signup.png";
import { Grid, Row, Col } from "react-flexbox-grid";
import { Form, Field } from "react-final-form";
import {
  Checkbox,
  FormGroup,
  TextInput,
  Loading,
  ReduxFormWrapper,
  Modal,
} from "@wfp/ui";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Wrapper = styled.div`
  .login {
    // width: 100vw;
    // height: 100vh;
    background-color: #193a9d;
    // background-image: url(${Logo})
    color: #fff;
    text-align: center;
    &--banner {
      width: 20px;
      min-height: 20px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      // padding: 30px;
    }
    &--title {
      text-transform: uppercase;
      font-weight: 600;
      font-size: 1.6rem;
      margin: 1rem 0;
    }
    &--border {
      margin: 0 20rem 0 20rem;
      align-items: center;
      justify-content: center;
      align-items: center;
    }
    &--description {
      font-size: 0.8rem;
      // margin: 1rem 0;
      justify-content: center;
      align-item: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &--paragraph {
      font-size: 0.8rem;
      margin-top: -2rem;
      display: flex;
      align-items: center;
      justify-content: ;
      padding-bottom: 1rem;
    }
    &&--card {
      align-items: center;
      justify-content: ;
      display: flex;
      color: red;
    }
    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      background-color: #fff;
      color: #193a9d;
      padding: 1rem;
      border-radius: 10px;
    }
    .card:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }
    .container {
      padding: 2px 16px;
    }
    .button {
      padding: 1rem;
      background-color: #1841ba;
      color: #fff;
      font-weight: bold;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    .link {
      color: #fff;
    }

    .footer {
      // display: flex;
      color: #aeafb0;
      font-size: 14px;
      // padding-top: 1rem;
      padding-bottom: 2rem;
    }
    .wfp--label {
      color: #1841ba;
    }
    .wfp--input {
      border-radius: 0.5rem;
    }
  }
`;

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [ showFailed, setShowFailed ] = useState(false);
  const [ showSuccess, setShowSuccess ]= useState(false);
  const [ message, setMessage ]= useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    let formData;
    try {
      formData = {
        password: values.password,
        confirmPassword: values.confirm,
      };

      await axios
        .post(`/v1/user/validate`, { activationKey: values.code })
        .then(async (data) => {
          if (data.data.message && data.data.message == "success") {
            return activate(data.data, formData);
          }
          setLoading(false);

          setMessage('Activation code has either expired or has been used');
          setShowSuccess(true)
          return;
        });
    } catch (err) {
        setMessage('Activation code has either expired or has been used');
        setShowFailed(true)
        setLoading(false);
    }
  };

  const activate = async (data, formData) => {
    const { userId } = data.data.key;
    const { email } = data.data.user;
    await axios
      .post(`/v1/user/activate/${userId}`, { ...formData, email })
      .then((res) => {
        if (res.data && res.data.message == "success") {
          setMessage('Account activation successful');
          setShowSuccess(true)
        }

        setMessage('Error occurred, please try again');
        setShowFailed(true)

        setLoading(false);
      })
      .catch((e) => {
        setMessage('Error occurred, please try again');
        setShowFailed(true)
        setLoading(false);
      });
  };

  return (
    <Wrapper>
      <div className="login">
        <div className="login--banner">
          <img src={Logo} alt="Logo" style={{ width: 200, height: 150 }} />
        </div>
        <div className="login--border">
          <p className="login--paragraph">
            Traquer is a simulation of physical file movement
            from one office desk/department to another.
          </p>
        </div>
        <div className="login--border">
          <Loading active={loading} withOverlay={true} />
          <div>
            <div class="card">
              <div style={{ justifyContent: "center", alignItems: "center" }}>
                <img
                  src={SignUp}
                  alt="Logo"
                  style={{ width: "30%", height: "30%" }}
                />
              </div>
              <div class="container">
                <Form
                  onSubmit={onSubmit}
                  // initialValues={formData}
                  validate={(values) => {
                    const errors = {};
                    const { password, email } = values;

                    if (!email) {
                      errors.email = {
                        value: "Email required",
                      };
                    }
                    if (!password) {
                      errors.password = {
                        value: "Password required",
                      };
                    }
                    return errors;
                  }}
                  render={({ values, onSave, valid, reset }) => (
                    <form>
                      <Grid fluid>
                        <Row>
                          <Col xs={2} md={2} />
                          <Col xs={8} md={8}>
                            <Form
                              onSubmit={onSubmit}
                              render={({ values, errors }) => (
                                <form className="wfp--form-long">
                                  <div>
                                    <FormGroup className="some-class">
                                      <Field
                                        component={ReduxFormWrapper}
                                        inputComponent={TextInput}
                                        id="code"
                                        name="code"
                                        type="text"
                                        labelText="Activation code"
                                      />

                                      <Field
                                        component={ReduxFormWrapper}
                                        inputComponent={TextInput}
                                        id="password"
                                        name="password"
                                        type="password"
                                        labelText="Password"
                                      />

                                      <Field
                                        component={ReduxFormWrapper}
                                        inputComponent={TextInput}
                                        id="confirm"
                                        name="confirm"
                                        type="password"
                                        labelText="Confirm Password"
                                      />

                                      <div
                                        className="button"
                                        type="submit"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onSubmit(values);
                                        }}
                                      >
                                        SIGN UP
                                      </div>
                                    </FormGroup>
                                  </div>
                                </form>
                              )}
                            />
                          </Col>
                          <Col xs={2} md={2} />
                        </Row>
                      </Grid>
                    </form>
                  )}
                />
              </div>
            </div>
          </div>
          <div style={{ paddingTop: 20 }} />
          <div className="footer">
            Already registered?
            <span style={{ color: "white", fontWeight: "bold" }}>
              {`  `}
              <Link className="link" to="/login">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>

          <Modal
              modalHeading=""
              modalLabel="SUCCESS"
              primaryButtonText="OK"
              onRequestClose={()=>setShowSuccess(false)}
              onRequestSubmit={()=>props.history.push("/login")}
              open={showSuccess}
            >
              {message}
            </Modal>

            <Modal
              modalHeading=""
              modalLabel="Ooops!!!"
              primaryButtonText="Try again"
              onRequestClose={()=>setShowFailed(false)}
              onRequestSubmit={()=>setShowFailed(false)}
              open={showFailed}
              type='danger'
              danger
            >
              {message}
            </Modal>
    </Wrapper>
  );
};

export default Login;
