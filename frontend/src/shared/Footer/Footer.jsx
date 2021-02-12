import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    .footer {
        font-family: "Open Sans",sans-serif;
        border-top: 2px solid #fff;
        // background-color: #1841BA;
        z-index: 5000;
        padding: 1.25rem 0;
        font-size: 12px;
    }
}
.wrapper {
    padding-left: 1rem;
    padding-right: 1rem;
    margin: auto;
    width: 100%;
}
.wrapper--width-lg {
    max-width: 1200px;
}
.footer__content {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 3.5rem;
    width: 100%;
    color: #1841BA;
}
`

const Header = (props)=>{

    return(
        <Wrapper >
            <footer className='footer'>
                <div className='wrapper wrapper--width-lg'>
                    <div className='footer__content'>
                        Copyright {new Date().getFullYear()} &#64; Traquer
                    </div>
                </div>
            </footer>
        </Wrapper>
    )
}

export default Header;