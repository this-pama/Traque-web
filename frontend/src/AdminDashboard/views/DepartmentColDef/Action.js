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
                            pathname: "/create-department",
                            state: { edit: true, id : _id, data: props.data }
                          }}
                    >
                        Edit department
                    </Link>

                        <div 
                            style={{ 
                                borderRadius: '6px', 
                                border: '2px solid rgb(11 119 193)',
                                cursor: 'pointer',
                                float: 'left',
                                marginLeft: 10,
                                background: '#0d7fce',
                                padding: '3px 5px 4px'
                            }}
                            onClick={()=> setAction(true) }
                        >
                            <Icon
                                className="wfp--link"
                                icon={iconChevronDown}
                                width={'14px'}
                                height={'14px'}
                                fill='#fff'
                                description="More actions"
                                className="dropbtn"
                            />
                        </div>
                </div>
            </div>


                <Modal
                    open={isAction}
                    modalLabel="Other actions"
                    primaryButtonText="Close"
                    passiveModal
                    onRequestClose={() => setAction(false)}
                    onRequestSubmit={() => setAction(false)}
                >
                    
                    <Link className="wfp--link"
                        to={ '/create-sub-department/' + _id} 
                    >
                        Add sub department
                    </Link>


                    <br /><br />
                    <Link className="wfp--link"
                         to={'/sub/department/' + _id }
                    >
                        View sub department
                    </Link>
                        

                </Modal>

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