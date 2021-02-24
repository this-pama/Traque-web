import React from "react";
import { Wrapper, Story, Icon } from "@wfp/ui";
import { iconWarningSolid } from "@wfp/icons";

const NotAuthorized = () => (
  <Wrapper pageWidth="lg" spacing="md">
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
      <h1 className="wfp--story__title">Not authorized</h1>
      <p>Sorry, you are not authorized to access this page.</p>
    </Story>
  </Wrapper>
);

export default NotAuthorized;
