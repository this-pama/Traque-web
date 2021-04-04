import Role from "../model/role";
import {
  fto,
  management,
  registry,
  registry_ser,
  registry_mgt,
  SA,
  admin,
  ministryManagement,
  departmentManagement,
} from "./roles";
import { Router } from "express";

export default ({ config, db }) => {
  let api = Router();

  api.get("/user-role", (req, res) => {
    Role.insertMany([
      fto,
      management,
      departmentManagement,
      ministryManagement,
      registry,
      admin,
      SA,
      registry_ser,
      registry_mgt,
    ])
      .then((doc) => res.status(200).send(doc))
      .catch((e) => res.status(500).send(e));
  });

  return api;
};
