const mongoose = require( 'mongoose')
const Schema = mongoose.Schema;

let serviceFileType = new Schema({
  name: {
    type: String,
    // uppercase : true,
    trim: true,
    unique: true
   },
   userId:  {type: Schema.Types.ObjectId, ref: 'User', required : false },
   ministry: {type: Schema.Types.ObjectId, ref: 'Ministry', required : true },
  createdAt:  {
    type: Date,
    default: Date.now
  }
}, 
{ usePushEach: true });

module.exports = mongoose.model('Service file type', serviceFileType);


