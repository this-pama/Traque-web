import React from "react";
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
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import MiddleWraper from "../shared/MiddleHeader";

const Wrapper = styled.div`
    // background-color: #fff;
}
`;

const Login = () => {
  return (
    <div>
      <Header />
      <MiddleWraper />
      <Footer />
    </div>
  );
};

export default Login;
