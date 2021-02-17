export const SA = {
    name: "Super Admin",
    permission: [
    'manageMinistry',
    'manageAdmin',
    'manageDepartment',
    'manageSubDepartment',
    'manageServiceType',

    'manageUserRole',
    ]
}

export const admin = {
    name: 'Admin',
    permission: [
        'createUser',
        'manageDepartment'
    ]
}

export const fto = {
    name : 'FTO',
    permission: [
    'delayFile',
    'viewIncoming',
    'viewOutgoing',
    'viewInbox',
    'viewSent',
    'viewDelayed',
    'viewArchived',
    'viewFileHistory',

    'canSearchFile',
    ]
}


export const registry = {
    name : 'Registry',
    permission: [
    'createManagementFile',
    'createServiceFile',
    'archiveFile',
    'deleteFile',

    'delayFile',
    'viewRegistry',
    'viewIncoming',
    'viewOutgoing',
    'viewInbox',
    'viewSent',
    'viewDelayed',
    'viewArchived',
    'viewFileHistory',

    'canSearchFile',
    ]
}

export const management = {
    name : 'Management',
    permission: [
    'viewDepartmentReport',
    'viewMinistryReport',
    ]
}