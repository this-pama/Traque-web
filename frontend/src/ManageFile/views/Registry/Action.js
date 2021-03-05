import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  iconRestartGlyph,
  iconEditGlyph,
  iconDeleteGlyph,
  iconSave,
  iconAppServices,
} from "@wfp/icons";
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

  let filePerm = permissions
    ? permissions.includes("createManagementFile")
      ? "createManagementFile"
      : permissions.includes("createServiceFile")
      ? "createServiceFile"
      : "does-not-exit"
    : "does-not-exit";

  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.put(`/v1/file/delete/${_id}`).then(() => {
        setLoading(false);
        props.onValueChange && props.onValueChange();
        setMessage('File has been successfully deleted')
        setShowSuccess(true)
      });
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
          setMessage('Successfully archived')
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
                to={{
                  pathname: "/forward/file/" + _id,
                  state: { edit: true, id: _id, data: props.data },
                }}
              >
                <Icon
                  class="wfp--link"
                  icon={iconRestartGlyph}
                  width={14}
                  height={14}
                  fill="#1841BA"
                  description="FORWARD"
                />
              </Link>
            )}
          />
          <span style={{ paddingLeft: 20 }} />

          <Can
            rules={permissions}
            userRole={userRole}
            perform={filePerm}
            yes={() => (
              <Link
                to={{
                  pathname: "/create-file",
                  state: { edit: true, id: _id, data: props.data },
                }}
              >
                <Icon
                  class="wfp--link"
                  icon={iconEditGlyph}
                  width={14}
                  height={14}
                  fill="#1841BA"
                  description="EDIT"
                />
              </Link>
            )}
          />

          <span style={{ paddingLeft: 20 }} />
          <Can
            rules={permissions}
            userRole={userRole}
            perform={"deleteFile"}
            yes={() => (
              <Icon
                class="wfp--link"
                icon={iconDeleteGlyph}
                width={14}
                height={14}
                fill="#1841BA"
                description="DELETE"
                onClick={() => setAction(true)}
              />
            )}
          />

          <span style={{ paddingLeft: 20 }} />
          <Can
            rules={permissions}
            userRole={userRole}
            perform={"archiveFile"}
            yes={() => (
              <Icon
                class="wfp--link"
                icon={iconAppServices}
                width={14}
                height={14}
                fill="#1841BA"
                description="ARCHIVE"
                onClick={() => setAchive(true)}
              />
            )}
          />
        </div>
      </div>

      <Modal
        open={isAction}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onRequestSubmit={onDelete}
        onRequestClose={() => setAction(false)}
        modalLabel="Delete"
        wide={false}
        danger
        type="danger"
      >
        <Loading active={loading} withOverlay={true} />
        <p className="wfp--modal-content__text">
          Are you sure you want to delete this file?
        </p>
      </Modal>

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
