const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let UserTypeSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true,
    unique: true
  },
  // identifier: {
  //   type: Number,
  //   default: 0
  // },
  createdAt:  {
    type: Date,
    default: Date.now
  },
}, 
{ usePushEach: true });

module.exports = mongoose.model('UserType', UserTypeSchema);
