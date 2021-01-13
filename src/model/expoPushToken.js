import mongoose from "mongoose"

let Schema = mongoose.Schema

let expoPushToken = new Schema({
    token:  String,
    user:  String,
    createdAt:  {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model("Expo Push Token", expoPushToken)