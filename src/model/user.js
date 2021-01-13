const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: String,
  dob: Date,
  gender: String,
  staffId: String,
  state: String,
  country: String,
  telephone: Number,
  profileImage: String,
  department: String,
  designation: String,
  accountId: {type: Schema.Types.ObjectId, ref: 'User Account ID', required : false },
  userType: {type: Schema.Types.ObjectId, ref: 'User type ID', required : false },
  createdAt:  {
    type: Date,
    default: Date.now
  },
}, 
{ usePushEach: true });

module.exports = mongoose.model('User', UserSchema);
