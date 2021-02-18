import React, { useState, useEffect }  from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import store from '../../../store'
import Can from '../../../shared/Can'
import { Wrapper } from '../SectionColDef/Action'

const Action = (props) => {
    
    const { request_status, _id, reviewed_candidate, create_user } = props.data;

    const storeData = store.getState();

    const {user} = storeData;
    const permissions = user && user.userRole ? user.userRole.permission : [];
    const userRole = user && user.userRole ? user.userRole.name : null;

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
                            style={{ fontWeight: 'bold' }}
                            to={{
                                pathname: `/history/file/${_id}`,
                            }}
                        >
                            VIEW HISTORY
                        </Link>
                    )}
                />

                </div>
            </div>
        </Wrapper>
    )
}

export default Action
