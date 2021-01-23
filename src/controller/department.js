require('dotenv').config();
import { Router } from 'express';
import Department from '../model/department';
import File from '../model/file'

import {sendMail, sendSms } from '../middleware/service'

import { authenticate , generateAccessToken, respond } from '../middleware/authMiddleware';
import user from '../model/user';

export default({ config, db }) => {
  let api = Router();

  // '/v1/ministry' - GET all departments
  api.get('/', (req, res) => {
    Department.find({}, (err, users) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(users);
    });
  });

  // 'v1/department/add/:userid' - Add a department
  api.post('/add/:userId', async (req,res) =>{

    const userData = await user.findOne({_id : req.params.userId})

    if(!userData || !userData.ministry) return res.status(500).send('user ministry not found');

    const {
      name,
      type,
    } = req.body;

    let department = Department({
      name,
      type,
      userId: userData._id,
      ministry: userData.ministry,
    })

    department.save(async (err,doc) =>{
      if(err) return res.status(500).send(err);

      return res.status(200).json({
        message: 'success',
        data: doc,
      });
      
    });
  })

  //update department details
  api.put('/update/:id', async (req, res)=>{
    Department.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(e=> res.status(200).json({ message: 'success', data: e}))
    .catch(err=> res.status(500).send(err))

  })

  //get list of dept and data of admin TODO=> admin
  api.get('/department-list', async (req, res)=>{
    const data = await Department.find()
    .populate({ path: 'userId', model: 'User' })
    .populate({path: 'userId', select: ['ministry', 'firstName', 'lastName'] , model: "User"})

    return res.status(200).json({data})
  })


  //API to get landing page data for sa in mobile
  api.get('/admin-landing/:userId', async (req, res)=>{
    const department = await Department.find({userId : req.params.userId});
    const staffCount = await  department.map(p=> p.staff).flat();
    const userData = await user.findById(req.params.userId);
    const fileCount = await File.find({ ministry : userData.ministry });

    return res.status(200).json({
      departmentCount: department.length,
      staffCount: staffCount.length,
      fileCount: fileCount.length,
      user: userData,
    })

  });

  //get list of department created by an admin
  api.get('/department-list/:userId', async  (req, res)=>{
    const department = await Department.find({userId : req.params.userId});
    return res.status(200).json({ data : department, message: 'success'})
  })

  //get details of a sepecific  department by id
  api.get('/details/:id', async (req, res) =>{
    const data= await Department.findById(req.params.id)
    .populate('ministry')
    .populate('subDepartment')

    return res.status(200).json({data})
  })

  return api;
}
