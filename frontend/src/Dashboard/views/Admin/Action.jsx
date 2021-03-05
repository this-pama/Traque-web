import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Wrapper } from "../../../ManageFile/views/SectionColDef/Action";
import { Icon, Modal, Loading } from "@wfp/ui";

import axios from "axios";
import { toast } from "react-toastify";

const Action = (props) => {
  const { _id } = props.data;
  const [isKey, setKey] = useState(false);
  const [isAction, setAction] = useState(false);
  const [loading, setLoading] = useState(false);

  const resendKey = async () => {
    setAction(false);
    setLoading(true);
    try {
      await axios.get(`/v1/user/activation/resend/${_id}`).then(() => {
        setLoading(false);
        props.onValueChange && props.onValueChange();
        toast("Activation key successfully sent to user", {
          closeOnClick: true,
          autoClose: 1000,
        });
        window.location.reload();
      });
    } catch (err) {
      toast.error("Ooops! error occurred, please try again", {
        closeOnClick: true,
        autoClose: 1000,
      });
      setLoading(false);
    }

    setKey(false);
  };

  return (
    <Wrapper>
      <Link
        className="wfp--link"
        style={{ fontWeight: "bold" }}
        to={{
          pathname: "/create-admin",
          state: { edit: true, id: _id, data: props.data },
        }}
      >
        Edit
      </Link>

      <Link
        className="wfp--link"
        style={{ fontWeight: "bold",  marginLeft: 10  }}
        onClick={() => setKey(true)}
      >
        Resend Activation key
      </Link>

      <Modal
        open={isKey}
        primaryButtonText="Resend"
        secondaryButtonText="Cancel"
        onRequestSubmit={resendKey}
        onRequestClose={() => setKey(false)}
        modalLabel="Resend activation key"
        wide={false}
        type="info"
      >
        <Loading active={loading} withOverlay={true} />
        <p className="wfp--modal-content__text">
          Are you sure you want to Resend activation key to user?
        </p>
      </Modal>
    </Wrapper>
  );
};

export default Action;
