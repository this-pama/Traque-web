import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { iconChevronDown } from "@wfp/icons";
import { Icon, Modal } from "@wfp/ui";
import store from "../../../store";
import axios from "axios";
import { toast } from "react-toastify";
import Can from "../../../shared/Can";
import { Wrapper } from "../../../ManageFile/views/SectionColDef/Action";

const Action = (props) => {
  const { request_status, _id, reviewed_candidate, create_user } = props.data;
  const storeData = store.getState();

  const [isAction, setAction] = useState(false);
  const { user } = storeData;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  return (
    <Wrapper>
      <div style={{ dispaly: "inline" }}>
        <div style={{ dispaly: "inline" }}>
          <Link
            className="wfp--link"
            style={{ fontWeight: "bold" }}
            to={{
              pathname: "/create-department",
              state: { edit: true, id: _id, data: props.data },
            }}
          >
            EDIT
          </Link>

          <Can
            rules={permissions}
            userRole={userRole}
            perform={"manageSubDepartment"}
            yes={() => (
              <div
                style={{
                  borderRadius: "6px",
                  border: "2px solid rgb(11 119 193)",
                  cursor: "pointer",
                  float: "left",
                  marginLeft: 10,
                  background: "#1841BA",
                  padding: "3px 5px 4px",
                }}
                onClick={() => setAction(true)}
              >
                <Icon
                  className="wfp--link"
                  icon={iconChevronDown}
                  width={"8px"}
                  height={"8px"}
                  fill="#fff"
                  description="More actions"
                  className="dropbtn"
                />
              </div>
            )}
          />
        </div>
      </div>

      <Modal
        open={isAction}
        modalLabel="Other actions"
        primaryButtonText="Close"
        passiveModal
        onRequestClose={() => setAction(false)}
        onRequestSubmit={() => setAction(false)}
      >
        <Link className="wfp--link" to={"/create-sub-department/" + _id}>
          Add sub department
        </Link>

        <br />
        <br />
        <Link className="wfp--link" to={"/sub/department/" + _id}>
          View sub department
        </Link>
      </Modal>
    </Wrapper>
  );
};

export default Action;
