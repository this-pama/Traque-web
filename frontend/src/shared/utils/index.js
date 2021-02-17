export const globalFilterParams = {
    filterOptions: ['contains', 'notContains'],
    textFormatter: function (r) {
        if (r == null) return null
        // TODO to lowercase because native ag-grid 'caseSensitive'
        // prop is not working with text Formatter
        r = r.toLowerCase()
        r = r.replace(new RegExp('[àáâãäå]', 'g'), 'a')
        r = r.replace(new RegExp('æ', 'g'), 'ae')
        r = r.replace(new RegExp('ç', 'g'), 'c')
        r = r.replace(new RegExp('[èéêë]', 'g'), 'e')
        r = r.replace(new RegExp('[ìíîï]', 'g'), 'i')
        r = r.replace(new RegExp('ñ', 'g'), 'n')
        r = r.replace(new RegExp('[òóôõøö]', 'g'), 'o')
        r = r.replace(new RegExp('œ', 'g'), 'oe')
        r = r.replace(new RegExp('[ùúûü]', 'g'), 'u')
        r = r.replace(new RegExp('[ýÿ]', 'g'), 'y')
        return r
    },
    debounceMs: 0,
    newRowsAction: 'keep',
    caseSensitive: false,
    // TODO decide if we allow the and/or condition
    suppressAndOrCondition: true,
}

export function cellRenderBasedOnKey(params, key = 'label') {
    const { value } = params
    return value ? value[key] : null
}

export const caseInsensitiveCompare = (valueA, valueB) =>
    valueA.toLowerCase().localeCompare(valueB.toLowerCase())

export const gender=[
    {
        id: 1,
        label: "Male",
        value: "Male"
    },
    {
        id: 2,
        label: "Female",
        value: "Female"
    }
]

export const deptType =[
    {
        id: 1,
        label: "Agency",
        value: "Agency"
    },
    {
        id: 2,
        label: "Department",
        value: "Department"
    },
    {
        id: 3,
        label: 'Unit',
        value: 'Unit'
    }
]

export const gradeLevel = [
    {
        id: 1,
        label: 'Level 2',
        value: 'Level 2'
    },
    {
        id: 2,
        label: 'Level 3',
        value: 'Level 3'
    },
    {
        id: 3,
        label: 'Level 4',
        value: 'Level 4'
    },
    {
        id: 4,
        label: 'Level 5',
        value: 'Level 5'
    },
    {
        id: 5,
        label: 'Level 6',
        value: 'Level 6'
    },
    {
        id: 6,
        label: 'Level 7',
        value: 'Level 7'
    },
    {
        id: 7,
        label: 'Level 8',
        value: 'Level 8'
    },
    {
        id: 8,
        label: 'Level 9',
        value: 'Level 9'
    },
    {
        id: 9,
        label: 'Level 10',
        value: 'Level 10'
    },
    {
        id: 10,
        label: 'Level 11',
        value: 'Level 11'
    },
    {
        id: 11,
        label: 'Level 12',
        value: 'Level 12'
    },
    {
        id: 12,
        label: 'Level 13',
        value: 'Level 13'
    },
    {
        id: 13,
        label: 'Level 14',
        value: 'Level 14'
    },
    {
        id: 14,
        label: 'Level 15',
        value: 'Level 15'
    },
    {
        id: 15,
        label: 'Level 16',
        value: 'Level 16'
    }
]

export const fileType = [
    {
        id: 1,
        label: 'Service file',
        value: 'Service file',
        createServiceFile: true,
    },
    {
        id: 2,
        label: 'Management file',
        value: "Management file",
        createManagementFile: true
    }
]

export const check = (rules, role, action, data) => {
    if (rules && rules.includes(action)) {
        return true
    }
    return false
}