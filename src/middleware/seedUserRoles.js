import Role from '../model/role'
import { fto, management, registry, SA, admin } from './roles'
import { Router } from 'express';

export default({ config, db }) => {
    let api = Router();

    api.get('/user-role', (req, res) => {
        Role.insertMany([
            fto, management, registry, admin, SA
        ])
        .then((doc)=> res.status(200).send(doc))
        .catch(e=> res.status(500).send(e))
    })

    return api;
}