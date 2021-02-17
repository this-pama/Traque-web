import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const PositionLink = (props) => {
    const {  _id, } = props.data

    return (
        <Wrapper>
            <Link
                className="wfp--link"
                style={{ fontWeight: 'bold' }}
                to={{
                    pathname: "/create-user-role",
                    state: { edit: true, id : _id, data: props.data }
                  }}
            >
                Edit
            </Link>
           
        </Wrapper>
    )
}

export default PositionLink


const Wrapper = styled.div`
    div:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bold;
    }
    a.wfp--link {
        float: left;
        color: #fbfcfc;
        background: #0e7fce;
        border-radius: 6px;
        padding: 4px 10px;
        height: 27px;
        display: inline-block;
        -webkit-text-decoration: none;
        text-decoration: none;
    }
        
`
