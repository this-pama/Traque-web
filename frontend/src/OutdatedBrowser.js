import React from "react";
import { Wrapper, Story, Icon } from "@wfp/ui";
import { iconWarningSolid } from "@wfp/icons";

const OutdatedBrowser = () => (
  <Wrapper>
    <Story className="wfp--story__center wfp--story__full-height">
      <Icon
        icon={iconWarningSolid}
        fill="#0a6eb4"
        width={"100px"}
        height={"100px"}
        style={{
          marginBottom: "3rem",
        }}
      />
      <h1 className="wfp--story__title">Outdated browser</h1>
    </Story>
    <div
      style={{
        margin: "-150px 100px 100px 100px",
        alignItems: "center",
        textAlign: "center",
        lineHeight: 2,
      }}
    >
      It looks like you are using Internet Explorer 11 or older as your
      favourite browser. We recommend that you switch to a more modern browser
      to ensure that you get the best experience out of this application. Please
      try again using either Mozilla Firefox, Google Chrome, Microsoft Edge, or
      Safari.
    </div>
  </Wrapper>
);

export default OutdatedBrowser;
