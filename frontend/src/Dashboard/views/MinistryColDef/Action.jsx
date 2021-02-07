import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const PositionLink = (props) => {
    const { status, position_id, id, create_user } = props.data

    return (
        <Wrapper>
            <Link
                to={''}
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
