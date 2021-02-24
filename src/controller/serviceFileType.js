require("dotenv").config();
import { Router } from "express";
import Ministry from "../model/ministry";
import ServiceFile from "../model/serviceFileType";

import { isObjectIdValid, sendMail, sendSms } from "../middleware/service";

import {
  authenticate,
  generateAccessToken,
  respond,
} from "../middleware/authMiddleware";
import User from "../model/user";

export default ({ config, db }) => {
  let api = Router();

  // '/v1/service/file' - GET all service file
  api.get("/", (req, res) => {
    ServiceFile.find({}, (err, users) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json({ data: users, message: "success" });
    });
  });

  // '/v1/service/file/:ministry' - GET all service file fro a particular ministry
  api.get("/:ministry", (req, res) => {
    ServiceFile.find({ ministry: req.params.ministry }, (err, users) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json({ data: users, message: "success" });
    });
  });

  // 'v1/service/file/add/:userId' - Add a service file type
  api.post("/add/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id is invalid");

    let user = await User.findById(userId);

    if (user == null || user._id == null)
      return res.status(500).send("User does not exist");

    const { name } = req.body;

    let service = ServiceFile({
      name,
      userId: user._id,
      ministry: user.ministry,
    });

    service.save(async (err, doc) => {
      if (err) return res.status(500).send(err);

      return res.status(200).json({
        message: "success",
        data: doc,
      });
    });
  });

  //update service file details
  api.put("/update/:id", async (req, res) => {
    ServiceFile.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    )
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  return api;
};
