import React from 'react'
import styled from 'styled-components'
import Logo from '../../assets/logo.png'
import { iconHome } from '@wfp/icons';
import { Icon, TextInput, Search   } from '@wfp/ui';
import { Col, Row } from 'react-flexbox-grid'

const Wrapper = styled.div`
    background-color: #1841BA;
    color: #fff;
    // text-align: center;
    width: 100%;            
    .wrapper{
        margin: 2rem 0 1rem 2rem;
        display: flex;
    }
    .text-wrapper {
        justfy-content: center;
        align-item: center;
        margin-top: 2rem;
        text-align: center;
        // position: absolute;
    }

    .wfp--search--lg .wfp--search-input {
        background-color: #1841BA;
        color: white;
        border: 2px solid white;
        border-color: white;
    }

    .wfp--search-magnifier {
        fill: #fff;
    }
`

const Header = (props)=>{

    return(
        <Row>
        <Wrapper >
           
            <div className='wrapper'>
            <Col xs={3} md={3}>
                <img src={Logo} alt="Logo" style={{ width: 80, height: 80, marginTop: '1rem' }} />
            </Col>
            <Col xs={6} md={6}>
                <div className='text-wrapper'>
                            
                    <Search
                        className="some-class"
                        kind="large"
                        name="input-name"
                        // labelText="Label"
                        closeButtonLabelText="The label text for the close button (closeButtonLabelText)"
                        placeHolderText="Search"
                        // onChange={(e) => action('onChange')}
                    />
                </div>
            </Col>
            <Col xs={3} md={3}></Col>
            </div>
            </Wrapper>
            </Row>
        
    )
}

export default Header;