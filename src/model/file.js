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
  receivedTime: {  type: Date },
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
  delayedDate : {type: Date },

  delayedDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
  delayedSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

  archivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
  archivedDate : {type: Date },

  archivedDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
  archivedSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

  location: { type: Object, default: {} },

  justification: String,

});


const sentData = new Schema({
    value: {
      type: Boolean,
      default: false
    },
    label: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' },

    originatingDept : {type: Schema.Types.ObjectId, ref: 'Department', required : false },
    originatingSubDept : {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

    sentBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
    sentDate: {  type: Date },
    sentTime: {  type: Date },

    location: { type: Object, default: {} },

    receivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
    receivedDate: {  type: Date },
    receivedTime: {  type: Date },

    receivingDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
    receivingSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },
})

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

      originatingDept : {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      originatingSubDept : {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

      receivingDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      receivingSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },
      receivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },

      sentDate: {  type: Date },
      sentTime: {  type: Date },

      location: { type: Object, default: {} },
   },
   incoming: {
      value:{
        type: Boolean,
        default: false
      },
      label: String,
      userId: {type: Schema.Types.ObjectId, ref: 'User' },

      originatingDept : {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      originatingSubDept : {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

      sentBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
      sentDate: {  type: Date },
      sentTime: {  type: Date },

      location: { type: Object, default: {} },
  },
  pending: {
    value: {
      type: Boolean,
      default: false
    },
    label: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' },

      originatingDept : {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      originatingSubDept : {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

      sentBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
      sentDate: {  type: Date },
      sentTime: {  type: Date },

      location: { type: Object, default: {} },

      receivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
      receivedDate: {  type: Date },
      receivedTime: {  type: Date },

      receivingDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      receivingSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },
  },
  sent: [{
    value: {
      type: Boolean,
      default: false
    },
    label: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User' },

    originatingDept : {type: Schema.Types.ObjectId, ref: 'Department', required : false },
    originatingSubDept : {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

    sentBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
    sentDate: {  type: Date },
    sentTime: {  type: Date },

    location: { type: Object, default: {} },

    receivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
    receivedDate: {  type: Date },
    receivedTime: {  type: Date },

    receivingDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
    receivingSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },
}
  ],
  delayed: {
    value: {
      type: Boolean,
      default: false
    },
    label: String,
      userId: {type: Schema.Types.ObjectId, ref: 'User' },

      originatingDept : {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      originatingSubDept : {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },

      sentBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
      sentDate: {  type: Date },
      sentTime: {  type: Date },

      location: { type: Object, default: {} },
      justification: String,

      delayedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
      delayedDate: {  type: Date },
      delayedTime: {  type: Date },

      delayedDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      delayedSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },
  },
  archived: {
      value: {
        type: Boolean,
        default: false
      },
      label: String,
      userId: {type: Schema.Types.ObjectId, ref: 'User' },

      archivedBy: {type: Schema.Types.ObjectId, ref: 'User', required : false },
      archivedDate: {  type: Date },
      archivedTime: {  type: Date },

      archivedDept: {type: Schema.Types.ObjectId, ref: 'Department', required : false },
      archivedSubDept: {type: Schema.Types.ObjectId, ref: 'Sub Department', required : false },
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


