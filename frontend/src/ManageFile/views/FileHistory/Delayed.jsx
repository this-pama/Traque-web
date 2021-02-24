import { InlineInfo, Section } from "../../Summary";

const View = (props) => {
  const { file, p } = props;
  return (
    <Section>
      <h3 style={{ display: "block" }}>{p && p.label}</h3>
      <InlineInfo>
        <p className="label">Delayed by</p>
        <p>
          {p.delayedBy
            ? `${p.delayedBy.firstName} ${p.delayedBy.lastName}`
            : null}
        </p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Delayed date</p>
        <p>
          {p.delayedDate && isNaN(new Date(p.delayedDate).getTime()) == false
            ? new Date(p.delayedDate).toDateString()
            : null}
        </p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Designation</p>
        <p>{p.delayedBy ? `${p.delayedBy.designation}` : null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Department</p>
        <p>{p.delayedDept ? `${p.delayedDept.name}` : null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Sub Department</p>
        <p>{p.delayedSubDept ? p.delayedSubDept.name : null}</p>
      </InlineInfo>

      <InlineInfo>
        <p className="label">Justification</p>
        <p>{p.justification ? `${p.justification}` : null}</p>
      </InlineInfo>
    </Section>
  );
};

export default View;
