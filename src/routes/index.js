import express from "express";
import config from "../config";
import initializeDb from "../db";
import middleware from "../middleware";
import user from "../controller/user";
import account from "../controller/account";
import usertype from "../controller/userType";
import ministry from "../controller/ministry";
import department from "../controller/department";
import subDepartment from "../controller/subDepartment";
import file from "../controller/file";
import serviceFile from "../controller/serviceFileType";
import seedUserRole from "../middleware/seedUserRoles";
import role from "../controller/role";
import settings from '../controller/settings'

let router = express();

// connect to db
initializeDb((db) => {
  // internal middleware
  router.use(middleware({ config, db }));

  // api routes v1 (/v1)
  router.use("/user", user({ config, db }));
  router.use("/account", account({ config, db }));
  router.use("/usertype", usertype({ config, db }));
  router.use("/ministry", ministry({ config, db }));
  router.use("/department", department({ config, db }));
  router.use("/department/sub", subDepartment({ config, db }));
  router.use("/file", file({ config, db }));
  router.use("/service/file", serviceFile({ config, db }));
  router.use("/seed", seedUserRole({ config, db }));
  router.use("/role", role({ config, db }));
  router.use("/settings", settings({ config, db }));
});

export default router;
