// this function returns only the columns needed for specific view (for example /hr/global )
export default function getColumnDefs(viewName, onValueChange) {
    let columnDefs
    switch (viewName) {
        case 'ministry':
            columnDefs = [
                ]
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
