import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { iconChevronDown } from "@wfp/icons";
import { Icon, Modal, Loading } from "@wfp/ui";
import store from "../../../store";
import axios from "axios";
import { toast } from "react-toastify";
import Can from "../../../shared/Can";

const Action = (props) => {
  const { onValueChange } = props;
  const { _id } = props.data;
  const storeData = store.getState();

  const { user } = storeData;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  const [isAction, setAction] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Wrapper>
      <div style={{ dispaly: "inline" }}>
        <div style={{ dispaly: "inline" }}>
          {/* <Can
                        rules={permissions}
                        userRole={userRole}
                        perform={'viewFileHistory'}
                        yes={() => ( */}
          <Link
            className="wfp--link"
            style={{ fontWeight: "bold", marginLeft: 10 }}
            to={{
              pathname: `/history/file/${_id}`,
            }}
          >
            VIEW HISTORY
          </Link>
          {/* )}
                    /> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default Action;

export const Wrapper = styled.div`
  div:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
  }
  a.wfp--link {
    float: left;
    color: #fbfcfc;
    font-size: 8px;
    background: #1841ba;
    border-radius: 6px;
    padding: 4px 10px;
    // height: 27px;
    display: inline-block;
    -webkit-text-decoration: none;
    text-decoration: none;
  }
  // @media (min-width: 600px) {
  .wfp--modal-container {
    min-width: 280px;
  }
  // }
`;
