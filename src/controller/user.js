import mongoose from 'mongoose';
import { Router } from 'express';
import User from '../model/user';
import UserType from '../model/userTypes'
import Account from '../model/account'
import ExpoToken from "../model/expoPushToken"
import Expo from 'expo-server-sdk';
import passport from 'passport'

import {sendMail, sendSms } from '../middleware/service'

var randomize = require('randomatic');

import ActivationKey from '../model/activationKeys'

import { authenticate , generateAccessToken, respond } from '../middleware/authMiddleware';

export default({ config, db }) => {
  let api = Router();

  // '/v1/user' - GET all users
  api.get('/', (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json(users);
    });
  });

  // 'v1/user/add' - Add a user
  api.post('/add', async (req,res) =>{

    const {
      firstName,
      lastName,
      email,
      telephone,
      dob,
      gender,
      designation,
      staffId,
      department,
      address,
      state,
      country,
      userType,
    } = req.body;

    //determine if user type exist
    let usertype = await UserType.find({type: userType, label: userType}).exec()
    if(usertype.length <= 0) return res.status(500).json({message : "User type does not exist"})

    let newUser = User({
      firstName,
      lastName,
      email,
      telephone,
      dob,
      gender,
      designation,
      staffId,
      department,
      address,
      state,
      country,
      userType: usertype && usertype[0]._id,
    })

    let activationKey = randomize('0', 6);

    newUser.save(async (err,doc) =>{
      if(err) return res.status(500).send(err)
      
      //send activation key to user via sms and email
      sendMail('info@aapexapps.net', { email: email, firstName, lastName, activationKey})

      sendSms(telephone, `Hello ${firstName}, your activation code to proceed with Traquer is ${activationKey}. Valid for 24 hours.`)

      let key = new ActivationKey({
        key: activationKey,
        expiration: Date.now() + (3600000 * 24), //24 hours
        userId: doc._id,
        email,
      })
  
      await key.save();

      return res.status(200).json({
        message: 'success',
        key: activationKey,
      });
      
    });


  })

  // 'v1/user/update/:id' - Update a user
  api.put('/update/:id', async (req,res) =>{
    const { id } = req.params;

    User.findByIdAndUpdate(id, req.body, {new: true}, (err, user)=>{
      if(err) return res.status(500).send(err)

      return res.status(200).json({
        message: 'success',
        data: user,
      });
    })

  })

  // 'v1/user/validate'  - Validate account using verification key
  api.post('/validate', (req, res)=>{
    const {
      activationKey,
    } = req.body;

    ActivationKey.findOne({
      key: activationKey, 
      expiration: { $gt: Date.now() }  
      },
      (err, key) =>{
        if(err) return res.status(500).send(err)

        return res.status(200).json({ message: 'success', data: key })
      }

    )
  })


  // 'v1/user/activate/:userId' - Activate activate account
  api.post('/activate/:userId', async (req, res)=>{
    const { userId } = req.params;
    const { password, confirmPassword, email } = req.body;

    if(password != confirmPassword) return res.status(501)
    .json({ 
      message: 'Password and confirm password must be same'
    })

    let doc= await User.findById(userId).exec();

    Account.register(new Account({ username: email, email }), password, function(err, account) {
      if (err) return res.status(500).json(err);
      
      passport.authenticate(
        'local', {
          session: false
      })(req, res, async () => {
        
        doc.accountId = account._id;

        await doc.save();

        return res.status(200).json({ message: 'success'})
              
      })
    });

  })


   //Save Expo Push Notification Token
    api.post('/push-token', (req, res)=>{
      if (!Expo.isExpoPushToken(req.body.token)) {
        return res.status(201).json({
          message: `Push token ${req.body.token} is not a valid Expo push token`
        });
      }

      ExpoToken.find({ 
        token:  req.body.token,
        user:  req.body.user
      }, (err, savedToken)=>{
        if(err){ return res.status(500).json(err) }
        
        if( savedToken.length > 0){
          return res.status(200).json({ success: false, message: "token already saved"})
        }

          let saveToken = new ExpoToken(req.body)
            saveToken.save(err=>{
              if(err){ return res.status(500).json(err)}
              return res.status(200).json({ success: true , message: "success"})
            }) 
        
      })  
    })


  return api;
}
