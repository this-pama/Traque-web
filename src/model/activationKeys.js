const mongoose = require('mongoose')
let Schema = mongoose.Schema;

let ActivationSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  expiration: Date,
  createdAt:  {
    type: Date,
    default: Date.now
  },
  userId: {type: Schema.Types.ObjectId, ref: 'User ID'},
  active: {
    type: Boolean,
    default: false
  }
}, 
{ usePushEach: true });

module.exports = mongoose.model('ActivationKey', ActivationSchema);
