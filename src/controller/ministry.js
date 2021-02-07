require('dotenv').config();
import { Router } from 'express';
import Ministry from '../model/ministry';

import {sendMail, sendSms } from '../middleware/service'

import { authenticate , generateAccessToken, respond } from '../middleware/authMiddleware';
import user from '../model/user';

export default({ config, db }) => {
  let api = Router();

  // '/v1/ministry' - GET all ministry
  api.get('/', (req, res) => {
    Ministry.find({})
    .populate({ path: "userId", model: 'User', select: ['firstName', 'lastName', '_id']})
    .then(users=> res.status(200).json(users))
    .catch(err=> res.status(400).json(err))
  });

  // 'v1/ministry/add' - Add a ministry
  api.post('/add', async (req,res) =>{

    const {
      name
    } = req.body;

    let ministry = Ministry({name})

    ministry.save(async (err,doc) =>{
      if(err) return res.status(500).send(err);

      return res.status(200).json({
        message: 'success',
        data: doc,
      });
      
    });
  })

  //update ministry details
  api.put('/update/:id', async (req, res)=>{
    Ministry.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })

  //get list of ministry and data of admin TODO=> admin
  api.get('/ministry-list', async (req, res)=>{
    const data = await Ministry.find()
    .populate({ path: 'userId', model: 'User' })
    // .populate({path: 'userId', select: ['ministry', 'firstName', 'lastName'] , model: "User"})

    return res.status(200).json({data})
  })


  //API to get landing page data for sa in mobile
  api.get('/sa-landing/:accountId', async (req, res)=>{
    const ministry = await Ministry.find({});
    const admin =await  user.find({isAdmin: true});
    const userData = await user.findOne({accountId: req.params.accountId })

    return res.status(200).json({
      ministryCount: ministry.length,
      adminCount: admin.length,
      user: userData,
    })

  });

  return api;
}
