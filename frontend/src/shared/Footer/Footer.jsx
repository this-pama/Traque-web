import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    background-color: #EEF1FA;  
    color: #1841BA;
    text-align: center;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    font-size: 12px;
    font-weight: bold;
`

const Header = (props)=>{

    return(
        <Wrapper >
            <div style={{ padding : 20 }}>
                Copyright {new Date().getFullYear()} &#64; Traquer
            </div>
        </Wrapper>
    )
}

export default Header;