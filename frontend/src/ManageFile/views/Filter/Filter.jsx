import React, { useEffect } from "react";
import { Loading } from "@wfp/ui";
import useFilterTiles from './useFilterTiles';
import Header from '../../../Dashboard/Header';

const Applicants = ({
  data,
  filters,
  fetchData,
  title,
  gridConfig,
  middle,
  hideEmptyTiles,
  sortModel,
  exportFileName,
}) => {
  useEffect(() => {
    const getData = async () => fetchData();
    getData();
  }, []);
  const [filteredApplications, filterTiles] = useFilterTiles({
    data: data ? data : null,
    filters: filters,
    hideEmptyTiles,
  });
  // if (!filteredApplications || !filterTiles)
  //   return <Loading active withOverlay={true} />;

  return (
    <>
      {middle || null}
      <Header ></Header>
      {filterTiles}
    </>
  );
};

export default Applicants;
