import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import _ from 'lodash'
import Incoming from './views/FileHistory/Incoming'
import Outgoing from './views/FileHistory/Outgoing'
import Delayed from './views/FileHistory/Delayed'
import Created from './views/FileHistory/Created'
import Archived from './views/FileHistory/Archived'

const Summary = props => {
    const { file, history } = props;

    return (
        <div>
            {history.map(p=>{
                if(p.type == "incoming"){
                    return <Incoming p={p} file={file} />
                }
                else if(p.type == "outgoing"){
                    return <Outgoing p={p} file={file} />
                }
                else if(p.type == "delayed"){
                    return <Delayed p={p} file={file} />
                }
                else if(p.type == "created"){
                    return <Created p={p} file={file} />
                }
                else if(p.type == "archived"){
                    return <Archived p={p} file={file} />
                }
            })}
        </div>
    )
}

export default Summary


export const Section = styled.div`
    h3 {
        font-weight: 700;
        margin: 1rem 0;
    }
`

export const InlineInfo = styled.div`
    display: flex;
    font-size: 0.8rem;
    margin: 0.75rem 0;
    .label {
        width: 30%;
        font-weight: 600;
    }
    p {
        width: 60%;
        font-size: inherit;
    }
`;
