import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { iconChevronDown } from "@wfp/icons";
import { Icon, Modal, Loading } from "@wfp/ui";
import store from "../../../store";
import axios from "axios";
import { toast } from "react-toastify";
import Can from "../../../shared/Can";
import { Wrapper } from "../SectionColDef/Action";

const Action = (props) => {
  const { onValueChange } = props;
  const { _id } = props.data;
  const storeData = store.getState();

  const { user } = storeData;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  const [isAction, setAction] = useState(false);
  const [isAchive, setAchive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ showFailed, setShowFailed ] = useState(false);
  const [ showSuccess, setShowSuccess ]= useState(false);
  const [ message, setMessage ]= useState('');

  const onConfirm = async () => {
    setLoading(true);
    try {
      await axios
        .post(`/v1/file/receive/${_id}/${user && user._id}`)
        .then(() => setLoading(false));
          onValueChange();
          setMessage('Successfully acknowledged receipt of file')
          setShowSuccess(true)
    } catch (err) {
      setMessage('Error occurred, please try again');
      setShowFailed(true)
      setLoading(false);
    }

    setAction(false);
  };

  const onAchive = async () => {
    setLoading(true);
    try {
      await axios
        .post(`/v1/file/archive/${_id}/${user && user._id}`)
        .then(() => {
          setLoading(false);
          props.onValueChange && props.onValueChange();
          setMessage('file successfully archived')
          setShowSuccess(true)
        });
    } catch (err) {
      setMessage('Error occurred, please try again');
      setShowFailed(true)
      setLoading(false);
    }

    setAchive(false);
  };

  return (
    <Wrapper>
      <div style={{ dispaly: "inline" }}>
        <div style={{ dispaly: "inline" }}>
          <Can
            rules={permissions}
            userRole={userRole}
            perform={"transferFile"}
            yes={() => (
              <Link
                className="wfp--link"
                style={{ fontWeight: "bold", marginLeft: 10 }}
                to={{
                  pathname: "/forward/file/" + _id,
                  state: { edit: true, id: _id, data: props.data },
                }}
              >
                FORWARD
              </Link>
            )}
          />

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

          <Can
            rules={permissions}
            userRole={userRole}
            perform={"archiveFile"}
            yes={() => (
              <Link
                className="wfp--link"
                style={{ fontWeight: "bold", marginLeft: 10 }}
                to="#"
                onClick={() => setAchive(true)}
              >
                ARCHIVE
              </Link>
            )}
          />
        </div>
      </div>

      <Modal
        open={isAchive}
        primaryButtonText="Archive file"
        secondaryButtonText="Cancel"
        onRequestSubmit={onAchive}
        onRequestClose={() => setAchive(false)}
        modalLabel="Archive"
        wide={false}
        type="info"
      >
        <Loading active={loading} withOverlay={true} />
        <p className="wfp--modal-content__text">
          Are you sure you want to Archive this file?
        </p>
      </Modal>

      
          <Modal
              modalHeading=""
              modalLabel="SUCCESS"
              primaryButtonText="OK"
              onRequestClose={()=>setShowSuccess(false)}
              onRequestSubmit={()=>setShowSuccess(false)}
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

export default Action;
