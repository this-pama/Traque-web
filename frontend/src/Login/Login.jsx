import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import LoginIcon from "../assets/login2.png";
import { Grid, Row, Col } from "react-flexbox-grid";
import { Form, Field } from "react-final-form";
import {
  Checkbox,
  FormGroup,
  TextInput,
  Loading,
  ReduxFormWrapper,
} from "@wfp/ui";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import store from "../store";
import { getUserData } from "../store/actions";

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
      // display: flex;
      // align-items: center;
      // justify-content: center;
    }
    &--paragraph {
      font-size: 0.8rem;
      margin-top: -2rem;
      // display: flex;
      // align-items: center;
      // justify-content: ;
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
      font-size: 12px;
      padding-top: 1rem;
      // position: absolute;
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

  const onSubmit = async (values) => {
    setLoading(true);
    let formData;
    try {
      formData = {
        email: values.email,
        password: values.password,
      };

      await axios.post(`/v1/account/login`, formData).then((data) => {
        if (data.data) {
          store.dispatch(getUserData(data.data));
        }
        if (data.data && data.data.isSuper) {
          props.history.push("/ministry");
        } else if (data.data && data.data.isAdmin) {
          props.history.push("/department");
        } else if (data.data && data.data.isStaff) {
          props.history.push("/file");
        }
        setLoading(false);
      });
    } catch (err) {
      console.log("Ooops! login failed", err);
      toast.error("Ooops! login failed", {
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
                  src={LoginIcon}
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
                              render={({ values, errors }) => (
                                <form
                                  className="wfp--form-long"
                                  // onSubmit={handleSubmit}
                                >
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

                                      <Field
                                        component={ReduxFormWrapper}
                                        inputComponent={TextInput}
                                        id="password"
                                        name="password"
                                        type="password"
                                        labelText="Password"
                                      />

                                      <div
                                        className="button"
                                        type="submit"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onSubmit(values);
                                        }}
                                      >
                                        LOGIN
                                      </div>
                                    </FormGroup>
                                  </div>
                                </form>
                              )}
                            />

                            <div className="footer">
                              <div style={{ float: "left" }}>
                                <Checkbox
                                  // checked
                                  id="check-2"
                                  labelText="Remember me"
                                  // onChange={function noRefCheck(){}}
                                />
                              </div>
                              <div
                                style={{
                                  float: "right",
                                  cursor: "pointer",
                                }}
                              >
                                <Link to="/reset-password">
                                  Forgot password?
                                </Link>
                              </div>
                            </div>
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
          <Link className="link" to={"/activate"}>
            Activate account
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default Login;
