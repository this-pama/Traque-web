import React, { useState, useEffect } from "react";
import useSWR, { trigger } from "swr";
import { Button, ReduxFormWrapper, Loading } from "@wfp/ui";
import { iconAddOutline, iconDocument } from "@wfp/icons";

import { Row, Col } from "react-flexbox-grid";
import Select from "react-select";
import { Form, FormSpy, Field } from "react-final-form";
import axios from 'axios'

import store from "../../../store";
import Can from "../../../shared/Can";
import Filter from '../Filter/Filter'
import getColumnDefs from "../../../shared/columnDefs";

import { Doughnut, Pie, Bar, Radar } from 'react-chartjs-2';
import Grid from "../../../Dashboard/Grid";
import colDef from "./colDef";

const filters = [
  {
    title: "Total files",
    role: "Type",
    amountLabel: "FILE",
    value: 'totalFile',
  },
  {
    title: "Total files exceeded SLA",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'totalFileExceedSla'
  },
  {
    title: "Avg processed file/day",
    role: "Type",
    amountLabel: "FILE",
    value: 'avgPerDay'
  },
  {
    title: "Avg processed file/week",
    role: "Type",
    amountLabel: "FILE",
    // warning: true,
    value: 'avgPerWeek'
  },
  {
    title: "Avg processed file/month",
    role: "Type",
    amountLabel: "FILE",
    value: 'avgPerMonth'
  },
  {
    title: "SLA between 0-30 days",
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSla30'
  },
  {
    title: "SLA Between 31-60 days",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSlaBtw30_60'
  },
  {
    title: "SLA Between 61-90 days",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSlaBtw60_90'
  },
  {
    title: "SLA between 91-120 days",
    // warning: true,
    role: "Type",
    amountLabel: "FILE",
    value: 'TtFileExceedSla90'
  },
  {
    title: "SLA above 121 days",
    role: "Type",
    amountLabel: "FILE",
    value: 'slaAbove121'
  },  
];

const View = ({ props }) => {
  const storeData = store.getState();
  const { user } = storeData;
  const [ loading, setLoading ] = useState(false);

  const endpoint = `/v1/settings/department/reports/${user && user.department}`;

  const { data } = useSWR(endpoint);
  const fetchData = () => trigger(endpoint);
  const applications = data ? data.data : null;

  useEffect(()=>{
  }, [ applications ])

  return (
    <>
      <Loading active={loading} withOverlay={true} />

      <Filter
        data={applications}
        filters={filters}
        fetchData={fetchData}
      />
      

      <Grid 
        data={applications && applications.data ? applications.data : []}
        config={getColumnDefs("viewDepartmentReport", fetchData)}
        exportFileName={"Department wide reports"}
      />
      
    </>
  );
};

export default View;
