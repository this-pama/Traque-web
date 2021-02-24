import React, { useState } from "react";
import styled from "styled-components";
import Tile from "./Tile";

// filters props structure:
// [
//     {
//         title:"Pending Screening",
//         role: "Screener",
//         warning: true, (optional)
//         comparator: rowData => rowData.status.grouping === 'released_director',
//     }
// ]

const useFilterTiles = ({ data, filters, hideEmptyTiles }) => {
  const [activeFilterIndex, setActiveFilterIndex] = useState(null);

  if (!data || !filters) return [null, null];
  // TODO optimize counting
  filters = filters
    .map((f) => ({
      ...f,
      count: data.filter((d) => f.comparator(d)).length,
    }))
    .filter((filter) => !(hideEmptyTiles && filter.count === 0));
  let filteredData = data;
  if (activeFilterIndex !== null) {
    filteredData = data.filter(filters[activeFilterIndex].comparator);
  }

  const handleFilterChange = (filterIndex) => {
    if (activeFilterIndex === filterIndex) {
      setActiveFilterIndex(null);
    } else {
      setActiveFilterIndex(filterIndex);
    }
  };
  const tiles = (
    <TilesWrapper stretch={filters.length >= 4}>
      {filters.map((filter, i) => {
        const { count, warning, title, role, amountLabel } = filter;
        return (
          <Tile
            key={i}
            onClick={() => {
              handleFilterChange(i);
            }}
            header={title}
            amount={count}
            warning={count !== 0 && warning}
            active={activeFilterIndex === i}
            amountLabel={amountLabel}
          />
        );
      })}
    </TilesWrapper>
  );

  return [filteredData, tiles];
};

export default useFilterTiles;

const TilesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${(props) =>
    props.stretch ? "space-between" : "flex-start"};
  & > * {
    margin-right: ${(props) => (props.stretch ? "0px" : "20px")};
  }
`;
