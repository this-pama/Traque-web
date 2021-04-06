import mongoose from "mongoose";
import { Router } from "express";
import Settings from "../model/settings";
import User from "../model/user";
import { isObjectIdValid } from "../middleware/service";
import File from '../model/file'

import Department from "../model/department";
import SubDepartment from '../model/subDepartment'
import Ministry from '../model/ministry'

let from60Date = new Date(Date.now() - 60 * 60 * 24 * 60 * 1000); // 60 days from current date
let from61Date = new Date(Date.now() - 60 * 60 * 24 * 61 * 1000); // 61 days from current date
let from30Date = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000); // 30 days from current date
let from31Date = new Date(Date.now() - 60 * 60 * 24 * 31 * 1000); // 31 days from current date
let from90Date = new Date(Date.now() - 60 * 60 * 24 * 90 * 1000); 
let from91Date = new Date(Date.now() - 60 * 60 * 24 * 91 * 1000); 
let from120Date = new Date(Date.now() - 60 * 60 * 24 * 120 * 1000); 
let above121 = new Date(Date.now() - 60 * 60 * 24 * 121 * 1000); // 121 days from current date

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


  //get reporting 
  api.get('/report/:ministry/:department/:service/:subDepartment', async(req, res)=>{
    const { ministry, department, service, subDepartment } = req.params;

    if (isObjectIdValid(ministry) == false)
      return res.status(500).send("ministry id is required");

    if (isObjectIdValid(department) == false)
      return res.status(500).send("Department id is required");

    //check if service file id and sub department id exist
    if(service && service != null && isObjectIdValid(service)
    &&  subDepartment && subDepartment != null && isObjectIdValid(subDepartment)){
      
     const TtFile = await File.where({ ministry, department, serviceFileType: service, subDepartment }).count();

     const TtFileExceedSla = await File.where({ ministry, exceedSLA: true, department, serviceFileType: service, subDepartment }).count();
 
    
     const TtFileExceedSla30 = await 
       File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service, subDepartment })
         .where({"pending.slaExpiration": { $gte: from30Date } })
         .count();
     
     const TtFileExceedSlaBtw30_60 = await 
       File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service, subDepartment })
         .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
         .count();
 
     const TtFileExceedSlaBtw60_90 = await 
       File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service, subDepartment })
         .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
         .count();
 
 
     const TtFileExceedSla90 = await 
       File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service, subDepartment })
         .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
         .count();

      const slaAbove121 = await 
         File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service, subDepartment })
           .where({ "pending.slaExpiration": { $lt: above121, } })
           .count();
 
       const treatedToday = await 
         File
           .find({ department, serviceFileType: service, subDepartment })
           .where({ "updatedAt": { $gte: new Date() } })
           .count(); 
 
       const avgPerDay = await 
           File
             .find({ department, serviceFileType: service, subDepartment })
             .where({ "updatedAt": { $gte: new Date() } })
             .count();
       
       const avgPerWeek = await 
             File
               .find({ department, serviceFileType: service, subDepartment })
               .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
               .count();
 
       const avgPerMonth = await 
               File
                 .find({ department, serviceFileType: service, subDepartment })
                 .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                 .count();
 
         return res.status(200).json({
           totalFile: TtFile,
           totalFileExceedSla: TtFileExceedSla,
           TtFileExceedSla30,
           TtFileExceedSlaBtw30_60,
           TtFileExceedSlaBtw60_90,
           TtFileExceedSla90,
           slaAbove121,
           treatedToday,
           avgPerDay,
           avgPerWeek,
           avgPerMonth,
         })
   }

    //check if office  id exist
    else if(subDepartment && subDepartment != null && isObjectIdValid(subDepartment) ){

      const TtFile = await File.where({ ministry, department, subDepartment }).count();

      const TtFileExceedSla = await File.where({ ministry, exceedSLA: true, department, subDepartment }).count();
  
     
      const TtFileExceedSla30 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, subDepartment })
          .where({"pending.slaExpiration": { $gte: from30Date } })
          .count();
      
      const TtFileExceedSlaBtw30_60 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, subDepartment })
          .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
          .count();
  
      const TtFileExceedSlaBtw60_90 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, subDepartment })
          .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
          .count();
  
  
      const TtFileExceedSla90 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, subDepartment })
          .where({ "pending.slaExpiration": { $lt: from91Date,  $gte: from120Date } })
          .count();

      const slaAbove121 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, department, subDepartment })
            .where({ "pending.slaExpiration": { $lt: above121, } })
            .count();
  
        const treatedToday = await 
          File
            .find({ department, subDepartment })
            .where({ "updatedAt": { $gte: new Date() } })
            .count(); 
  
        const avgPerDay = await 
            File
              .find({ department, subDepartment })
              .where({ "updatedAt": { $gte: new Date() } })
              .count();
        
        const avgPerWeek = await 
              File
                .find({ department, subDepartment })
                .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
                .count();
  
        const avgPerMonth = await 
                File
                  .find({ department, subDepartment })
                  .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                  .count();
  
          return res.status(200).json({
            totalFile: TtFile,
            totalFileExceedSla: TtFileExceedSla,
            TtFileExceedSla30,
            TtFileExceedSlaBtw30_60,
            TtFileExceedSlaBtw60_90,
            TtFileExceedSla90,
            slaAbove121,
            treatedToday,
            avgPerDay,
            avgPerWeek,
            avgPerMonth,
          })
    }

      //check if service file id exist
   else if(service && service != null && isObjectIdValid(service) ){
     
      if (isObjectIdValid(service) == false) return res.status(500).send("service id is required");

      const TtFile = await File.where({ ministry, department, serviceFileType: service }).count();

      const TtFileExceedSla = await File.where({ ministry, exceedSLA: true, department, serviceFileType: service }).count();
  
     
      const TtFileExceedSla30 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service })
          .where({"pending.slaExpiration": { $gte: from30Date } })
          .count();
      
      const TtFileExceedSlaBtw30_60 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service })
          .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
          .count();
  
      const TtFileExceedSlaBtw60_90 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service })
          .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
          .count();
  
  
      const TtFileExceedSla90 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service })
          .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
          .count();
      
      const slaAbove121 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department, serviceFileType: service })
          .where({ "pending.slaExpiration": { $lt: above121, } })
          .count();
  
        const treatedToday = await 
          File
            .find({ department, serviceFileType: service })
            .where({ "updatedAt": { $gte: new Date() } })
            .count(); 
  
        const avgPerDay = await 
            File
              .find({ department, serviceFileType: service })
              .where({ "updatedAt": { $gte: new Date() } })
              .count();
        
        const avgPerWeek = await 
              File
                .find({ department, serviceFileType: service })
                .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
                .count();
  
        const avgPerMonth = await 
                File
                  .find({ department, serviceFileType: service })
                  .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                  .count();
  
          return res.status(200).json({
            totalFile: TtFile,
            totalFileExceedSla: TtFileExceedSla,
            TtFileExceedSla30,
            TtFileExceedSlaBtw30_60,
            TtFileExceedSlaBtw60_90,
            TtFileExceedSla90,
            slaAbove121,
            treatedToday,
            avgPerDay,
            avgPerWeek,
            avgPerMonth,
          })
    }

    else{
    const TtFile = await File.where({ ministry, department }).count();

    const TtFileExceedSla = await File.where({ ministry, exceedSLA: true, department }).count();

   
    const TtFileExceedSla30 = await 
      File.find({ 'pending.value' : true, exceedSLA: true, department })
        .where({"pending.slaExpiration": { $gte: from30Date } })
        .count();
    
    const TtFileExceedSlaBtw30_60 = await 
      File.find({ 'pending.value' : true, exceedSLA: true, department })
        .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
        .count();

    const TtFileExceedSlaBtw60_90 = await 
      File.find({ 'pending.value' : true, exceedSLA: true, department })
        .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
        .count();


    const TtFileExceedSla90 = await 
      File.find({ 'pending.value' : true, exceedSLA: true, department })
        .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
        .count();


    const slaAbove121 = await 
        File.find({ 'pending.value' : true, exceedSLA: true, department })
          .where({ "pending.slaExpiration": { $lt: above121, } })
          .count();


      const treatedToday = await 
        File
          .find({ department })
          .where({ "updatedAt": { $gte: new Date() } })
          .count(); 

      const avgPerDay = await 
          File
            .find({ department})
            .where({ "updatedAt": { $gte: new Date() } })
            .count();
      
      const avgPerWeek = await 
            File
              .find({ department })
              .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
              .count();

      const avgPerMonth = await 
              File
                .find({ department  })
                .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                .count();

      return res.status(200).json({
        totalFile: TtFile,
        totalFileExceedSla: TtFileExceedSla,
        TtFileExceedSla30,
        TtFileExceedSlaBtw30_60,
        TtFileExceedSlaBtw60_90,
        TtFileExceedSla90,
        slaAbove121,
        treatedToday,
        avgPerDay,
        avgPerWeek,
        avgPerMonth,
      })

    }
  })


  //get application wide file reporting
  api.get('/all/reports', async(req, res)=>{

    const TtFile = await File.count();

    const TtFileExceedSla = await File.where({ exceedSLA: true }).count();

   
    const TtFileExceedSla30 = await 
      File.find({ 'pending.value' : true, exceedSLA: true,  })
        .where({"pending.slaExpiration": { $gte: from30Date } })
        .count();
    
    const TtFileExceedSlaBtw30_60 = await 
      File.find({ 'pending.value' : true, exceedSLA: true,  })
        .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
        .count();

    const TtFileExceedSlaBtw60_90 = await 
      File.find({ 'pending.value' : true, exceedSLA: true,  })
        .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
        .count();


    const TtFileExceedSla90 = await 
      File
        .find({ 'pending.value' : true, exceedSLA: true,  })
        .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
        .count();


    const slaAbove121 = await 
        File
          .find({ 'pending.value' : true, exceedSLA: true,  })
          .where({ "pending.slaExpiration": { $lt: above121, } })
          .count();


      const treatedToday = await 
        File
          .where({ "updatedAt": { $gte: new Date() } })
          .count(); 

      const avgPerDay = await 
          File
            .where({ "updatedAt": { $gte: new Date() } })
            .count();
      
      const avgPerWeek = await 
            File
              .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
              .count();

      const avgPerMonth = await 
              File
                .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                .count();

      const ministry = await Ministry.find({})

      let data = [];
      
      for(let x of  ministry){

        const min = await File.findOne({ ministry: x && x._id })
        .select([
          "_id",
          "ministry",
        ])
        .populate({
          path: "ministry",
          model: "Ministry",
          select: ["name", "_id"],
        })

        const TtFile = await File.find({ ministry: x && x._id }).count();

        const TtFileExceedSla = await File.where({ exceedSLA: true, ministry: x && x._id  }).count();

      
        const TtFileExceedSla30 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, ministry: x && x._id   })
            .where({"pending.slaExpiration": { $gte: from30Date } })
            .count();
    
        const TtFileExceedSlaBtw30_60 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, ministry: x && x._id   })
            .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
            .count();

        const TtFileExceedSlaBtw60_90 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, ministry: x && x._id  })
            .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
            .count();


        const TtFileExceedSla90 = await 
          File
            .find({ 'pending.value' : true, exceedSLA: true, ministry: x && x._id  })
            .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
            .count();


        const slaAbove121 = await 
            File
              .find({ 'pending.value' : true, exceedSLA: true, ministry: x && x._id  })
              .where({ "pending.slaExpiration": { $lt: above121, } })
              .count();


        const treatedToday = await 
          File
          .find({ ministry: x && x._id  })
            .where({ "updatedAt": { $gte: new Date() } })
            .count(); 

        const avgPerDay = await 
            File
            .find({ ministry: x && x._id  })
              .where({ "updatedAt": { $gte: new Date() } })
              .count();
      
          const avgPerWeek = await 
                File
                .find({ ministry: x && x._id  })
                  .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
                  .count();

          const avgPerMonth = await 
                  File
                  .find({ ministry: x && x._id  })
                    .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                    .count();

          data.push({
            totalFile: TtFile,
            totalFileExceedSla: TtFileExceedSla,  
            TtFileExceedSla30,
            TtFileExceedSlaBtw30_60,
            TtFileExceedSlaBtw60_90,
            TtFileExceedSla90,
            slaAbove121,
            treatedToday,
            avgPerDay,
            avgPerWeek,
            avgPerMonth,
            ministry: min
          })

      }

      return res.status(200).json({
        totalFile: TtFile,
        totalFileExceedSla: TtFileExceedSla,
        TtFileExceedSla30,
        TtFileExceedSlaBtw30_60,
        TtFileExceedSlaBtw60_90,
        TtFileExceedSla90,
        slaAbove121,
        treatedToday,
        avgPerDay,
        avgPerWeek,
        avgPerMonth,
        ministry,
        data
      })


  })

  //get ministry wide file reporting
  api.get('/ministry/reports/:ministry', async(req, res)=>{

    const { ministry } = req.params;

    const TtFile = await File.find({ ministry }).count();

        const TtFileExceedSla = await File.where({ exceedSLA: true, ministry  }).count();

      
        const TtFileExceedSla30 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, ministry   })
            .where({"pending.slaExpiration": { $gte: from30Date } })
            .count();
    
        const TtFileExceedSlaBtw30_60 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, ministry  })
            .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
            .count();

        const TtFileExceedSlaBtw60_90 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, ministry  })
            .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
            .count();


        const TtFileExceedSla90 = await 
          File
            .find({ 'pending.value' : true, exceedSLA: true, ministry  })
            .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
            .count();


        const slaAbove121 = await 
            File
              .find({ 'pending.value' : true, exceedSLA: true, ministry  })
              .where({ "pending.slaExpiration": { $lt: above121, } })
              .count();


        const treatedToday = await 
          File
          .find({ ministry  })
            .where({ "updatedAt": { $gte: new Date() } })
            .count(); 

        const avgPerDay = await 
            File
            .find({ ministry  })
              .where({ "updatedAt": { $gte: new Date() } })
              .count();
      
        const avgPerWeek = await 
              File
              .find({ ministry })
                .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
                .count();

        const avgPerMonth = await 
                File
                .find({ ministry  })
                  .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                  .count();

    const allDepartments = await Department.find({ ministry })

    
      let data = [];
      
      for(let x of  allDepartments){

        const TtFile = await File.find({ department: x && x._id }).count();

        const TtFileExceedSla = await File.where({ exceedSLA: true, department: x && x._id  }).count();

      
        const TtFileExceedSla30 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, department: x && x._id   })
            .where({"pending.slaExpiration": { $gte: from30Date } })
            .count();
    
        const TtFileExceedSlaBtw30_60 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, department: x && x._id   })
            .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
            .count();

        const TtFileExceedSlaBtw60_90 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, department: x && x._id  })
            .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
            .count();


        const TtFileExceedSla90 = await 
          File
            .find({ 'pending.value' : true, exceedSLA: true, department: x && x._id  })
            .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
            .count();


        const slaAbove121 = await 
            File
              .find({ 'pending.value' : true, exceedSLA: true, department: x && x._id  })
              .where({ "pending.slaExpiration": { $lt: above121, } })
              .count();


        const treatedToday = await 
          File
          .find({ department: x && x._id  })
            .where({ "updatedAt": { $gte: new Date() } })
            .count(); 

        const avgPerDay = await 
            File
            .find({ department: x && x._id  })
              .where({ "updatedAt": { $gte: new Date() } })
              .count();
      
          const avgPerWeek = await 
                File
                .find({ department: x && x._id  })
                  .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
                  .count();

          const avgPerMonth = await 
                  File
                  .find({ department: x && x._id })
                    .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                    .count();

          data.push({
            totalFile: TtFile,
            totalFileExceedSla: TtFileExceedSla,  
            TtFileExceedSla30,
            TtFileExceedSlaBtw30_60,
            TtFileExceedSlaBtw60_90,
            TtFileExceedSla90,
            slaAbove121,
            treatedToday,
            avgPerDay,
            avgPerWeek,
            avgPerMonth,
            department: x
          })

      }

      return res.status(200).json({
        totalFile: TtFile,
        totalFileExceedSla: TtFileExceedSla,
        TtFileExceedSla30,
        TtFileExceedSlaBtw30_60,
        TtFileExceedSlaBtw60_90,
        TtFileExceedSla90,
        slaAbove121,
        treatedToday,
        avgPerDay,
        avgPerWeek,
        avgPerMonth,
        data
      })


  })


  //get department wide file reporting
  api.get('/department/reports/:department', async(req, res)=>{

    const { department } = req.params;

    const TtFile = await File.find({ department }).count();

        const TtFileExceedSla = await File.where({ exceedSLA: true, department  }).count();

      
        const TtFileExceedSla30 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, department   })
            .where({"pending.slaExpiration": { $gte: from30Date } })
            .count();
    
        const TtFileExceedSlaBtw30_60 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, department  })
            .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
            .count();

        const TtFileExceedSlaBtw60_90 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, department  })
            .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
            .count();


        const TtFileExceedSla90 = await 
          File
            .find({ 'pending.value' : true, exceedSLA: true, department  })
            .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
            .count();


        const slaAbove121 = await 
            File
              .find({ 'pending.value' : true, exceedSLA: true, department  })
              .where({ "pending.slaExpiration": { $lt: above121, } })
              .count();


        const treatedToday = await 
          File
          .find({ department  })
            .where({ "updatedAt": { $gte: new Date() } })
            .count(); 

        const avgPerDay = await 
            File
            .find({ department  })
              .where({ "updatedAt": { $gte: new Date() } })
              .count();
      
        const avgPerWeek = await 
              File
              .find({ department })
                .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
                .count();

        const avgPerMonth = await 
                File
                .find({ department  })
                  .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                  .count();

    const allDepartments = await SubDepartment.find({ department })

    
      let data = [];
      
      for(let x of  allDepartments){

        const TtFile = await File.find({ subDepartment: x && x._id }).count();

        const TtFileExceedSla = await File.where({ exceedSLA: true, subDepartment: x && x._id  }).count();

      
        const TtFileExceedSla30 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, subDepartment: x && x._id   })
            .where({"pending.slaExpiration": { $gte: from30Date } })
            .count();
    
        const TtFileExceedSlaBtw30_60 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, subDepartment: x && x._id   })
            .where({"pending.slaExpiration": { $lte: from31Date, $gte: from60Date } })
            .count();

        const TtFileExceedSlaBtw60_90 = await 
          File.find({ 'pending.value' : true, exceedSLA: true, subDepartment: x && x._id  })
            .where({"pending.slaExpiration": { $lte: from61Date, $gte: from90Date }})
            .count();


        const TtFileExceedSla90 = await 
          File
            .find({ 'pending.value' : true, exceedSLA: true, subDepartment: x && x._id  })
            .where({ "pending.slaExpiration": { $lt: from91Date, $gte: from120Date } })
            .count();


        const slaAbove121 = await 
            File
              .find({ 'pending.value' : true, exceedSLA: true, subDepartment: x && x._id  })
              .where({ "pending.slaExpiration": { $lt: above121, } })
              .count();


        const treatedToday = await 
          File
          .find({ subDepartment: x && x._id  })
            .where({ "updatedAt": { $gte: new Date() } })
            .count(); 

        const avgPerDay = await 
            File
            .find({ subDepartment: x && x._id  })
              .where({ "updatedAt": { $gte: new Date() } })
              .count();
      
          const avgPerWeek = await 
                File
                .find({ subDepartment: x && x._id  })
                  .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 7 * 1000) } })
                  .count();

          const avgPerMonth = await 
                  File
                  .find({ subDepartment: x && x._id })
                    .where({ "updatedAt": { $gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 1000) } })
                    .count();

          data.push({
            totalFile: TtFile,
            totalFileExceedSla: TtFileExceedSla,  
            TtFileExceedSla30,
            TtFileExceedSlaBtw30_60,
            TtFileExceedSlaBtw60_90,
            TtFileExceedSla90,
            slaAbove121,
            treatedToday,
            avgPerDay,
            avgPerWeek,
            avgPerMonth,
            subDepartment: x
          })

      }

      return res.status(200).json({
        totalFile: TtFile,
        totalFileExceedSla: TtFileExceedSla,
        TtFileExceedSla30,
        TtFileExceedSlaBtw30_60,
        TtFileExceedSlaBtw60_90,
        TtFileExceedSla90,
        slaAbove121,
        treatedToday,
        avgPerDay,
        avgPerWeek,
        avgPerMonth,
        data
      })


  })

  return api;
};
