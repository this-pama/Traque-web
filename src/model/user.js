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
  gradeLevel: String,
  state: String,
  country: String,
  telephone: Number,
  profileImage: String,
  ministry: {type: Schema.Types.ObjectId, ref: 'Ministry', required : false },
  department: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
  designation: String,
  accountId: {type: Schema.Types.ObjectId, ref: 'Account', required : false },
  userType: {type: Schema.Types.ObjectId, ref: 'UserType', required : false },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isStaff: {
    type: Boolean,
    default: false
  },
  isSuper: {
    type: Boolean,
    default: false
  },
  createdAt:  {
    type: Date,
    default: Date.now
  },
}, 
{ usePushEach: true });

module.exports = mongoose.model('User', UserSchema);
