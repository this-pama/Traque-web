import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Wrapper } from '../../../ManageFile/views/SectionColDef/Action'

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


