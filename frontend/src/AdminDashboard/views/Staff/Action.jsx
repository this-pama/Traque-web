import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { iconChevronDown } from "@wfp/icons";
import { Icon, Modal, Loading } from "@wfp/ui";
import axios from "axios";
import { toast } from "react-toastify";
import { Wrapper } from "../../../ManageFile/views/SectionColDef/Action";

const Action = (props) => {
  const { _id, disable, email, accountId } = props.data;
  const [isAction, setAction] = useState(false);
  const [isKey, setKey] = useState(false);
  const [isPassword, setPassword] = useState(false);
  const [isDisable, setDisable] = useState(false);
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

  const resetPassword = async () => {
    setAction(false);
    setLoading(true);
    try {
      await axios.post(`/v1/account/forgot`, { email: email }).then(() => {
        setLoading(false);
        props.onValueChange && props.onValueChange();
        toast("Password successfully reset for user", {
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

    setPassword(false);
  };

  const disableAccount = async () => {
    setAction(false);
    setLoading(true);
    try {
      await axios
        .post(`/v1/account/disable/${accountId && accountId._id}`, {
          disable: accountId ? !accountId.disable : false,
        })
        .then(() => {
          setLoading(false);
          props.onValueChange && props.onValueChange();
          toast("Account successfully updated", {
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

    setDisable(false);
  };

  return (
    <Wrapper>
      <Link
        className="wfp--link"
        style={{ fontWeight: "bold" }}
        to={{
          pathname: "/create-staff",
          state: { edit: true, id: _id, data: props.data },
        }}
      >
        EDIT
      </Link>

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
          width={"8"}
          height={"8"}
          fill="#fff"
          description="More actions"
          className="dropbtn"
        />
      </div>

      <Modal
        open={isAction}
        modalLabel="Other actions"
        primaryButtonText="Close"
        passiveModal
        onRequestClose={() => setAction(false)}
        onRequestSubmit={() => setAction(false)}
      >
        <Link className="wfp--link" to="#" onClick={() => setKey(true)}>
          Resend Activation key
        </Link>

        {accountId && (
          <>
            <br />
            <br />
            <Link
              className="wfp--link"
              to="#"
              onClick={() => setPassword(true)}
            >
              Reset password
            </Link>
          </>
        )}

        {accountId && (
          <>
            <br />
            <br />
            <Link className="wfp--link" to="#" onClick={() => setDisable(true)}>
              {accountId && accountId.disable ? "Activate " : "Disable "}{" "}
              account
            </Link>
          </>
        )}
      </Modal>

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

      <Modal
        open={isPassword}
        primaryButtonText="Reset password"
        secondaryButtonText="Cancel"
        onRequestSubmit={resetPassword}
        onRequestClose={() => setPassword(false)}
        modalLabel="Reset Password"
        wide={false}
        type="info"
      >
        <Loading active={loading} withOverlay={true} />
        <p className="wfp--modal-content__text">
          Are you sure you want to Reset password for this user?
        </p>
      </Modal>

      <Modal
        open={isDisable}
        primaryButtonText={
          accountId && accountId.disable ? "Activate " : "Disable"
        }
        secondaryButtonText="Cancel"
        onRequestSubmit={disableAccount}
        onRequestClose={() => setDisable(false)}
        modalLabel={
          accountId && accountId.disable
            ? "Activate Account"
            : "Disable Account"
        }
        wide={false}
        type="info"
      >
        <Loading active={loading} withOverlay={true} />
        <p className="wfp--modal-content__text">
          {`Are you sure you want to ${
            accountId && accountId.disable ? "activate" : "disable"
          } account for this user?`}
        </p>
      </Modal>
    </Wrapper>
  );
};

export default Action;
