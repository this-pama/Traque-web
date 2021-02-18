import React, { useState, useEffect }  from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {iconChevronDown} from '@wfp/icons'
import { Icon, Modal } from  '@wfp/ui';

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
                        Edit 
                    </Link>

                </div>
            </div>

        </Wrapper>
    )
}

export default Action

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
    // @media (min-width: 600px) {
        .wfp--modal-container {
            min-width: 280px;
        }
    // }
        
`