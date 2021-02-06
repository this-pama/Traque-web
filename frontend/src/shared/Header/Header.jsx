import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    background-color: #EEF1FA;
    color: #1841BA;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    text-align: right;
    padding-right: 10rem;
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
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .dropdown-content a {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content a:hover {background-color: #ddd;}

    .dropdown:hover .dropdown-content {display: block;}

    .dropdown:hover {background-color: #EEF1FA; }
`

const Header = (props)=>{

    return(
        <Wrapper >
            <div className='background'>
            <div className='account'>
                <div class="dropdown">
                    Hi,
                <div class="dropdown-content">
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                </div>
                </div>
            </div>
            </div>
        </Wrapper>
    )
}

export default Header;