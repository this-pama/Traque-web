import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import store from "../../../store";
import Can from "../../../shared/Can";
import { Wrapper } from "../SectionColDef/Action";
import { Icon, Modal, Loading } from "@wfp/ui";

import getColumnDefs from "../../../shared/columnDefs";
import Grid from "../../../Dashboard/Grid";
import useSWR, { trigger } from "swr";

const Action = (props) => {
  const { request_status, _id, reviewed_candidate, create_user, ministry } = props.data;
console.log('props.data', props.data)
  const storeData = store.getState();

  const { user } = storeData;
  const permissions = user && user.userRole ? user.userRole.permission : [];
  const userRole = user && user.userRole ? user.userRole.name : null;

  const [isAction, setAction] = useState(false);
  const [loading, setLoading] = useState(false);

  const endpoint = `/v1/settings/ministry/reports/${ministry && ministry.ministry ? ministry.ministry._id : null}`;

  const { data } = useSWR(endpoint);
  const fetchData = () => trigger(endpoint);
  const applications = data ? data.data : null;


  return (
    <Wrapper>
      <div style={{ dispaly: "inline" }}>
        <div style={{ dispaly: "inline" }}>
              <Link
                className="wfp--link"
                style={{ fontWeight: "bold" }}
                onClick={()=> setAction(true)}
              >
                See more...
              </Link>
        </div>
      </div>

      <Modal
        open={isAction}
        primaryButtonText="Close"
        // secondaryButtonText="Cancel"
        onRequestSubmit={() => setAction(false)}
        onRequestClose={() => setAction(false)}
        modalLabel="Departmental reports"
        modalHeading="Departments"
        wide={true}
        type="info"
      >
        <Loading active={loading} withOverlay={true} />
        
        <Grid 
          data={applications && applications.data ? applications.data : []}
          config={getColumnDefs("viewMinistryReport2", fetchData)}
          exportFileName={"Department wide reports"}
          // sortModel={sortModel}
        />
      </Modal>

    </Wrapper>
  );
};

export default Action;
