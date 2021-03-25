export const SA = {
  name: "Super Admin",
  permission: ["manageMinistry", "manageAdmin", "manageUserRole"],
};

export const admin = {
  name: "Admin",
  permission: [
    "createUser",
    "manageDepartment",

    "manageServiceType",

    "manageDepartment",
    "manageSubDepartment",
  ],
};

export const fto = {
  name: "FTO",
  permission: [
    "delayFile",
    "viewIncoming",
    "viewOutgoing",
    "viewInbox",
    "viewSent",
    "viewDelayed",
    "viewArchived",
    "viewFileHistory",

    "canSearchFile",
  ],
};

export const registry = {
  name: "Registry",
  permission: [
    "createManagementFile",
    "createServiceFile",

    "archiveFile",
    "deleteFile",

    "delayFile",
    "transferFile",

    "viewRegistry",
    "viewIncoming",
    "viewOutgoing",
    "viewInbox",
    "viewSent",
    "viewDelayed",
    "viewArchived",
    "viewFileHistory",

    "canSearchFile",
  ],
};

export const registry_ser = {
  name: "Registry-service",
  permission: [
    "createServiceFile",

    "archiveFile",
    "deleteFile",

    "delayFile",
    "transferFile",

    "viewRegistry",
    "viewIncoming",
    "viewOutgoing",
    "viewInbox",
    "viewSent",
    "viewDelayed",
    "viewArchived",
    "viewFileHistory",

    "canSearchFile",
  ],
};

export const registry_mgt = {
  name: "Registry-management",
  permission: [
    "createManagementFile",

    "archiveFile",
    "deleteFile",

    "delayFile",
    "transferFile",

    "viewRegistry",
    "viewIncoming",
    "viewOutgoing",
    "viewInbox",
    "viewSent",
    "viewDelayed",
    "viewArchived",
    "viewFileHistory",

    "canSearchFile",
  ],
};

export const management = {
  name: "Management",
  permission: ['viewReport'],
};
