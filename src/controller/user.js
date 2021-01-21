require('dotenv').config();
import { Router } from 'express';
import User from '../model/user';
import UserType from '../model/userTypes'
import Account from '../model/account'
import Ministry from '../model/ministry'
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
      ministry,
      address,
      state,
      country,
      userType,
      isAdmin,
      isSuper,
      isStaff,
      gradeLevel,
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
      ministry,
      department,
      address,
      state,
      country,
      userType: usertype && usertype[0]._id,
      isAdmin,
      isSuper,
      isStaff,
      gradeLevel,
    }, ...req.body)

    let activationKey = randomize('0', 6);
    const { EMAIL_SENDER } = process.env;

    //send error message if no minstry id
    if(!ministry && (isAdmin || isStaff))  return res.status(500).send("Ministry id is required");

    newUser.save(async (err,doc) =>{
      if(err) return res.status(500).send(err);
      
      //save user id in ministry document
      await Ministry
      .findByIdAndUpdate(ministry, {userId: doc._id}).exec()
      .catch(err=> res.status(500).send(err))

      //send activation key to user via sms and email
      sendMail( EMAIL_SENDER , { email: email, firstName, lastName, activationKey})

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


  // 'v1/user/activate/:userId' - Activate account
  api.post('/activate/:userId', async (req, res)=>{
    const { userId } = req.params;
    const { password, confirmPassword, email } = req.body;

    if(password != confirmPassword) return res.status(501)
    .json({ 
      message: 'Password and confirm password must be same'
    })

    let doc= await User.findById(userId).exec();
    if(!doc) return res.status(501)
    .json({ 
      message: 'user does not exist'
    })

    const { isAdmin, isStaff, isSuper, _id } = doc;

    Account.register(new Account({ 
      username: email, 
      email,
      isAdmin,
      isStaff,
      isSuper,
     }), password, function(err, account) {
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

    api.get('/admin-list',async (req, res)=>{
      const comments = await User.find({isAdmin: true })
      .populate('ministry')
      .populate({path : 'accountId', model: 'Account'})
      // .catch(e=> console.log('/user/admin-list', e))

       return res.status(200).json({ data: comments })
    })


  return api;
}
