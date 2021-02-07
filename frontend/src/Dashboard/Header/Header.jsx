import React from 'react'
import styled from 'styled-components'

const Header = ({ title, count = null }) => (
    <HeaderWrapper>
        <h5>DASHBOARD</h5>
        <h3>
            {title} {count ? <span>({count} in total)</span> : null}
        </h3>
    </HeaderWrapper>
)

export default Header

const HeaderWrapper = styled.header`
    margin: 0 0 15px;
    h5 {
        font-weight: 500;
        color: #8c9ba5;
        text-transform: uppercase;
        font-size: 14px;
    }
    h3 {
        font-weight: 500;
        color: #031c2d;
        font-size: 25px;

        span {
            font-weight: 300;
            font-size: 14px;
        }
    }
`
