import React, { useState, useEffect }  from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Wrapper } from '../../../ManageFile/views/SectionColDef/Action'

const Action = (props) => {
    
    const { request_status, _id, reviewed_candidate, create_user } = props.data;

    const [isAction, setAction ] = useState(false);

    return (
        <Wrapper>
            <div style={{ dispaly: 'inline'}}>
                <div style={{ dispaly: 'inline'}}>
                    <Link className="wfp--link"
                        style={{ fontWeight: 'bold' }}
                        to={{
                            pathname: "/create-service-file-type",
                            state: { edit: true, id : _id, data: props.data }
                          }}
                    >
                        EDIT
                    </Link>

                </div>
            </div>

        </Wrapper>
    )
}

export default Action
