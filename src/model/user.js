const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: String,
    dob: Date,
    gender: String,
    staffId: String,
    gradeLevel: String,
    state: String,
    country: String,
    telephone: Number,
    profileImage: String,
    ministry: { type: Schema.Types.ObjectId, ref: "Ministry", required: false },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    subDepartment: {
      type: Schema.Types.ObjectId,
      ref: "Sub Department",
      required: false,
    },
    designation: String,
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: false },
    userType: { type: Schema.Types.ObjectId, ref: "UserType", required: false },
    userRole: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isSuper: {
      type: Boolean,
      default: false,
    },
    permission: {
      createServiceFile: {
        type: Boolean,
        default: false,
      },
      createManagementFile: {
        type: Boolean,
        default: false,
      },
      viewReport: {
        type: Boolean,
        default: false,
      },
      viewSectionReport: {
        type: Boolean,
        default: false,
      },
      viewGeneralReport: {
        type: Boolean,
        default: false,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { usePushEach: true },
  { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model("User", UserSchema);
