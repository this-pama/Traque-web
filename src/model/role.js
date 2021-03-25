const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Role = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    permission: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { usePushEach: true },
  { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model("Role", Role);
