require("dotenv").config();
import { Router } from "express";
import File from "../model/file";
import User from "../model/user";
const ObjectId = require("mongoose").Types.ObjectId;

import { isObjectIdValid, sendMail, sendSms } from "../middleware/service";

var randomize = require("randomatic");

export default ({ config, db }) => {
  let api = Router();

  const { FILE_NUMBER_PREFIX, EMAIL_SENDER, SLA_HOURS } = process.env;
  //NOTE: file types: created, outgoing, incoming, pending, sent, delayed, achived

  // '/v1/file' - GET all files
  api.get("/", (req, res) => {
    File.find({}, (err, doc) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(doc);
    });
  });

  // 'v1/file/add' - create a file
  api.post("/add/:userId", async (req, res) => {
    // check if user id is valid
    const { userId } = req.params;

    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id is invalid");

    const user = await User.findById(userId);
    if (!user) return res.status(500).send("User not found");

    const { ministry, department, subDepartment } = user;
    const {
      name,
      type,
      createdDate,
      fileNo,
      location,
      serviceFileType,
      telephone,
    } = req.body;

    if (!ministry) return res.status(500).send("Ministry not found");
    //check if file number is unique
    const fileCheck = await File.find({
      manualFileNo: fileNo
    })
    if (fileCheck.length > 0) return res.status(500).send("File number must be unique");

    const rand = randomize("0", 6);

    let fileNumber = FILE_NUMBER_PREFIX + rand + "-" + fileNo;
    let history = {
      type: "created",
      label: "Created",
      createdBy: userId,
      createdDate,
      originatingDept: department,
      originatingSubDept: subDepartment,
      location,
    };

    let newFile = new File({
      name,
      type,
      telephone,
      createdBy: userId,
      createdDate,
      serviceFileType,
      fileNo: fileNumber,
      manualFileNo: fileNo,
      ministry,
      department,
      subDepartment,
      deleted: false,
      history,
      // sent: []
    });

    newFile.save(async (err, doc) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json({ message: "success", data: doc });
    });
  });

  // 'v1/file/add/upload/:userId' - bulk upload files
  api.post("/add/upload/:userId", async (req, res) => {
    // check if user id is valid
    const { userId } = req.params;

    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id is invalid");

    const user = await User.findById(userId);
    if (!user || user._id == null)
      return res.status(500).send("User not found");

    const { ministry, department, subDepartment } = user;
    const { data } = req.body;

    let upload = (await data)
      ? data.map((p) => {
          let rand = randomize("0", 6);
          let fileNumber = FILE_NUMBER_PREFIX + rand + "-" + p.fileNo;

          let history = {
            type: "created",
            label: "Created",
            createdBy: userId,
            createdDate: p.createdDate,
            originatingDept: department,
            originatingSubDept: subDepartment,
            // location,
          };

          return {
            name: p.name,
            type: p.type,
            createdBy: userId,
            createdDate: p.createdDate,
            fileNo: fileNumber,
            manualFileNo: p.fileNo,
            telephone: p.telephone,
            ministry,
            department,
            subDepartment,
            deleted: false,
            history,
          };
        })
      : [];

    if (upload.length <= 0) return res.status(400).send(" No data found");

    File.insertMany(upload)
      .then((doc) => res.status(200).send(doc))
      .catch((e) => res.status(500).send(e));
  });



  // 'v1/file/add/upload/department/:userId' - bulk upload files to specific department
  api.post("/add/upload/department/:userId", async (req, res) => {
    // check if user id is valid
    const { userId } = req.params;

    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id is invalid");

    if (isObjectIdValid(req.body.department) == false)
      return res.status(500).send("department id is invalid");

    if (req.body.subDepartment != null && isObjectIdValid(req.body.subDepartment) == false)
      return res.status(500).send("subDepartment id is invalid");

    const user = await User.findById(userId);
    if (!user || user._id == null)
      return res.status(500).send("User not found");

    const { ministry, department, subDepartment } = user;
    const { data, serviceType, type } = req.body;

    let upload = (await data)
      ? data.map((p) => {
          let rand = randomize("0", 6);
          let fileNumber = FILE_NUMBER_PREFIX + rand + "-" + p.fileNo;

          const pending = {
            value: true,
            label: "Pending",
            userId: req.body.receivedBy,
      
            originatingDept: user && user.department,
            originatingSubDept: user && user.subDepartment,
      
            sentBy: user && user._id,
            sentDate: new Date(),
            sentTime: new Date(),
      
            // location,
      
            receivedBy: req.body.receivedBy,
            receivedDate: new Date(),
            receivedTime: new Date(),
      
            receivingDept: req.body.department || null,
            receivingSubDept: req.body.subDepartment || null,
      
            // slaExpiration: new Date() + SLA_HOURS * 60 * 60 * 1000,
          };

          let history = [{
            type: "created",
            label: "Created",
            createdBy: userId,
            createdDate: p.createdDate,
            originatingDept: department,
            originatingSubDept: subDepartment,
            // location,
          },
          {      
            type: "incoming",
            label: "Incoming",
            userId: req.body.receivedBy,

            originatingDept: user && user.department,
            originatingSubDept: user && user.subDepartment,

            sentBy: user && user._id,
            sentDate: new Date(),
            sentTime: new Date(),

            // location,

            receivedBy: req.body.receivedBy,
            receivedDate: new Date(),
            receivedTime: new Date(),

            receivingDept: req.body.department || null,
            receivingSubDept: req.body.subDepartment || null,
          }
        ];

          return {
            name: p.name,
            type,
            serviceFileType: serviceType,
            createdBy: userId,
            createdDate: p.createdDate,
            fileNo: fileNumber,
            manualFileNo: p.fileNo,
            telephone: p.telephone,
            ministry,
            department,
            subDepartment,
            deleted: false,
            pending,
            history,
          };
        })
      : [];

    if (upload.length <= 0) return res.status(400).send(" No data found");

    File.insertMany(upload)
      .then((doc) => res.status(200).send(doc))
      .catch((e) => res.status(500).send(e));
  });

  //update file details
  api.put("/update/:id", async (req, res) => {
    const rand = randomize("0", 6);

    // let fileNumber = FILE_NUMBER_PREFIX +  rand + '-' + req.body.fileNo;
    let update = await { ...req.body };

    File.findByIdAndUpdate(req.params.id, update, { new: true })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //delete file details
  api.put("/delete/:id", async (req, res) => {
    if (isObjectIdValid(req.params.id) == false)
      return res.status(500).send("Id is not valid");

    File.findByIdAndUpdate(req.params.id, { deleted: true, exceedSLA: false })
      .then((e) => res.status(200).json({ message: "success" }))
      .catch((err) => res.status(500).send(err));
  });

  //get list of outgoing files
  api.get("/outgoing/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id not valid");

    File.find({
      "outgoing.userId": ObjectId(userId),
      "outgoing.value": true,
      deleted: false,
    })
      .select([
        "_id",
        "name",
        "fileNo",
        "createdBy",
        "type",
        "createdDate",
        "outgoing",
        "createdDate",
        "serviceFileType",
        'telephone'
      ])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "outgoing.receivedBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "outgoing.receivingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "outgoing.receivingDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "serviceFileType",
        model: "Service file type",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //get list of data still in open registry
  api.get("/registry/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id not valid");

    const user = await User.findById(userId);

    if(!user || user._id == null)
    return res.status(500).send("User not found");

    File.find({
      // createdBy: userId,
      ministry: user.ministry,
      deleted: false,
      outgoing: { value: false },
      incoming: { value: false },
      // sent:{
      //   $elemMatch : {
      //     userId : ObjectId(userId),
      //     value: false
      //   }
      // },
      delayed: { value: false },
      pending: { value: false },
      archived: { value: false },
    })
    .populate({
      path: "serviceFileType",
      model: "Service file type",
      select: ["name", "_id"],
    })
      .then((doc) => res.status(200).json({ data: doc }))
      .catch((err) => res.status(500).send(err));
  });

  //get list of archive file for a user
  api.get("/archived/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id not valid");

    File.find({
      "archived.userId": ObjectId(userId),
      "archived.value": true,
      deleted: false,
    })
      .select([
        "_id",
        "name",
        "fileNo",
        "createdBy",
        "type",
        "createdDate",
        "archived",
        "department",
        "subDepartment",
        "ministry",
        "createdDate",
        "serviceFileType",
        'telephone'
      ])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "ministry",
        model: "Ministry",
        select: ["name", "_id"],
      })
      .populate({
        path: "department",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "subDepartment",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "archived.archivedBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "archived.archivedSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "archived.archivedDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "serviceFileType",
        model: "Service file type",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //achive a file
  api.post("/archive/:id/:userId", async (req, res) => {
    const { id, userId } = req.params;
    const { location } = req.body;

    if (isObjectIdValid(userId) == false || isObjectIdValid(id) == false)
      return res.status(500).send("Id not valid");

    const user = await User.findById(userId);

    if (user == null) return res.status(500).send("User not found");

    const pending = {
      value: false,
      label: "Pending",
      userId: null,

      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

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

      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    };

    let outgoing = {
      value: false,
      label: "Outgoing",
      userId: null,

      receivedBy: null,
      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    };

    let delayed = {
      value: false,
      label: "Delayed",
      userId: null,

      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      delayedBy: null,
      delayedDate: null,
      delayedTime: null,

      delayedDept: null,
      delayedSubDept: null,

      location: null,
    };

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

      $push: {
        history: {
          type: "archived",
          label: "Archived",

          archivedBy: user._id,
          archivedDate: new Date(),
          location: location,

          archivedDept: user.department || null,
          archivedSubDept: user.subDepartment || null,
        },
      },

      pending,
      outgoing,
      incoming,
      delayed,
      exceedSLA: false,
    };

    File.findByIdAndUpdate(id, update, { new: true })
      .then(async (e) => {
        const sender = await User.findById(e.createdBy);

        if (sender && sender._id) {
          let message = `Dear ${sender.firstName}, file ${e.name} has been archived.`;
          sendMail(
            EMAIL_SENDER,
            { email: sender.email, firstName: sender.firstName, message },
            "file",
            sender && sender._id,
            false,
          );
          sendSms(sender.telephone, message, sender._id, true);
        }

        return res.status(200).json({ message: "success", data: e });
      })
      .catch((err) => res.status(500).send(err));
  });

  //forward file
  api.post("/forward/:id/:userId", async (req, res) => {
    const { id, userId } = req.params;
    const { receiverId, sentDate, sentTime, location } = req.body;

    if (
      isObjectIdValid(userId) == false ||
      isObjectIdValid(id) == false ||
      isObjectIdValid(receiverId) == false
    )
      return res.status(500).send("Id not valid");

    const user = await User.findById(userId);
    const receiver = await User.findById(receiverId);
    if (user == null || receiver == null)
      return res.status(500).send("User not found");

    const { email, telephone, firstName, _id } = receiver;

    const outgoing = {
      value: true,
      label: "Outgoing",
      userId: user._id,

      originatingDept: user.department,
      originatingSubDept: user.subDepartment,

      sentDate: new Date(),
      sentTime: new Date(),

      receivedBy: receiver._id,
      receivingDept: receiver ? receiver.department : null,
      receivingSubDept: receiver ? receiver.subDepartment : null,

      location,
    };

    const incoming = {
      value: true,
      label: "Incoming",
      userId: receiver._id,

      originatingDept: user.department,
      originatingSubDept: user.subDepartment,

      sentBy: user._id,
      sentDate,
      sentTime,

      location,
    };

    const pending = {
      value: false,
      label: "Pending",
      userId: null,

      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location,

      receivedBy: null,
      receivedDate: null,
      receivedTime: null,

      receivingDept: null,
      receivingSubDept: null,
    };

    const delayed = {
      value: false,
      label: "Delayed",
      userId: null,

      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime:  null,

      location,
      justification : null,

      delayedBy: null,
      delayedDate: null,
      delayedTime: null,

      delayedDept: null,
      delayedSubDept: null,
    };

    const history = {
      type: "outgoing",
      label: "Outgoing",
      originatingDept: user.department,
      originatingSubDept: user.subDepartment,

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
      pending,
      delayed,
      exceedSLA: false,
      $push: { history: history },
    };

    File.findByIdAndUpdate(id, update, { new: true })
      .then((e) => {
        //send messages
        let message = `Hello ${firstName}, ${e.name} has been forwarded to you.`;
        sendMail(EMAIL_SENDER, { email, firstName, message }, "file", _id, false);

        sendSms(telephone, message, _id, true);

        return res.status(200).json({ message: "success", data: e });
      })
      .catch((err) => res.status(500).send(err));
  });

  //get list of incoming file for a user
  api.get("/incoming/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id not valid");

    File.find({
      "incoming.userId": ObjectId(userId),
      "incoming.value": true,
      deleted: false,
    })
      .select([
        "_id",
        "name",
        "fileNo",
        "createdBy",
        "type",
        "createdDate",
        "incoming",
        "serviceFileType",
        'telephone'
      ])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "incoming.sentBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "incoming.originatingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "incoming.originatingDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "serviceFileType",
        model: "Service file type",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //get list of pending file for a user
  api.get("/pending/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id not valid");

    File.find({
      "pending.userId": ObjectId(userId),
      "pending.value": true,
      deleted: false,
    })
      .select([
        "_id",
        "name",
        "fileNo",
        "createdBy",
        "type",
        "createdDate",
        "pending",
        "exceedSLA",
        "serviceFileType",
        'telephone'
      ])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "pending.sentBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "pending.receivedBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "pending.originatingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "pending.originatingDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "serviceFileType",
        model: "Service file type",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //get list of delayed file for a user
  api.get("/delayed/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id not valid");

    File.find({
      "delayed.userId": ObjectId(userId),
      "delayed.value": true,
      deleted: false,
    })
      .select([
        "_id",
        "name",
        "fileNo",
        "createdBy",
        "type",
        "createdDate",
        "delayed",
        "serviceFileType",
        'telephone'
      ])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "delayed.sentBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "delayed.delayedBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "delayed.delayedSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "delayed.delayedDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "delayed.originatingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "delayed.originatingDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "serviceFileType",
        model: "Service file type",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //delay of a file
  api.post("/delay/:fileId/:userId", async (req, res) => {
    const { userId, fileId } = req.params;
    const { location, justification } = req.body;

    if (justification.length <= 0)
      return res.status(500).send("Justification for delay is required");

    if (isObjectIdValid(userId) == false || isObjectIdValid(fileId) == false)
      return res.status(500).send("User id not valid");

    const user = await User.findById(userId);
    if (user == null) return res.status(500).send("User not found");

    const file = await File.find({ _id: fileId, deleted: false });

    if (file.length <= 0) return res.status(500).send("File not found");

    const delayed = {
      value: true,
      label: "Delayed",
      userId: user._id,

      originatingDept:
        file && file[0].pending ? file[0].pending.originatingDept : null,
      originatingSubDept:
        file && file.pending ? file[0].pending.originatingSubDept : null,

      sentBy: file && file[0].pending ? file[0].pending.sentBy : null,
      sentDate: file && file[0].pending ? file[0].pending.sentDate : null,
      sentTime: file && file[0].pending ? file[0].pending.sentTime : null,

      location,
      justification,

      delayedBy: user._id,
      delayedDate: new Date(),
      delayedTime: new Date(),

      delayedDept: user ? user.department : null,
      delayedSubDept: user ? user.subDepartment : null,
    };

    const pending = {
      value: false,
      label: "Pending",
      userId: null,

      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location,

      receivedBy: user._id,
      receivedDate: new Date(),
      receivedTime: new Date(),

      receivingDept: null,
      receivingSubDept: null,
    };

    const history = {
      type: "delayed",
      label: "Delayed",
      userId: user._id,

      originatingDept:
        file && file[0].pending ? file[0].pending.originatingDept : null,
      originatingSubDept:
        file && file.pending ? file[0].pending.originatingSubDept : null,

      sentBy: file && file[0].pending ? file[0].pending.sentBy : null,
      sentDate: file && file[0].pending ? file[0].pending.sentDate : null,
      sentTime: file && file[0].pending ? file[0].pending.sentTime : null,

      location,

      delayedBy: user._id,
      delayedDate: new Date(),
      delayedTime: new Date(),

      delayedDept: user ? user.department : null,
      delayedSubDept: user ? user.subDepartment : null,

      justification,
    };

    const sender = await User.findById(
      file && file[0].pending ? file[0].pending.sentBy : null
    );

    let update = {
      $push: { history: history },
      pending,
      delayed,
      exceedSLA: false,
    };

    File.findByIdAndUpdate(fileId, update, { new: true })
      .then((e) => {
        //send messages
        if (sender && sender._id) {
          let message = `Dear ${sender.firstName}, ${e.name} has been delayed. Justification is ${justification}`;
          sendMail(
            EMAIL_SENDER,
            { email: sender.email, firstName: sender.firstName, message },
            "file",
            sender && sender._id,
            false
          );

          sendSms(sender.telephone, message, sender._id, true);
        }

        return res.status(200).json({ message: "success", data: e });
      })
      .catch((err) => res.status(500).json(err));
  });

  //acknowledge receipt of a file
  api.post("/receive/:fileId/:userId", async (req, res) => {
    const { userId, fileId } = req.params;
    const { location } = req.body;

    if (isObjectIdValid(userId) == false || isObjectIdValid(fileId) == false)
      return res.status(500).send("User id not valid");

    const user = await User.findById(userId);
    if (user == null) return res.status(500).send("User not found");

    const file = await File.find({ _id: fileId, deleted: false });

    if (file.length <= 0) return res.status(500).send("File not found");

    let slaExpiration = new Date().setDate( new Date().getDate() + SLA_HOURS/24);

    const pending = {
      value: true,
      label: "Pending",
      userId: user._id,

      originatingDept:
        file && file[0].incoming ? file[0].incoming.originatingDept : null,
      originatingSubDept:
        file && file.incoming ? file[0].incoming.originatingSubDept : null,

      sentBy: file && file[0].incoming ? file[0].incoming.sentBy : null,
      sentDate: file && file[0].incoming ? file[0].incoming.sentDate : null,
      sentTime: file && file[0].incoming ? file[0].incoming.sentTime : null,

      location,

      receivedBy: user._id,
      receivedDate: new Date(),
      receivedTime: new Date(),

      receivingDept: user ? user.department : null,
      receivingSubDept: user ? user.subDepartment : null,

      slaExpiration: new Date(slaExpiration),
    };

    const sent = {
      value: true,
      label: "Sent",
      userId: file && file[0].incoming ? file[0].incoming.sentBy : null,

      originatingDept:
        file && file[0].incoming ? file[0].incoming.originatingDept : null,
      originatingSubDept:
        file && file[0].incoming ? file[0].incoming.originatingSubDept : null,

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

    const history = {
      type: "incoming",
      label: "Incoming",
      userId: user._id,

      originatingDept:
        file && file[0].incoming ? file[0].incoming.originatingDept : null,
      originatingSubDept:
        file && file.incoming ? file.incoming.originatingSubDept : null,

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

      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    };

    let outgoing = {
      value: false,
      label: "Outgoing",
      userId: null,

      receivedBy: null,
      originatingDept: null,
      originatingSubDept: null,

      sentBy: null,
      sentDate: null,
      sentTime: null,

      location: null,
    };

    let update = {
      pending,
      $push: { history: history, sent: sent },
      incoming,
      outgoing,
    };

    const sender = await User.findById(
      file && file[0].pending ? file[0].pending.sentBy : null
    );

    File.findByIdAndUpdate(fileId, update, { new: true })
      .then((e) => {
        if (sender && sender._id) {
          let message = `Dear ${sender.firstName}, ${e.name} has been received and is been processed.`;
          sendMail(
            EMAIL_SENDER,
            { email: sender.email, firstName: sender.firstName, message },
            "file",
            sender && sender._id,
            false
          );

          sendSms(sender.telephone, message, sender._id, true);
        }

        return res.status(200).json({ message: "success", data: e });
      })
      .catch((err) => res.status(500).send(err));
  });

  //API to get info about file for a user
  api.get("/manage/:userId", async (req, res) => {
    const { userId } = req.params;
    if (isObjectIdValid(userId) == false)
      return res.status(500).send("User id not valid");

    const outgoing = await File.find({
      "outgoing.userId": ObjectId(userId),
      "outgoing.value": true,
    });

    const incoming = await File.find({
      "incoming.userId": ObjectId(userId),
      "incoming.value": true,
    });

    const sent = await File.find({
      "sent.userId": ObjectId(userId),
      "sent.value": true,
    });

    const pending = await File.find({
      "pending.userId": ObjectId(userId),
      "pending.value": true,
    });

    const delayed = await File.find({
      "delayed.userId": ObjectId(userId),
      "delayed.value": true,
    });

    return res.status(200).json({
      outgoing: outgoing.length,
      incoming: incoming.length,
      pending: pending.length,
      sent: sent.length,
      delayed: delayed.length,
    });
  });

  //get the history of a file
  api.get("/history/:id", async (req, res) => {
    const { id } = req.params;
    if (isObjectIdValid(id) == false)
      return res.status(500).send("User id not valid");

    File.findById(id)
      .select([
        "_id",
        "name",
        "fileNo",
        "createdBy",
        "type",
        "createdDate",
        "history",
        "ministry",
        'exceedSLA',
        'telephone',
      ])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "ministry",
        model: "Ministry",
        select: ["name", "_id"],
      })
      .populate({
        path: "history.createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "history.originatingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "history.originatingDept",
        model: "Department",
        select: ["name", "_id"],
      })

      .populate({
        path: "history.sentBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "history.receivingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "history.receivingDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "history.receivedBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })

      .populate({
        path: "history.delayedBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "history.delayedSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "history.delayedDept",
        model: "Department",
        select: ["name", "_id"],
      })

      .populate({
        path: "history.archivedBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "history.archivedSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "history.archivedDept",
        model: "Department",
        select: ["name", "_id"],
      })

      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //get the list of sent file for a user
  api.get("/sent/:id", async (req, res) => {
    const { id } = req.params;
    if (isObjectIdValid(id) == false)
      return res.status(500).send("User id not valid");

    File.find({ "sent.userId": id, "sent.value": true })
      .select([
        "_id",
        "name",
        "fileNo",
        "createdBy",
        "type",
        "createdDate",
        "sent",
        "ministry",
        "archived",
        'serviceFileType',
        'telephone'
      ])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "ministry",
        model: "Ministry",
        select: ["name", "_id"],
      })
      .populate({
        path: "sent.receivedBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "sent.receivingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "sent.receivingDept",
        model: "Department",
        select: ["name", "_id"],
      })

      .populate({
        path: "sent.sentBy",
        model: "User",
        select: ["firstName", "lastName", "_id", "designation"],
      })
      .populate({
        path: "sent.originatingSubDept",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "sent.originatingDept",
        model: "Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "serviceFileType",
        model: "Service file type",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //search for a file using name and number
  api.post("/search", (req, res) => {
    const { name, fileNo } = req.body;

    File.aggregate({
      $match: {
        $or: [
          {
            name: {
              $regex: name,
              $options: "i",
            },
          },
          {
            fileNo: {
              $regex: name,
              $options: "i",
            },
          },
        ],
      },
    })
      .project("_id name fileNo createdBy type createdDate ministry")
      .then((data) => res.status(200).json(data))
      .catch((e) => res.status(500).send(e));
  });

  //get list of department file
  api.get("/department/:department", async (req, res) => {
    const { department } = req.params;
    if (isObjectIdValid(department) == false)
      return res.status(500).send("department id not valid");

    File.find({
      department: ObjectId(department),
    })
      // .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'department', 'subDepartment'])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "subDepartment",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "department",
        model: "Department",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  //get list of ministry file
  api.get("/ministry/:ministry", async (req, res) => {
    const { ministry } = req.params;
    if (isObjectIdValid(ministry) == false)
      return res.status(500).send("ministry id not valid");

    File.find({
      ministry: ObjectId(ministry),
    })
      // .select(['_id', 'name', 'fileNo', 'createdBy', 'type', 'createdDate', 'department', 'subDepartment'])
      .populate({
        path: "createdBy",
        model: "User",
        select: ["firstName", "lastName", "_id"],
      })
      .populate({
        path: "subDepartment",
        model: "Sub Department",
        select: ["name", "_id"],
      })
      .populate({
        path: "department",
        model: "Department",
        select: ["name", "_id"],
      })
      .then((e) => res.status(200).json({ message: "success", data: e }))
      .catch((err) => res.status(500).send(err));
  });

  return api;
};
