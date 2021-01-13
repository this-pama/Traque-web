const mongoose = require( 'mongoose')
let Schema = mongoose.Schema;

let AuctionSchema = new Schema({
  verificationCode: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  askingPrice: {
    type: Number,
    required: false
  },
  artistName: {
    type: String,
    required: true
  },
  year: String,
  category: {
    type: String,
    required: false
  },
  organizerName: {
    type: String,
    required: false
  },
  organizerEmail: {
    type: String,
    required: false
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedDate: {
    type: Date
  },
  sold: {
    type: Boolean,
    default: false
  },
  negotiationId: {type: Schema.Types.ObjectId, default: null, ref: 'Negotiation Id'},
  userId: {type: Schema.Types.ObjectId, ref: 'Seller'},
  imageUrl: [{ type: String, ref: 'Images' }],
  currency:{
    type: String,
    default: "NGN"
  },
  bidding:[{
    userId: {type: Schema.Types.ObjectId, default: null, ref: 'User Id', required: true },
    askingPrice: { type: Number, required: true},
    email: { type: String, required: true },
    time: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  buyer: {type: Schema.Types.ObjectId, default: null, ref: 'User Id'},
  paymentExpiration: String,
  winner: {type: Schema.Types.ObjectId, default: null, ref: 'Winner User Id'},
  verifiedBy: {type: Schema.Types.ObjectId, default: null, ref: 'User Id'},
  verificationId: {type: Schema.Types.ObjectId, default: null, ref: 'Verification Id'},
  createdAt:  {
    type: Date,
    default: Date.now
  }
}, 
{ usePushEach: true });

module.exports = mongoose.model('Auction', AuctionSchema); 