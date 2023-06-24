import { Router } from "express";

let router = Router();

import adminCheck from "../module/middlewares/admin-check.js";

import authCheck from '../module/middlewares/auth-check.js';

import Complains from "../module/db/postgres/Complains.js";

let complains = new Complains();

router.get('/complains', authCheck.authCheckBrowser, adminCheck.adminCheckBrowser, (req, res) => {
  res.render('Complains');
})

router.get('/complains/load', authCheck.authCheckClient, adminCheck.adminCheckClient, async (req, res) => {
  try {
    let loadedComplains = await complains.getComplains();
    res.status(200);
    res.send(loadedComplains);
  } catch(err) {
    res.status(400);
    res.send('Error');
  }
})

export default router;