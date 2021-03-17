const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Settings = new Schema(
  {
    smsNotification: {
      type: Boolean,
      default: true,
    },
    emailNotification:  {
      type: Boolean,
      default: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ministry: { type: Schema.Types.ObjectId, ref: "Ministry", required: false },
    ministrySettings:  {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { usePushEach: true }
);

module.exports = mongoose.model("Settings", Settings);
