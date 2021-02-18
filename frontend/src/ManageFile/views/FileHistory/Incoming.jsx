import { InlineInfo, Section } from '../../Summary'

const  View= props =>{
    const { file, p }= props;
    return (
    <Section>
        <h3 style={{display: "block"}}>{ p && p.label}</h3>
        <InlineInfo>
            <p className="label">Date received</p>
        <p>{p.receivedDate 
                && isNaN(new Date(p.receivedDate).getTime()) == false
                ? new Date(p.receivedDate).toDateString() : null}</p>
        </InlineInfo>
        <InlineInfo>
            <p className="label">
                Received by
            </p>
            <p>{
                p.sentBy  ? 
                `${p.receivedBy.firstName} ${p.receivedBy.lastName}` 
                : null
            }</p>
        </InlineInfo>
        <InlineInfo>
            <p className="label">Department</p>
            <p>{
                    p.receivingDept  ?
                    `${p.receivingDept.name}` 
                    : null
                }</p>
        </InlineInfo>
        <InlineInfo>
            <p className="label">
                Sub Department
            </p>
            <p>
            {
                p.receivingSubDept ? 
                p.receivingSubDept.name
                : null
            }
            </p>
        </InlineInfo>
        <InlineInfo>
            <p className="label">Designated officer</p>
            <p>
            {
                p.receivedBy ? 
                `${p.receivedBy.designation}` 
                : null
            }
            </p>
        </InlineInfo>
        <InlineInfo>
            <p className="label">Sent by</p>
            <p>
            {
                p.sentBy  ? 
                `${p.sentBy.firstName} ${p.sentBy.lastName}` 
                : null
            }
            </p>
        </InlineInfo>
        
    </Section>
)}

export default View;