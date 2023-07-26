import { Router } from "express";
import authCheck from "../module/middlewares/auth-check.js";

import Users from "../module/db/postgres/Users.js";

let users = new Users();

import bcrypt from 'bcrypt';
import validation from "../module/user-properties-change/validation.js";

let router = Router();

router.get('/profile/change-password', authCheck.authCheckBrowser, async (req, res) => {
  res.render('PasswordChange');
})

router.patch('/profile/change-password', authCheck.authCheckClient, async (req, res) => {
  try {
    let password = await users.getPassword(req.user.id);
    if(await bcrypt.compare(req.body.password, password)) {
      try {
        validation.validatePassword(req.body.newPassword);
        let newPassword = await bcrypt.hash(req.body.newPassword, 11);
        await users.changeUserProperty('password', newPassword, req.user.id);
        res.status(200);
        req.flash('success', 'Password changed successfully');
        res.send('Success');
      } catch(err) {
        res.status(400);
        req.flash('error', 'Validation Error');
        res.send('Validation Error');
      }
    } else {
      res.status(400);
      req.flash('error', 'Invalid password');
      res.send('Bad request');
    }
  } catch(err) {
    res.status(500);
    req.flash('error', 'Internal Server Error');
    res.send('Internal Server Error');
  }
})

export default router;