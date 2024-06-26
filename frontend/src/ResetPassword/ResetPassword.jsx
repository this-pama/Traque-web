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
} from "@wfp/ui";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Wrapper = styled.div`
  .login {
    width: 100vw;
    height: 100vh;
    background-color: #193a9d;
    background-image: url('/background.png');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
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
      font-size: 1rem;
      margin-top: 0rem;
      display: flex;
      align-items: center;
      justify-content: center;
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
  const [code, setCode] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    let formData;
    try {
      formData = {
        email: values.email,
      };

      await axios.post(`/v1/account/forgot`, formData).then((data) => {
        if (data.data.success) {
          setCode(true);
        } else {
          toast.error("Ooops! error occurred. Please try again", {
            closeOnClick: true,
            autoClose: 1000,
          });
        }
        setLoading(false);
      });
    } catch (err) {
      console.log("Error occurred", err);
      toast.error("Ooops! erro occured", {
        closeOnClick: true,
        autoClose: 1000,
      });
      setLoading(false);
    }
  };

  const resetCode = async (values) => {
    setLoading(true);
    let formData;
    try {
      formData = {
        password: values.password,
        confirmPassword: values.confirm,
      };

      await axios
        .post(`/v1/account/reset/${values.code}`, formData)
        .then((data) => {
          if (data.data.success) {
            toast("Successfully reset password", {
              closeOnClick: true,
              autoClose: 1000,
            });
            props.history.push("/login");
          } else {
            data.data.message
              ? toast.error(data.data.message, {
                  closeOnClick: true,
                  autoClose: 1000,
                })
              : toast.error("Ooops! error occurred. Please try again", {
                  closeOnClick: true,
                  autoClose: 1000,
                });
          }
          setLoading(false);
        });
    } catch (err) {
      console.log("Error occurred", err);
      toast.error("Ooops! erro occured", {
        closeOnClick: true,
        autoClose: 1000,
      });
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="login">
        <div className="login--banner">
          <img src={Logo} alt="Logo" style={{ width: 200, height: 150 }} />
        </div>
        <div className="login--border">
          <p className="login--paragraph">
            A code will be sent to your email address.
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
                              render={({
                                handleSubmit,
                                submitError,
                                form,
                                submitting,
                                pristine,
                                values,
                                errors,
                              }) => (
                                <form
                                  className="wfp--form-long"
                                  // onSubmit={handleSubmit}
                                >
                                  {code == false ? (
                                    <div>
                                      <FormGroup className="some-class">
                                        <Field
                                          component={ReduxFormWrapper}
                                          inputComponent={TextInput}
                                          id="email"
                                          name="email"
                                          type="text"
                                          labelText="Email"
                                        />

                                        <div
                                          style={{
                                            paddingBottom: 20,
                                          }}
                                        >
                                          <div
                                            className="button"
                                            type="submit"
                                            onClick={() => onSubmit(values)}
                                          >
                                            SUBMIT
                                          </div>
                                        </div>
                                      </FormGroup>
                                    </div>
                                  ) : (
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
                                          labelText="New Password"
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
                                          style={{
                                            paddingBottom: 10,
                                          }}
                                        >
                                          <div
                                            className="button"
                                            type="submit"
                                            onClick={() => resetCode(values)}
                                          >
                                            SUBMIT
                                          </div>
                                        </div>
                                      </FormGroup>
                                    </div>
                                  )}
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
          {/* <div className='footer' >
                            Already registered?
                        <span style={{ color: 'white', fontWeight: 'bold' }}>
                            {`  `}
                            <Link className='link' to='/login'>Login</Link>
                        </span>
                    </div> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default Login;
