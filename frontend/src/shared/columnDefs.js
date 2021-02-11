import ministryColDef from '../Dashboard/views/MinistryColDef/ministryColDef'
import adminColDef from '../Dashboard/views/Admin/adminColDef'
import departmentColDef from "../AdminDashboard/views/DepartmentColDef/departmentColDef";
import subDepartment from '../AdminDashboard/views/SubDepartmentColDef/subDepartmentColDef'
import staffColDef from '../AdminDashboard/views/Staff/staffColDef'
import incomingFile from '../ManageFile/views/IncomingColDef/incomingColDef'
import outgoingFile from '../ManageFile/views/OutgoingColDef/outgoingColDef'
import inProcessFile from '../ManageFile/views/InProcessFileColDef/inProcessColDef'
import sentFile from '../ManageFile/views/SentFileColDef/sentFileColDef'
import archivedFile from '../ManageFile/views/ArchivedFile/archivedFileColDef'

// this function returns only the columns needed for specific view (for example /hr/global )
export default function getColumnDefs(viewName, onValueChange) {
    let columnDefs
    switch (viewName) {
        case 'ministry':
            columnDefs = [ ...ministryColDef ]
            break;
        case 'admin':
            columnDefs = [ ...adminColDef ]
            break;

        case 'department':
            columnDefs = [ ...departmentColDef ]
            break;  

        case 'subDepartment': 
            columnDefs = [ ...subDepartment ]
            break;

        case 'staff': 
            columnDefs = [ ...staffColDef ]
            break;
        
        case 'incomingFile':
            columnDefs= [ ...incomingFile ]
            break;

        case 'outgoingFile': 
            columnDefs= [ ...outgoingFile ]
            break;

        case 'inProcessFile': 
            columnDefs= [ ...inProcessFile ]
            break;

        case 'sentFile':
            columnDefs=[...sentFile]
            break;

        case 'archivedFile':
            columnDefs= [...archivedFile ]
            break;
            
        default:
            columnDefs = []
            break
    }

    // compose column with optional callback on value change
    // if object is passed then generate column definition and extend it with customProps
    columnDefs = columnDefs.map((col) => {
        if (typeof col === 'function') {
            return col(onValueChange)
        } else {
            return { ...col.def(onValueChange), ...col.customProps }
        }
    })

    // getting fields that should be exported to CSV
    const exportedColumns = columnDefs
        .filter((col) => col.__isExported === true)
        .map((col) => col.field);

    // deleting helper properties that are not part of ag-grid API
    columnDefs = columnDefs.map((col) => {
        const colCopy = { ...col }
        delete colCopy.__isExported
        return colCopy
    })
    return {
        columnDefs,
        exportedColumns,
    }
}
