require("dotenv").config();
import { Router } from "express";
import SubDepartment from "../model/subDepartment";
import Department from "../model/department";
import File from "../model/file";

import { sendMail, sendSms } from "../middleware/service";

import {
  authenticate,
  generateAccessToken,
  respond,
} from "../middleware/authMiddleware";
import user from "../model/user";

export default ({ config, db }) => {
  let api = Router();

  // '/v1/department/sub' - GET all sub departments
  api.get("/", (req, res) => {
    SubDepartment.find({}, (err, users) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(users);
    });
  });

  // 'v1/department/sub/add/:department/:userid' - Add a sub department
  api.post("/add/:department/:userId", async (req, res) => {
    const userData = await user.findOne({ _id: req.params.userId });

    const dept = await Department.findOne({ _id: req.params.department });

    if (!userData || !userData.ministry)
      return res.status(500).send("user ministry not found");

    if (!dept) return res.status(500).send("department not found");

    const { name, type } = req.body;

    let sup_department = SubDepartment({
      name,
      type,
      userId: userData._id,
      ministry: userData.ministry,
      department: dept._id,
    });

    sup_department.save(async (err, doc) => {
      if (err) return res.status(500).send(err);

      dept.subDepartment.push(doc._id);
      await dept.save();

      return res.status(200).json({
        message: "success",
        data: doc,
      });
    });
  });

  //update sub department details
  api.put("/update/:id", async (req, res) => {
    SubDepartment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  return api;
};
