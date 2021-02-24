import mongoose from "mongoose";
import { Router } from "express";
import UserType from "../model/userTypes";
import { url } from "../db";
var seeder = require("mongoose-seed");

import { authenticate } from "../middleware/authMiddleware";

export default ({ config, db }) => {
  let api = Router();

  // '/v1/usertype' - GET all user type list
  api.get("/", (req, res) => {
    UserType.find({}, (err, users) => {
      if (err) {
        return res.status(400).json(err);
      }
      res.status(200).json(users);
    });
  });

  api.post("/create", (req, res) => {
    const { type, label, identifier } = req.body;

    let newUserType = new UserType({
      type,
      label,
      // identifier,
    });

    newUserType.save((err) => {
      if (err) return res.status(500).send(err);

      return res.status(200).json({ message: "success" });
    });
  });

  // '/v1/usertype/seed' - GET all users
  api.get("/seed", (req, res) => {
    // Connect to MongoDB via Mongoose
    seeder.connect(url, function () {
      // Load Mongoose models
      seeder.loadModels([UserType]);

      // Clear specified collections
      seeder.clearModels(["UserType"], function () {
        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function () {
          seeder.disconnect();

          res.status(200).json({ message: "success" });
        });
      });
    });

    // Data array containing seed data - documents organized by Model
    var data = [
      {
        model: "UserType",
        documents: [
          {
            type: "Super Admin",
            label: "Super Admin",
            identifier: 1,
          },
          {
            type: "Admin",
            label: "Admin",
            identifier: 2,
          },
          {
            type: "Staff",
            label: "Staff",
            identifier: 3,
          },
        ],
      },
    ];
  });

  return api;
};
