const mongoose = require( 'mongoose')
const Schema = mongoose.Schema;

let Ministry = new Schema({
  name: {
    type: String,
    // uppercase : true,
    trim: true,
    unique: true
   },
   userId:  {type: Schema.Types.ObjectId, ref: 'User', required : false },
  createdAt:  {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ministry', Ministry);


