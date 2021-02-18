import mongoose from 'mongoose';
import { Router } from 'express';
import Role from '../model/role';
import User from '../model/user'
import { isObjectIdValid } from '../middleware/service';
import allPermission from '../middleware/permissions'

export default({ config, db }) => {
  let api = Router();

  
  api.get('/', (req, res) => {
    Role.find({}, (err, users) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json(users);
    });
  });


  // update the user role for a user
  api.post('/:userId/:id', (req, res)=>{
    const { userId, id }= req.params;

    if(isObjectIdValid(userId) == false
    || isObjectIdValid(id) == false) 
    return res.status(500).send("User id and role id is required")

    const role = Role.findById(id)
    if(!role) return res.status(500).send("Role id is not valid")

    User.findByIdAndUpdate(userId, { userRole: id}, {new: true })
    .then(user=> res.status(200).json(user))
    .catch(e=> res.status(500).send(e))

  })

  //get the list of all available permission
  api.get('/all-roles', (req,res)=>{
    res.status(200).json(allPermission)
  })

  //create a permission
  api.post('/create', (req, res)=>{
    const { name, permission }= req.body;

    let perm = new Role({ name, permission })

    perm.save()
    .then(e => res.status(200).json(e))
    .catch(e=> res.status(500).send(e))
  })

  //update user role
  api.put('/update/:id', (req, res)=>{
    const { id }= req.params;
    const { name, permission }= req.body;

    if(isObjectIdValid(id) == false) return res.status(500).send("Id is required")

    Role.findByIdAndUpdate(id, {name, permission}, { new: true })
    .then(e => res.status(200).json(e))
    .catch(e=> res.status(500).send(e))

  })

  return api;
}
