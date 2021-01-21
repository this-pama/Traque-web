const mongoose = require( 'mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require( 'passport-local-mongoose')

let Account = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true
   },
  password: {
    type: String,
    trim: true
  },
  email: String,
  userId : {type: Schema.Types.ObjectId, ref: 'User'},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
  disable: {
    type: Boolean,
    default: false
  },
  createdAt:  {
    type: Date,
    default: Date.now
  }
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);


