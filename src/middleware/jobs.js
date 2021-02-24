require("dotenv").config();
import File from "../model/file";
import User from "../model/user";
import { sendMail, sendSms } from "./service";
const { SLA_HOURS, EMAIL_SENDER } = process.env;

export const SLAJob = async () => {
  //update files that have exceeded sla time
  File.updateMany(
    {
      "pending.value": true,
      "pending.slaExpiration": { $lt: Date.now() },
      //    sendSlaNotification : false,
      deleted: false,
      exceedSLA: false,
      type: "Service file",
    },
    { exceedSLA: true }
  )
    .then((e) => console.log(e.nModified + " SLA files update."))
    .catch((e) => console.log("error occurred ", e));

  //send email and sms for files that have 1 hour to exceed sla

  const message = (p) =>
    `Dear ${p.firstName}, The file ${p.fileName} will default the SLA time in the next one hour. Kindly attend to the file as soon as possible.`;

  File.find({
    "pending.value": true,
    "pending.slaExpiration": { $gt: Date.now() - 60 * 60 * 1000 },
    deleted: false,
    exceedSLA: false,
    type: "Service file",
  })
    .select([
      "_id",
      "name",
      "fileNo",
      "createdBy",
      "type",
      "createdDate",
      "pending",
    ])
    .populate({ path: "pending.userId", model: "User" })
    .then((e) => {
      console.log(`sending notification for ${e.length} files`);
      e.map((p) => {
        if (p._id) {
          let data = {
            email: p.pending && p.pending.userId.email,
            telephone: p.pending && p.pending.userId.telephone,
            firstName: p.pending && p.pending.userId.firstName,
            lastName: p.pending && p.pending.userId.lastName,
            fileName: p.name,
            fileNo: p.fileNo,
          };
          sendSms(data.telephone, message(data));
          sendMail(
            EMAIL_SENDER,
            {
              email: data.email,
              firstName: data.firstName,
              message: message(data),
            },
            "file"
          );
        }

        return;
      });
    })
    .catch((e) => console.log("error occurred while sending email and sms", e));
};
