import React, { useState, useEffect }  from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {iconChevronDown} from '@wfp/icons'
import { Icon, Modal, Loading } from  '@wfp/ui';
import store from '../../../store'
import axios from 'axios'
import { toast } from 'react-toastify'

const Action = (props) => {
    const { onValueChange } = props;
    const { _id } = props.data;
    const storeData = store.getState();
    const {user} = storeData;

    const [isAction, setAction ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const onConfirm = async ()=>{
        setLoading(true)
        try {
            await axios.post(`/v1/file/receive/${_id}/${user && user._id}`)
            .then(()=> setLoading(false))
            onValueChange()
            toast('Successfully acknowledged receipt of file', {closeOnClick: true, autoClose: 1000 });
            window.location.reload();
        } catch (err) {
            toast.error('Ooops! error occurred, please try again', {closeOnClick: true, autoClose: 1000 });
            setLoading(false)
        }

        setAction(false);
    }

    return (
        <Wrapper>
            
            <div style={{ dispaly: 'inline'}}>
                <div style={{ dispaly: 'inline'}}>
                    <Link className="wfp--link"
                        style={{ fontWeight: 'bold', marginLeft : 10 }}
                        to='#'
                        onClick={()=>setAction(true)}
                    >
                        RECEIVED FILE
                    </Link>


                    <Link className="wfp--link"
                        style={{ fontWeight: 'bold', marginLeft : 10 }}
                        to={{
                            pathname: `/history/file/${_id}`,
                          }}
                    >
                        VIEW HISTORY
                    </Link>

                </div>
            </div>

            <Modal
                open={isAction}
                primaryButtonText="Confirm"
                secondaryButtonText="No"
                onRequestSubmit={onConfirm}
                onRequestClose={()=>setAction(false)}
                modalLabel="Confirm receipt"
                wide={false}
                type='info'
            >
                <Loading active={loading} withOverlay={true} />
                <p className="wfp--modal-content__text">
                    By acknowledging receipt, you confirm receipt of the file. Do you confirm receipt?
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