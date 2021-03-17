import mongoose from "mongoose";
import { Router } from "express";
import Settings from "../model/settings";
import User from "../model/user";
import { isObjectIdValid } from "../middleware/service";

export default ({ config, db }) => {
  let api = Router();

  api.get("/", (req, res) => {
    Settings.find({}, (err, users) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json(users);
    });
  });

  // update the settings for a user
  api.post("/:userId", async (req, res) => {
    const { userId, id } = req.params;
    const { emailNotification, smsNotification } = req.body;

    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id is required");

    const user = await User.findById(userId);
    if (!user || user._id == null) return res.status(500).send("User not found");

    let data = {
      userId,
      emailNotification,
      smsNotification,
    }

    if(user.isAdmin) {
      data = { ...data, 
        ministrySettings: true,
        ministry: user && user.ministry,
      }
    }
    
    if(user.isSuper){
      return res.status(500).send('Can not set notification for super administrator')
    }

    Settings.findOneAndUpdate({ userId }, data, { new: true, upsert: true })
      .then(data=> res.status(200).json({ data }))
      .catch(e=> res.status(500).send(e))

  });


  //get user setting
  api.get("/:userId", (req, res) => {
    const { userId, id } = req.params;

    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id is required");

      Settings.findOne({ userId })
      .then(data=> res.status(200).json({ data }))
      .catch(e=> res.status(500).send(e))

  })

  return api;
};
