import React from 'react'
import styled from 'styled-components'
import Logo from '../../assets/logo.png'
import { iconHome } from '@wfp/icons';
import { Icon } from '@wfp/ui';

const Wrapper = styled.div`
    background-color: #1841BA;
    color: #fff;
    // text-align: center;
    width: 100%;            
    .wrapper{
        margin: 2rem;
        display: flex;
    }
    .text-wrapper {
        justfy-content: center;
        align-item: center;
        margin: 2rem;
        text-align: center;
        // position: absolute;
    }
    input[type=text] {
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        background-color: #3CBC8D;
        color: white;
        transition: width 0.4s ease-in-out;
      }
      input[type=text]:focus {
        width: 100%;
      }

    // .wfp--input{
    //     border-color: #fff;
    // }
`

const Header = (props)=>{

    return(
        <Wrapper >
            <div className='wrapper'>
                <img src={Logo} alt="Logo" style={{ width: 80, height: 80 }} />
                <div className='text-wrapper'>
                    <input type="text" />
                        {/* <Icon icon={iconHome} width={100} height={100} /> */}
                    
                </div>
            </div>
        </Wrapper>
    )
}

export default Header;