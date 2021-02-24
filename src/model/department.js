const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Department = new Schema(
  {
    name: {
      type: String,
      // uppercase : true,
      // trim: true,
      unique: true,
    },
    type: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    staff: [{ type: Schema.Types.ObjectId, ref: "User", required: false }],
    ministry: { type: Schema.Types.ObjectId, ref: "Ministry", required: false },
    subDepartment: [
      { type: Schema.Types.ObjectId, ref: "Sub Department", required: false },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { usePushEach: true }
);

module.exports = mongoose.model("Department", Department);
