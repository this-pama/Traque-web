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
        <p className="label">Opened by</p>
        <p>
          {file.createdBy
            ? `${file.createdBy.firstName} ${file.createdBy.lastName}`
            : null}
        </p>
      </InlineInfo>

      <InlineInfo>
        <p className="label">Opening date</p>
        <p>
          {file.createdDate &&
          isNaN(new Date(file.createdDate).getTime()) == false
            ? `${new Date(file.createdDate).toDateString()}`
            : null}
        </p>
      </InlineInfo>

      <InlineInfo>
        <p className="label">Archived by</p>
        <p>
          {p.archivedBy
            ? `${p.archivedBy.firstName} ${p.archivedBy.lastName}`
            : null}
        </p>
      </InlineInfo>

      <InlineInfo>
        <p className="label">Closing date</p>
        <p>
          {p.archivedDate && isNaN(new Date(p.archivedDate).getTime()) == false
            ? `${new Date(p.archivedDate).toDateString()}`
            : null}
        </p>
      </InlineInfo>

      <InlineInfo>
        <p className="label">Designation</p>
        <p>{p.archivedBy ? `${p.archivedBy.designation}` : null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Department</p>
        <p>{p.archivedDept ? `${p.archivedDept.name}` : null}</p>
      </InlineInfo>
      <InlineInfo>
        <p className="label">Sub Department</p>
        <p>{p.archivedSubDept ? p.archivedSubDept.name : null}</p>
      </InlineInfo>
    </Section>
  );
};

export default View;
