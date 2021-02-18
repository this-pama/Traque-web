import React, { useState, useEffect }  from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {iconChevronDown} from '@wfp/icons'
import { Icon, Modal, Loading } from  '@wfp/ui';
import store from '../../../store'
import axios from 'axios'
import { toast } from 'react-toastify'
import Can from '../../../shared/Can'

const Action = (props) => {
    const { onValueChange } = props;
    const { _id } = props.data;

    const [ isAchive, setAchive ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const storeData = store.getState();
    
    const {user} = storeData;
    const permissions = user && user.userRole ? user.userRole.permission : [];
    const userRole = user && user.userRole ? user.userRole.name : null;


    
    const onAchive = async ()=>{
        setLoading(true)
        try {
            await axios.post(`/v1/file/archive/${_id}/${user && user._id}`)
            .then(()=> {
                setLoading(false)
                props.onValueChange && props.onValueChange();
                toast('Successful', {closeOnClick: true, autoClose: 1000 });
                window.location.reload();
            })
            
        } catch (err) {
            toast.error('Ooops! error occurred, please try again', {closeOnClick: true, autoClose: 1000 });
            setLoading(false)
        }

        setAchive(false);
    }

    return (
        <Wrapper>
            
            <div style={{ dispaly: 'inline'}}>
                <div style={{ dispaly: 'inline'}}>
                <Can
                    rules={permissions}
                    userRole={userRole}
                    perform={'viewFileHistory'}
                    yes={() => (
                    <Link className="wfp--link"
                        style={{ fontWeight: 'bold', marginLeft : 10 }}
                        to={{
                            pathname: `/history/file/${_id}`,
                          }}
                    >
                        VIEW HISTORY
                    </Link>
                    )}
                />

                 <Can
                    rules={permissions}
                    userRole={userRole}
                    perform={'archiveFile'}
                    yes={() => (
                    <Link className="wfp--link"
                        style={{ fontWeight: 'bold', marginLeft : 10 }}
                        to='#'
                        onClick={()=> setAchive(true)}
                    >
                        ARCHIVE
                    </Link>
                    )}
                    />

                </div>
            </div>

            <Modal
                open={isAchive}
                primaryButtonText="Archive file"
                secondaryButtonText="Cancel"
                onRequestSubmit={onAchive}
                onRequestClose={()=>setAchive(false)}
                modalLabel="Archive"
                wide={false}
                type='info'
            >
                <Loading active={loading} withOverlay={true} />
                <p className="wfp--modal-content__text">
                    Are you sure you want to Archive this file?
                </p>
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
        font-size: 8px;
        background: #0e7fce;
        border-radius: 6px;
        padding: 4px 10px;
        // height: 27px;
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