import express from 'express';
import config from '../config';
import initializeDb from '../db';
import middleware from '../middleware';
import user from '../controller/user';
import account from '../controller/account';
import usertype from '../controller/userType'
import ministry from '../controller/ministry'
import department from '../controller/department'
import subDepartment from '../controller/subDepartment'


let router = express();

// connect to db
initializeDb(db => {

  // internal middleware
  router.use(middleware({ config, db }));

  // api routes v1 (/v1)
  router.use('/user', user({ config, db }));
  router.use('/account', account({ config, db }));
  router.use('/usertype', usertype({ config, db }));
  router.use('/ministry', ministry({ config, db }));
  router.use('/department', department({ config, db }))
  router.use('/department/sub', subDepartment({ config, db }))

});

export default router;
