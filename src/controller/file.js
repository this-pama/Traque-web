require('dotenv').config();
import { Router } from 'express';
import File from '../model/file';
import User from '../model/user';
const ObjectId = require('mongoose').Types.ObjectId;

import {isObjectIdValid, sendMail, sendSms } from '../middleware/service'

var randomize = require('randomatic');

export default({ config, db }) => {
  let api = Router();

  const { FILE_NUMBER_PREFIX, EMAIL_SENDER } = process.env;
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
      // sent: []
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

    File.find({ 
      'outgoing.userId': ObjectId(userId),
      'outgoing.value' : true,
      deleted: false,
    })
    .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'outgoing','createdDate'])
    .populate({ path: "createdBy", model: 'User', select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'outgoing.receivedBy', model: "User", select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'outgoing.receivingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'outgoing.receivingDept', model: "Department", select: ['name', '_id']})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })

  //get list of data still in open registry
  api.get('/registry/:userId', async(req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    File.find({
      createdBy : userId,
      deleted: false,                       
      outgoing: { value: false},                                                
      incoming: { value: false},
      // sent:{
      //   $elemMatch : {
      //     userId : ObjectId(userId),
      //     value: false
      //   }
      // },                                                                                               
      delayed: { value: false},                                 
      pending: { value: false},
      archived: { value: false},
     })
     .then(doc=> res.status(200).json({data : doc }))
     .catch(err=> res.status(500).send(err))

  })


  //get list of archive file for a user
  api.get('/archived/:userId', async (req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    File.find({ 
      'archived.userId': ObjectId(userId),
      'archived.value' : true,
      deleted: false,
    })
    .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'archived', 
    'department', 'subDepartment', 'ministry', 'createdDate'])
    .populate({ path: "createdBy", model: 'User', select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'ministry', model: "Ministry", select: ['name', '_id']})
    .populate({ path: 'department', model: "Department", select: ['name', '_id']})
    .populate({ path: 'subDepartment', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'archived.archivedBy', model: "User", select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'archived.archivedSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'archived.archivedDept', model: "Department", select: ['name', '_id']})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })

  //achive a file
  api.post('/archive/:id/:userId', async(req, res)=>{
    const { id, userId } = req.params;
    const { location } = req.body;

    if(isObjectIdValid(userId) == false
    || isObjectIdValid(id) == false) 
      return res.status(500).send("Id not valid")

     const user = await User.findById(userId);

     if(user == null) return res.status(500).send("User not found")
     
     const pending = {
      value: false,
      label: 'Pending',
      userId: null,
  
      originatingDept : null,
      originatingSubDept :  null,
  
      sentBy: null,
      sentDate: null,
      sentTime:  null,
  
      location,
  
      receivedBy: user._id,
      receivedDate: new Date(),
      receivedTime: new Date(),
  
      receivingDept: null,
      receivingSubDept: null,
    };

    let incoming = {
      value: false,
      label: "Incoming",
      userId: null,

      originatingDept : null,
      originatingSubDept : null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    }

    let outgoing = {
      value: false,
      label: "Outgoing",
      userId: null,

      receivedBy: null,
      originatingDept : null,
      originatingSubDept : null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    }

    let delayed = {
      value: false,
      label: "Delayed",
      userId: null,

      originatingDept : null,
      originatingSubDept : null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      delayedBy: null,
      delayedDate: null,
      delayedTime: null,

      delayedDept: null,
      delayedSubDept: null,

      location: null,
    }

      let update = {
        archived: {
          value: true,
          label: "Achived",
          userId: user._id,

          archivedBy: user._id,
          archivedDate: new Date(),
          archivedTime: new Date(),

          archivedDept: user.department || null,
          archivedSubDept: user.subDepartment || null,

          location,
        },
        
        $push: { history: {
            type: 'archived',
            label: "Archived",

            archivedBy: user._id,
            archivedDate: new Date(),
            location: location,

            archivedDept: user.department || null,
            archivedSubDept: user.subDepartment || null,
        }},

        pending,
        outgoing,
        incoming,
        delayed,
        
      };

      File.findByIdAndUpdate(id, 
        update, { new: true})
      .then(async e=> {
        const sender = await User.findById(e.createdBy);

        if(sender && sender._id){
          let message = `Dear ${sender.firstName}, file ${e.name} has been archived.`;
          sendMail( EMAIL_SENDER , { email: sender.email, firstName: sender.firstName, message }, 'file');
          sendSms(sender.telephone, message);
        }

        return res.status(200).json({ message: 'success', data: e})
      })
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

    const user = await User.findById(userId);
    const receiver = await User.findById(receiverId);
    if(user == null || receiver == null) 
      return res.status(500).send("User not found");
    
    const { email, telephone, firstName } = receiver;

    const outgoing= {
      value: true,
      label: "Outgoing",
      userId: user._id,

      originatingDept : user.department,
      originatingSubDept : user.subDepartment,

      sentDate,
      sentTime,
    
      receivedBy: receiver._id,
      receivingDept: receiver ? receiver.department : null,
      receivingSubDept: receiver ? receiver.subDepartment : null,

      location,
    };

    const incoming = {
      value: true,
      label: "Incoming",
      userId: receiver._id,

      originatingDept : user.department,
      originatingSubDept : user.subDepartment,
    
      sentBy: user._id,
      sentDate,
      sentTime,

      location,
    };

    const history = {
      type : "outgoing",
      label: "Outgoing",
      originatingDept : user.department,
      originatingSubDept : user.subDepartment,
    
      sentBy: user._id,
      sentDate,
      sentTime,
    
      receivedBy: receiver._id,
      receivingDept: receiver ? receiver.department : null,
      receivingSubDept: receiver ? receiver.subDepartment : null,

      location,
    };

    let update = {
      outgoing,
      incoming,
      $push: { history: history } 
    };


    File.findByIdAndUpdate(id, update, { new: true, }) 
    .then(e=> {
      //send messages
      let message = `Hello ${firstName}, ${e.name} has been forwarded to you.`;
      sendMail( EMAIL_SENDER , { email, firstName, message }, 'file')

      sendSms(telephone, message)

      return res.status(200).json({ message: 'success', data: e})
    })
    .catch(err=> res.status(500).send(err))

  })

  //get list of incoming file for a user
  api.get('/incoming/:userId', async (req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    File.find({ 
      'incoming.userId': ObjectId(userId),
      'incoming.value' : true,
      deleted: false,
    })
    .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'incoming'])
    .populate({ path: "createdBy", model: 'User', select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'incoming.sentBy', model: "User", select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'incoming.originatingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'incoming.originatingDept', model: "Department", select: ['name', '_id']})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })


  //get list of pending file for a user
  api.get('/pending/:userId', async (req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    File.find({ 
      'pending.userId': ObjectId(userId),
      'pending.value' : true,
      deleted: false,
    })
    .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'pending'])
    .populate({ path: "createdBy", model: 'User', select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'pending.sentBy', model: "User", select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'pending.receivedBy', model: "User", select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'pending.originatingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'pending.originatingDept', model: "Department", select: ['name', '_id']})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })


  //get list of delayed file for a user
  api.get('/delayed/:userId', async (req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    File.find({ 
      'delayed.userId': ObjectId(userId),
      'delayed.value' : true,
      deleted: false,
    })
    .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'delayed'])
    .populate({ path: "createdBy", model: 'User', select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'delayed.sentBy', model: "User", select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'delayed.delayedBy', model: "User", select: ['firstName', 'lastName', '_id']})
    .populate({ path: 'delayed.delayedSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'delayed.delayedDept', model: "Department", select: ['name', '_id']})
    .populate({ path: 'delayed.originatingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'delayed.originatingDept', model: "Department", select: ['name', '_id']})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })

   //delay of a file
   api.post('/delay/:fileId/:userId', async (req,res)=>{
    const {userId, fileId } = req.params; 
    const { location, justification } = req.body;

    if(justification.length <= 0) return res.status(500).send("Justification for delay is required")

    if(isObjectIdValid(userId) == false
    || isObjectIdValid(fileId) == false) 
    return res.status(500).send("User id not valid")

    const user = await User.findById(userId);
    if(user == null) return res.status(500).send("User not found");

    const file = await File.find({_id: fileId, deleted: false });

    if(file.length <= 0) return res.status(500).send("File not found");

    const delayed = {
      value: true,
      label: 'Delayed',
      userId: user._id,
  
      originatingDept : file && file[0].pending ? file[0].pending.originatingDept : null,
      originatingSubDept : file && file.pending ? file[0].pending.originatingSubDept : null,
  
      sentBy: file && file[0].pending ? file[0].pending.sentBy : null,
      sentDate: file && file[0].pending ? file[0].pending.sentDate : null,
      sentTime: file && file[0].pending ? file[0].pending.sentTime : null,
  
      location,
      justification,

      delayedBy: user._id,
      delayedDate: new Date(),
      delayedTime: new Date(),

      delayedDept : user ? user.department : null,
      delayedSubDept : user ? user.subDepartment : null,
  
    };

    const pending = {
      value: false,
      label: 'Pending',
      userId: null,
  
      originatingDept : null,
      originatingSubDept :  null,
  
      sentBy: null,
      sentDate: null,
      sentTime:  null,
  
      location,
  
      receivedBy: user._id,
      receivedDate: new Date(),
      receivedTime: new Date(),
  
      receivingDept: null,
      receivingSubDept: null,
    };


    const history = {
      type: 'delayed',
      label: 'Delayed',
      userId: user._id,
  
      originatingDept : file && file[0].pending ? file[0].pending.originatingDept : null,
      originatingSubDept : file && file.pending ? file[0].pending.originatingSubDept : null,
  
      sentBy: file && file[0].pending ? file[0].pending.sentBy : null,
      sentDate: file && file[0].pending ? file[0].pending.sentDate : null,
      sentTime: file && file[0].pending ? file[0].pending.sentTime : null,
  
      location,

      delayedBy: user._id,
      delayedDate: new Date(),
      delayedTime: new Date(),

      delayedDept : user ? user.department : null,
      delayedSubDept : user ? user.subDepartment : null,
    };

    const sender = await User.findById(file && file[0].pending ? file[0].pending.sentBy : null)


    let update= {
      $push: { history: history },
      pending,
      delayed,
    };
    

    File.findByIdAndUpdate(fileId, 
      update, { new: true})
    .then(e=> {
      //send messages
      if(sender && sender._id){
        let message = `Dear ${sender.firstName}, ${e.name} has been delayed. Justification is ${justification}`;
        sendMail( EMAIL_SENDER , { email: sender.email, firstName: sender.firstName, message }, 'file')

        sendSms(sender.telephone, message)
      }

      return res.status(200).json({ message: 'success', data: e})
    })
    .catch(err=> res.status(500).json(err))

  })

  //acknowledge receipt of a file
  api.post('/receive/:fileId/:userId', async (req,res)=>{
    const {userId, fileId } = req.params; 
    const { location } = req.body;

    if(isObjectIdValid(userId) == false
    || isObjectIdValid(fileId) == false) 
    return res.status(500).send("User id not valid")

    const user = await User.findById(userId);
    if(user == null) return res.status(500).send("User not found");

    const file = await File.find({_id: fileId, deleted: false });

    if(file.length <= 0) return res.status(500).send("File not found");
    
    const pending = {
      value: true,
      label: 'Pending',
      userId: user._id,
  
      originatingDept : file && file[0].incoming ? file[0].incoming.originatingDept : null,
      originatingSubDept : file && file.incoming ? file[0].incoming.originatingSubDept : null,
  
      sentBy: file && file[0].incoming ? file[0].incoming.sentBy : null,
      sentDate: file && file[0].incoming ? file[0].incoming.sentDate : null,
      sentTime: file && file[0].incoming ? file[0].incoming.sentTime : null,
  
      location,
  
      receivedBy: user._id,
      receivedDate: new Date(),
      receivedTime: new Date(),
  
      receivingDept: user ? user.department : null,
      receivingSubDept: user ? user.subDepartment : null,
    };

    const sent= {
      value: true,
      label: "Sent",
      userId: file && file[0].incoming ? file[0].incoming.sentBy : null,
  
      originatingDept : file && file[0].incoming ? file[0].incoming.originatingDept : null,
      originatingSubDept : file && file[0].incoming ? file[0].incoming.originatingSubDept : null,
  
      sentBy: file && file[0].incoming ? file[0].incoming.sentBy : null,
      sentDate: file && file[0].incoming ? file[0].incoming.sentDate : null,
      sentTime: file && file[0].incoming ? file[0].incoming.sentTime : null,
  
      location,
  
      receivedBy: user._id,
      receivedDate: new Date(),
      receivedTime: new Date(),
  
      receivingDept: user ? user.department : null,
      receivingSubDept: user ? user.subDepartment : null,
    }

    const history = {
      type: 'incoming',
      label: 'Incoming',
      userId: user._id,
  
      originatingDept : file && file[0].incoming ? file[0].incoming.originatingDept : null,
      originatingSubDept : file && file.incoming ? file.incoming.originatingSubDept : null,
  
      sentBy: file && file[0].incoming ? file[0].incoming.sentBy : null,
      sentDate: file && file[0].incoming ? file[0].incoming.sentDate : null,
      sentTime: file && file[0].incoming ? file[0].incoming.sentTime : null,
  
      location,
  
      receivedBy: user._id,
      receivedDate: new Date(),
      receivedTime: new Date(),
  
      receivingDept: user ? user.department : null,
      receivingSubDept: user ? user.subDepartment : null,
    };

    let incoming = {
      value: false,
      label: "Incoming",
      userId: null,

      originatingDept : null,
      originatingSubDept : null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    }

    let outgoing = {
      value: false,
      label: "Outgoing",
      userId: null,

      receivedBy: null,
      originatingDept : null,
      originatingSubDept : null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    }

    let update= {
      pending,
      $push: { history: history, sent : sent },
      incoming,
      outgoing 
    };

    const sender = await User.findById(file && file[0].pending ? file[0].pending.sentBy : null);

    File.findByIdAndUpdate(fileId, 
      update, { new: true})
    .then(e=>{
      if(sender && sender._id){
        let message = `Dear ${sender.firstName}, ${e.name} has been received and is been processed.`;
        sendMail( EMAIL_SENDER , { email: sender.email, firstName: sender.firstName, message }, 'file')

        sendSms(sender.telephone, message)
      }

      return res.status(200).json({ message: 'success', data: e})
    })
    .catch(err=> res.status(500).send(err))

  })


  //API to get info about file for a user 
  api.get('/manage/:userId', async (req, res)=>{
    const {userId } = req.params; 
    if(isObjectIdValid(userId) == false) return res.status(500).send("User id not valid")

    const outgoing = await File.find({ 
      "outgoing.userId" : ObjectId(userId),                 
      'outgoing.value': true
    });

    const incoming = await File.find({ 
      'incoming.userId': ObjectId(userId),
      'incoming.value' : true
    });

    const sent = await File.find({ 
          'sent.userId' : ObjectId(userId),
          "sent.value" : true
      });

    const pending = await File.find({ 
      'pending.userId': ObjectId(userId),
      'pending.value': true
    });

    const delayed = await File.find({ 
      'delayed.userId': ObjectId(userId),
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


   //get the history of a file 
   api.get('/history/:id', async (req, res)=>{
    const {id } = req.params; 
    if(isObjectIdValid(id) == false) 
      return res.status(500).send("User id not valid");

    File.findById(id)
    .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'history','ministry'])
    .populate({ path: "createdBy", model: 'User', select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'ministry', model: "Ministry", select: ['name', '_id']})
    .populate({ path: 'history.createdBy', model: "User", select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'history.originatingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'history.originatingDept', model: "Department", select: ['name', '_id']})

    .populate({ path: 'history.sentBy', model: "User", select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'history.receivingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'history.receivingDept', model: "Department", select: ['name', '_id']})
    .populate({ path: 'history.receivedBy', model: "User", select: ['firstName', 'lastName', '_id', 'designation']})

    .populate({ path: 'history.delayedBy', model: "User", select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'history.delayedSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'history.delayedDept', model: "Department", select: ['name', '_id']})

    .populate({ path: 'history.archivedBy', model: "User", select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'history.archivedSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'history.archivedDept', model: "Department", select: ['name', '_id']})

    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err));

  }) 
  
  
  
   //get the list of sent file for a user 
   api.get('/sent/:id', async (req, res)=>{
    const {id } = req.params; 
    if(isObjectIdValid(id) == false) 
      return res.status(500).send("User id not valid");

    File.find({ 'sent.userId': id, 'sent.value': true })
    .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'sent','ministry'])
    .populate({ path: "createdBy", model: 'User', select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'ministry', model: "Ministry", select: ['name', '_id']})
    .populate({ path: 'sent.receivedBy', model: "User", select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'sent.receivingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'sent.receivingDept', model: "Department", select: ['name', '_id']})

    .populate({ path: 'sent.sentBy', model: "User", select: ['firstName', 'lastName', '_id', 'designation']})
    .populate({ path: 'sent.originatingSubDept', model: "Sub Department", select: ['name', '_id']})
    .populate({ path: 'sent.originatingDept', model: "Department", select: ['name', '_id']})

    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err));

  })

  return api;
}
