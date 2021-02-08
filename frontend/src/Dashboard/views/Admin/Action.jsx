import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Action = (props) => {
    const { _id } = props.data

    return (
        <Wrapper>
            <Link
                to={{
                    pathname: "/create-admin",
                    state: { edit: true, id : _id, data: props.data }
                  }}
            >
                Edit
            </Link>
           
        </Wrapper>
    )
}

export default Action

const Wrapper = styled.div`
    div:last-child {
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
