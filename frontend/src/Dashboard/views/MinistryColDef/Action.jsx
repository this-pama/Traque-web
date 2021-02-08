import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const PositionLink = (props) => {
    const {  _id, } = props.data

    return (
        <Wrapper>
            <Link
                to={{
                    pathname: "/create-ministry",
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
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
