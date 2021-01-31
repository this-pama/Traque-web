require('dotenv').config();
import { Router } from 'express';
import User from '../model/user';
import UserType from '../model/userTypes'
import Account from '../model/account'
import Ministry from '../model/ministry'
import Department from '../model/department'
import SubDepartment from '../model/subDepartment'
import ExpoToken from "../model/expoPushToken"
import Expo from 'expo-server-sdk';
import passport from 'passport'

import {sendMail, sendSms, isObjectIdValid } from '../middleware/service'

var randomize = require('randomatic');

import ActivationKey from '../model/activationKeys'

import { authenticate , generateAccessToken, respond } from '../middleware/authMiddleware';
import { select } from 'async';

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

  api.get('/:id', (req, res) => {
    if(isObjectIdValid(req.params.id) == false) 
      return res.status(400).send('User id is not valid');
      
    User.findById(req.params.id, (err, users) => {
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

    // //determine if user type exist
    // let usertype = await UserType.find({type: userType, label: userType}).exec()
    // if(usertype.length <= 0) return res.status(500).json({message : "User type does not exist"})

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
      // userType: usertype && usertype[0]._id,
      isAdmin,
      isSuper,
      // isStaff,
      gradeLevel,
      permission:{
        createServiceFile: true,
        createMagementFile: false,
        viewReport: true,
        viewSectionReport: true,
        viewGeneralReport: true
      }
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


  // 'v1/user/add' - Add a staff user 
  api.post('/add/staff', async (req,res) =>{

    const {
      firstName, lastName,email, telephone,
      dob, gender, designation, staffId, 
      ministry, address, state, country, permission,
      gradeLevel, department, subDepartment,
    } = req.body;

    //send error message if no minstry or department id
    if(isObjectIdValid(ministry) == false 
      || isObjectIdValid(department) == false )  
        return res.status(500).send("Ministry and Department id is required");

      //send error if sub department but id not vaild
    if(subDepartment != null && isObjectIdValid(subDepartment) == false) 
      return res.status(500).send("Sub department id is must be valid");


    let newUser = User({
      firstName, lastName,email, telephone,
      dob, gender, designation, staffId, department, 
      subDepartment : subDepartment != null ? subDepartment : null,
      ministry, address, state, country, permission,
      gradeLevel, isStaff: true, gradeLevel, 
    }, ...req.body)

    let activationKey = randomize('0', 6);
    const { EMAIL_SENDER } = process.env;

    newUser.save(async (err,doc) =>{
      if(err) return res.status(500).send(err);

      //push staff id to ministry staff array
      await Ministry.findByIdAndUpdate(ministry, {
        $push: { staff : doc._id }
      })
      .catch(e=>  res.status(500).send(e) )

      //push staff id to department staff array
      await Department.findByIdAndUpdate(department, {
        $push: { staff : doc._id }
      })
      .catch(e=>  res.status(500).send(e) )


      //if sub department details exist, save staff id in sub department
      if( subDepartment && isObjectIdValid(subDepartment)){
        await SubDepartment.findByIdAndUpdate(subDepartment, {
          $push: { staff : doc._id }
        })
      }

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
      async (err, key) =>{
        if(err || !key) return res.status(500).send(err)

        User.findById(key.userId, (err, user)=>{
          if(err) return res.status(500).send(err)

          return res.status(200).json({ message: 'success', data: { key, user} })
        });

        
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
      userId: _id,
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


    //get list of staff related to admin id
    api.get('/staff-list/:userId', async (req, res)=>{
      const { userId } = req.params;
      if(isObjectIdValid(userId) == false) return res.status(500).send('User id is not valid')

      const user = await User.findById(userId);

      if(!user || !user.ministry) return res.status(500).send('Ministry id is not found')

      const data = await User.find({ ministry : user.ministry, isStaff: true })
                        .populate({path: 'department', select: ['_id', 'name'] })
                        .populate({path: 'subDepartment', select: ['_id', 'name'] })
                        .populate({path: 'ministry', select: ['_id', 'name'] })

      return res.status(200).json({ data })
    })


  return api;
}
