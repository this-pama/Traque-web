require('dotenv').config();
import { Router } from 'express';
import File from '../model/file';
import Department from '../model/department'
import SubDepartment from '../model/subDepartment'
import Ministry from '../model/ministry'
import User from '../model/user';

import {isObjectIdValid, sendMail, sendSms } from '../middleware/service'

import { authenticate , generateAccessToken, respond } from '../middleware/authMiddleware';

var randomize = require('randomatic');

export default({ config, db }) => {
  let api = Router();

  const { FILE_NUMBER_PREFIX } = process.env;
  //NOTE: file types: created, outgoing, incoming, pending, sent, delayed, achived

  // '/v1/file' - GET all files
  api.get('/', (req, res) => {
    File.find({}, (err, doc) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(doc);
    });
  });

  // 'v1/file/add' - create a file
  api.post('/add/:userId', async (req,res) =>{
    // check if user id is valid
    const { userId } = req.params;

    if(isObjectIdValid(userId) == false)
      return res.status(500).send('User id is invalid')

    const user = await User.findById(userId);
    if(!user) return res.status(500).send('User not found')

    const { ministry, department, subDepartment } = user;
    const {
      name, type, createdDate, fileNo, location,
    }= req.body;

    const rand = randomize('0', 6);

    let fileNumber = FILE_NUMBER_PREFIX +  rand + '-' + fileNo;
    let history= {
      type: 'created',
      label: "Created",
      createdBy: userId,
      createdDate,
      originatingDept: department,
      originatingSubDept: subDepartment,
      location,
    }

    let newFile = new File({
      name, type, 
      createdBy : userId,
      createdDate, 
      fileNo: fileNumber,
      ministry, department, subDepartment,
      deleted: false,
      history,
    });

    newFile.save(async (err,doc)=>{
      if (err) return res.status(400).json(err);

      return res.status(200).json({ message: 'success', data: doc})
    })

  })

  //update file details 
  api.put('/update/:id', async (req, res)=>{
    const rand = randomize('0', 6);

    let fileNumber = FILE_NUMBER_PREFIX +  rand + '-' + req.body.fileNo;
    let update= await {...req.body, fileNo: fileNumber };
  
    File.findByIdAndUpdate(req.params.id, 
      update, 
      {new: true})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })

  //delete file details 
  api.put('/delete/:id', async (req, res)=>{
    if(isObjectIdValid(req.params.id) == false)
      return res.status(500).send('Id is not valid')

    File.findByIdAndUpdate(req.params.id, 
      { deleted: true})
    .then(e=> res.status(200).json({ message: 'success'}))
    .catch(err=> res.status(500).send(err))

  })

  //get list of outgoing files
  api.get('/outgoing/:userId', async (req, res)=>{
    const {userId } = req.params;
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    const data = await File.find({ outgoing: {
      value: true,
      userId,
    }})
    .populate({ path: 'createdBy', select: ['firstName', 'lastName', 'designation', '_id'], model: 'User' })
    .populate({path: 'department', select: ['name', '_id'] , model: "Department"})
    .populate({path: 'subDepartment', select: ['name', '_id'] , model: "Sub Department"})

    return res.status(200).json({data})
  })

  //get list of data still in open registry
  api.get('/registry/:userId', async(req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    const doc = await File.find({
      createdBy : userId,
      deleted: false,                       
      outgoing: { value: false},                                                
      incoming: { value: false},
      sent:  {
        userId: [],
        value: false
      },                                                                                               
      delayed: { value: false},
      pending: { value: false},
      archived: { value: false},
     });

     return res.status(200).json({data : doc })

  })


  //achive a file
  api.post('/archive/:id/:userId', async(req, res)=>{
    const { id, userId } = req.params;
    if(isObjectIdValid(userId) == false
    || isObjectIdValid(id) == false) 
      return res.status(500).send("Id not valid")

     const user = await User.findById(userId);

     if(user == null) return res.status(500).send("User not found")

      let update = {
        archived: {
          value: true,
          label: "Achived",
          userId: user._id
        },
        history: {
          $push: {
            archivedBy: user._id,
            archivedDate: new Date(),
            location: req.body.location,
          }
        }
      };

      File.findByIdAndUpdate(id, 
        update, { new: true})
      .then(e=> res.status(200).json({ message: 'success', data: e}))
      .catch(err=> res.status(500).send(err))

  })


  //forward file
  api.post('/forward/:id/:userId', async (req, res)=>{
    const { id, userId } = req.params;
    const { 
      receiverId, sentDate, sentTime, location,                                                                              
     } = req.body;

    if(isObjectIdValid(userId) == false
    || isObjectIdValid(id) == false
    || isObjectIdValid(receiverId) == false) 
      return res.status(500).send("Id not valid")

    const user = await User.findById(receiverId);
    if(user == null) return res.status(500).send("User not found");

    const receiver = await User.findById(userId);
    if(receiver == null) return res.status(500).send("User not found")

    const outgoing= {
      value: true,
      label: "Outgoing",
      userId: user._id,
    };

    const incoming = {
      value: true,
      label: "Incoming",
      userId: receiver._id,
    };

    const history = {
      originatingDept : user.department,
      originatingSubDept : user.subDepartment,
    
      sentBy: user._id,
      sentDate,
      sentTime,
    
      receivedBy: receiver._id,

      location,
    };

    let update = {
      outgoing,
      incoming,
      history: {
        $push: history
      }
    };

    File.findByIdAndUpdate(id, 
      update, { new: true})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })


  //API to get landing page data for sa in mobile
  api.get('/manage-landing/:userId', async (req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    const outgoing = await File.find({ 
      // "outgoing.userId" : userId,
      'outgoing.value': true
    });

    const incoming = await File.find({ 
      'incoming.value' : true
    });

    const sent = await File.find({ 
      "sent.value" : true
    });

    const pending = await File.find({ 
      'pending.value': true
    });

    const delayed = await File.find({ 
      'delayed.value': true
    });

    return res.status(200).json({
      outgoing: outgoing.length,
      incoming: incoming.length,
      pending: pending.length,
      sent: sent.length,
      delayed: delayed.length
    })

  });

  return api;
}
