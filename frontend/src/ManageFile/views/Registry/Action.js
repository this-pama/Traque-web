import React, { useState, useEffect }  from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {iconRestartGlyph, iconEditGlyph,iconDeleteGlyph, iconSave, iconAppServices  } from '@wfp/icons'
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
    const [ message, setMessage ] = useState('')

    const onDelete = async ()=>{
        setLoading(true)
        try {
            await axios.put(`/v1/file/delete/${_id}`)
            .then(()=> {
                setLoading(false)
                props.onValueChange && props.onValueChange();
                toast('Successfully acknowledged receipt of file', {closeOnClick: true, autoClose: 1000 });
                window.location.reload();
            })
            
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
                    <Icon
                        class="wfp--link"
                        icon={iconRestartGlyph}
                        width={14}
                        height={14}
                        fill='#0b77c2'
                        description="FORWARD"
                    />
                    <span style={{ paddingLeft: 20 }} />

                    <Icon
                        class="wfp--link"
                        icon={iconEditGlyph}
                        width={14}
                        height={14}
                        fill='#0b77c2'
                        description="EDIT"
                    />

                    <span style={{ paddingLeft: 20 }} />

                    <Icon
                        class="wfp--link"
                        icon={iconDeleteGlyph}
                        width={14}
                        height={14}
                        fill='#0b77c2'
                        description="DELETE"
                        onClick={()=> setAction(true)}
                    />

                    <span style={{ paddingLeft: 20 }} />

                    <Icon
                        class="wfp--link"
                        icon={iconAppServices}
                        width={14}
                        height={14}
                        fill='#0b77c2'
                        description="ARCHIVE"
                    />

                </div>
            </div>

            <Modal
                open={isAction}
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                onRequestSubmit={onDelete}
                onRequestClose={()=>setAction(false)}
                modalLabel="Delete"
                wide={false}
                type='danger'
            >
                <Loading active={loading} withOverlay={true} />
                <p className="wfp--modal-content__text">
                    Are you sure you want to delete this file?
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