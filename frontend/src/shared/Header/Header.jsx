import React from "react";
import styled from "styled-components";
import { iconHeaderAvatar } from "@wfp/icons";
import { Icon } from "@wfp/ui";

const Wrapper = styled.div`
  background-color: #eef1fa;
  color: #1841ba;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  text-align: right;
  padding-right: 10rem;
  font-size: 14px;
  .account {
    margin: 0.7rem;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    text-align: left !important;
    background-color: #fff;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-content a:hover {
    background-color: #ddd;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown:hover {
    background-color: #eef1fa;
  }
`;

const Header = (props) => {
  return (
    <Wrapper>
      <div className="background">
        <div className="account">
          <div class="dropdown">
            <Icon
              icon={iconHeaderAvatar}
              color={"#1841BA"}
              width={20}
              height={20}
            />
            {`  `} <span style={{ paddingTop: -20 }}>Hi,</span>
            <div class="dropdown-content">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Header;
