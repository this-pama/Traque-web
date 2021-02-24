import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { iconChevronDown } from "@wfp/icons";
import store from "../../../store";
import Can from "../../../shared/Can";
import { Wrapper } from "../SectionColDef/Action";

const Action = (props) => {
  const { onValueChange } = props;
  const { _id } = props.data;
  const storeData = store.getState();

  const { user } = storeData;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  return (
    <Wrapper>
      <div style={{ dispaly: "inline" }}>
        <div style={{ dispaly: "inline" }}>
          <Can
            rules={permissions}
            userRole={userRole}
            perform={"viewFileHistory"}
            yes={() => (
              <Link
                className="wfp--link"
                style={{ fontWeight: "bold", marginLeft: 10 }}
                to={{
                  pathname: `/history/file/${_id}`,
                }}
              >
                VIEW HISTORY
              </Link>
            )}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default Action;
