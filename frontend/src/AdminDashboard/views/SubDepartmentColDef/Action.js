import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Wrapper } from "../../../ManageFile/views/SectionColDef/Action";

const Action = (props) => {
  const { _id, department } = props.data;

  const [isAction, setAction] = useState(false);

  return (
    <Wrapper>
      <div style={{ dispaly: "inline" }}>
        <div style={{ dispaly: "inline" }}>
          <Link
            className="wfp--link"
            style={{ fontWeight: "bold" }}
            to={{
              pathname: "/create-sub-department/" + department,
              state: { edit: true, id: _id, data: props.data },
            }}
          >
            Edit sub department
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default Action;
