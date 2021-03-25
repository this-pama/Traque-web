import mongoose from "mongoose";
import { Router } from "express";
import Settings from "../model/settings";
import User from "../model/user";
import { isObjectIdValid } from "../middleware/service";
import File from '../model/file'

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

      let from60Date = new Date(Date.now() - 60 * 60 * 24 * 60 * 1000); // 60 days from current date
      let from30Date = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000); // 30 days from current date
      let from90Date = new Date(Date.now() - 60 * 60 * 24 * 90 * 1000); // 60 days from current date

    //check if service file id and sub department id exist
    if(service && service != null && isObjectIdValid(service)
    &&  subDepartment && subDepartment != null && isObjectIdValid(subDepartment)){
      
     const TtFile = await File.where({ ministry, department, serviceFileType: service, subDepartment }).count();

     const TtFileExceedSla = await File.where({ ministry, exceedSLA: true, department, serviceFileType: service, subDepartment }).count();
 
    
     const TtFileExceedSla30 = await 
       File.find({ 'pending.value' : true, department, serviceFileType: service, subDepartment })
         .where({"pending.slaExpiration": { $lte: from30Date, $gte: new Date() } })
         .count();
     
     const TtFileExceedSlaBtw30_60 = await 
       File.find({ 'pending.value' : true, department, serviceFileType: service, subDepartment })
         .where({"pending.slaExpiration": { $lte: from30Date, $gte: from60Date } })
         .count();
 
     const TtFileExceedSlaBtw60_90 = await 
       File.find({ 'pending.value' : true, department, serviceFileType: service, subDepartment })
         .where({"pending.slaExpiration": { $lte: from60Date, $gte: from90Date }})
         .count();
 
 
     const TtFileExceedSla90 = await 
       File.find({ 'pending.value' : true, department, serviceFileType: service, subDepartment })
         .where({ "pending.slaExpiration": { $lt: from90Date } })
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
        File.find({ 'pending.value' : true, department, subDepartment })
          .where({"pending.slaExpiration": { $lte: from30Date, $gte: new Date() } })
          .count();
      
      const TtFileExceedSlaBtw30_60 = await 
        File.find({ 'pending.value' : true, department, subDepartment })
          .where({"pending.slaExpiration": { $lte: from30Date, $gte: from60Date } })
          .count();
  
      const TtFileExceedSlaBtw60_90 = await 
        File.find({ 'pending.value' : true, department, subDepartment })
          .where({"pending.slaExpiration": { $lte: from60Date, $gte: from90Date }})
          .count();
  
  
      const TtFileExceedSla90 = await 
        File.find({ 'pending.value' : true, department, subDepartment })
          .where({ "pending.slaExpiration": { $lt: from90Date } })
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
        File.find({ 'pending.value' : true, department, serviceFileType: service })
          .where({"pending.slaExpiration": { $lte: from30Date, $gte: new Date() } })
          .count();
      
      const TtFileExceedSlaBtw30_60 = await 
        File.find({ 'pending.value' : true, department, serviceFileType: service })
          .where({"pending.slaExpiration": { $lte: from30Date, $gte: from60Date } })
          .count();
  
      const TtFileExceedSlaBtw60_90 = await 
        File.find({ 'pending.value' : true, department, serviceFileType: service })
          .where({"pending.slaExpiration": { $lte: from60Date, $gte: from90Date }})
          .count();
  
  
      const TtFileExceedSla90 = await 
        File.find({ 'pending.value' : true, department, serviceFileType: service })
          .where({ "pending.slaExpiration": { $lt: from90Date } })
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
      File.find({ 'pending.value' : true, department })
        .where({"pending.slaExpiration": { $lte: from30Date, $gte: new Date() } })
        .count();
    
    const TtFileExceedSlaBtw30_60 = await 
      File.find({ 'pending.value' : true, department })
        .where({"pending.slaExpiration": { $lte: from30Date, $gte: from60Date } })
        .count();

    const TtFileExceedSlaBtw60_90 = await 
      File.find({ 'pending.value' : true, department })
        .where({"pending.slaExpiration": { $lte: from60Date, $gte: from90Date }})
        .count();


    const TtFileExceedSla90 = await 
      File.find({ 'pending.value' : true, department })
        .where({ "pending.slaExpiration": { $lt: from90Date } })
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
        treatedToday,
        avgPerDay,
        avgPerWeek,
        avgPerMonth,
      })

    }


  })

  return api;
};
