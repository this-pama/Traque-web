import { InlineInfo, Section } from "../../Summary";

const View = (props) => {
  const { file, p } = props;
  return (
    <Section>
      <h3 style={{ display: "block" }}>{p && p.label}</h3>
      <InlineInfo>
        <p className="label">File name/title</p>
        <p>{file.name || null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">File number</p>
        <p>{file.fileNo || null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">File type</p>
        <p>{file.type || null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Created by</p>
        <p>
          {p.createdBy
            ? `${p.createdBy.firstName} ${p.createdBy.lastName}`
            : null}
        </p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Created date</p>
        <p>
          {p.createdDate && isNaN(new Date(p.createdDate).getTime()) == false
            ? `${new Date(p.createdDate).toDateString()}`
            : null}
        </p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Designation</p>
        <p>{p.createdBy ? `${p.createdBy.designation}` : null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Department</p>
        <p>{p.originatingDept ? `${p.originatingDept.name}` : null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Office/Unit</p>
        <p>{p.originatingSubDept ? p.originatingSubDept.name : null}</p>
      </InlineInfo>
    </Section>
  );
};

export default View;
