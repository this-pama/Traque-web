require("dotenv").config();
const Email = require("email-templates");
const path = require("path");
const fetch = require("node-fetch");
import Expo from "expo-server-sdk";
const ObjectId = require("mongoose").Types.ObjectId;

import User from '../model/user'
import Settings from '../model/settings'

import ExpoToken from '../model/expoPushToken'

const { NODE_ENV } = process.env;

export const isObjectIdValid = (id) =>
  ObjectId.isValid(id)
    ? String(new ObjectId(id) === id)
      ? true
      : false
    : false;

export const sendMail = async (sender, receiver, folder, userId, sendByDefault) => {
  const email = new Email({
    message: {
      from: sender,
    },
    send: true,
    transport: {
      host: "smtp-mail.outlook.com",
      port: 587,
      ssl: false,
      tls: true,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    },
    preview: false,
  });

  let folderPath;

  switch (folder) {
    case "welcome":
      folderPath = path.join(__dirname, "../emails/welcome");
      break;

    case "forgotpassword":
      folderPath = path.join(__dirname, "../emails/forgotpassword");
      break;

    case "changepassword":
      folderPath = path.join(__dirname, "../emails/changepassword");
      break;

    case "file":
      folderPath = path.join(__dirname, "../emails/file");
      break;

    default:
      folderPath = path.join(__dirname, "../emails/welcome");
  }

  const value = await evaluateEmailNotificationSettings(userId);

  if(value){
    email
    .send({
      template: folderPath,
      message: {
        to: receiver.email,
      },
      locals: receiver,
    })
    .then(console.log("successfully sent email"))
    .catch(console.error);
  }
  else if(sendByDefault){
    email
    .send({
      template: folderPath,
      message: {
        to: receiver.email,
      },
      locals: receiver,
    })
    .then(console.log("successfully sent email"))
    .catch(console.error);
  }

  
};

export const sendSms = async (number, message, userId, sendPushNotification, sendByDefault) => {
  
  //send push notification
  if(sendPushNotification){
    handlePushTokens(message, userId);
  }
  
  const value = await evaluateSmsNotificationSettings(userId);

  //send sms message
  const { SMS_USERNAME, SMS_PASSWORD, SMS_SENDER } = process.env;
  let url = `http://rslr.connectbind.com/bulksms/bulksms?username=${SMS_USERNAME}&password=${SMS_PASSWORD}&type=0&dlr=1&destination=${number}&source=${SMS_SENDER}&message=${message}`;

  if(value){
    fetch(url).then(console.log("sms sent successfully")).catch(console.error);
  }
  else if(sendByDefault){
    fetch(url).then(console.log("sms sent successfully")).catch(console.error);
  }
  
};

// Create a new Expo SDK client
export const handlePushTokens = async (message, userId) => {
  let expo = new Expo();

  let savedTokens = await ExpoToken.find({ user: userId });

  if(savedTokens.length <= 0) return console.log("No push token found for user")

  let savedPushTokens = savedTokens.map(p => p.token)

  let notifications = [];
  for (let pushToken of savedPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    notifications.push({
      to: pushToken,
      sound: "default",
      title: "Traquer",
      body: message,
      badge: 1,
      _displayInForeground: true,
    });
  }

  let chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (let chunk of chunks) {
      try {
        let receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};


const evaluateSmsNotificationSettings = async (userId)=>{
  if (isObjectIdValid(userId) == false) return false;

  let notification;
  //get user data
  const user = await User.findById(userId);

  if(!user || user.ministry == null) return false;

  //check admin settings
  const adminSettings = await Settings.findOne({ ministry: user.ministry, ministrySettings: true });

  const userSettings = await Settings.findOne({ userId: user._id });

  if(adminSettings && adminSettings.smsNotification){
    notification = true;

    if(userSettings && userSettings.smsNotification){
      notification = true;
    }
    else{
      notification = false
    }
  }
  else{
    notification = false
  }

  return notification;

}

const evaluateEmailNotificationSettings = async (userId)=>{
  if (isObjectIdValid(userId) == false) return false;
  
  let notification;
  //get user data
  const user = await User.findById(userId);

  if(!user || user.ministry == null) return false;

  //check admin settings
  const adminSettings = await Settings.findOne({ ministry: user.ministry, ministrySettings: true });

  const userSettings = await Settings.findOne({ userId: user._id });

  if(adminSettings && adminSettings.emailNotification){
    notification = true;

    if(userSettings && userSettings.emailNotification){
      notification = true;
    }
    else{
      notification = false
    }
  }
  else{
    notification = false
  }

  return notification;

}