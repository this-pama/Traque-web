const mongoose = require( 'mongoose')
const Schema = mongoose.Schema;

let history = new Schema({
  type: String,
  label: String,
  createdBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
  createdDate: { type: Date},
  originatingDept : {type: Schema.Types.ObjectId, ref: 'Department', required : false },
  originatingSubDept : {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

  sentBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
  sentDate: {  type: Date },
  sentTime: {  type: Date },

  receivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
  receivedDate: {  type: Date },
  receivingDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
  receivingSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

  slaExpiration: {
    type: Boolean,
    default: false
  },

  isDelayed: {
    type: Boolean,
    default: false
  },
  delayedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
  delayedDate : {type: Schema.Types.ObjectId, ref: 'User', required : false },

  archivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
  archivedDate : {type: Date },

  location: { type: Object, default: {} },

});

let File = new Schema({
   name: {
    type: String,
    trim: true,
   },
   fileNo: {
    type: String,
    trim: true,
   },
   type: String,
   isDelayed: Boolean,
   createdBy:  {type: Schema.Types.ObjectId, ref: 'User', required : false },
   createdDate: { type: Date },
   staff: [{type: Schema.Types.ObjectId, ref: 'User', required : false }],
   ministry :{type: Schema.Types.ObjectId, ref: 'Ministry', required : false },
   department: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
   subDepartment: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },
   outgoing: {
     value: {
        type: Boolean,
        default: false
      },
     label: String,
     userId: {type: Schema.Types.ObjectId, ref: 'User' },
   },
   incoming: {
    value:{
      type: Boolean,
      default: false
    },
    label: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
  },
  pending: {
    value: {
      type: Boolean,
      default: false
    },
    label: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
  },
  sent: {
    value: {
      type: Boolean,
      default: false
    },
    label: String,
    userId: [{type: Schema.Types.ObjectId, ref: 'User' }],
  },
  delayed: {
    value: {
      type: Boolean,
      default: false
    },
    label: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
  },
  archived: {
    value: {
      type: Boolean,
      default: false
    },
    label: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' },
  },
   history:[history],
  createdAt: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  },
}, 
{ usePushEach: true, timestamps: true });

module.exports = mongoose.model('File', File);


