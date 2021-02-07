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
