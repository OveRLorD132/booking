import { Router } from "express";

import changeProperties from '../module/user-properties-change/change.js';

import validation from "../module/user-properties-change/validation.js";

let router = Router();

router.get('/profile', async(req, res) => {
    res.render('Profile');
})

router.patch('/profile/change-profile', async(req, res) => {
    let { username, first_name, last_name, gender} = req.body
    try {
        validation.validateUsername(username);
    } catch(err) {
        req.flash('error', err.message);
        username = "";
    }
    try {
        validation.validateFirstName(first_name);
    } catch(err) {
        req.flash('error', err.message);
        first_name = "";
    }
    try {
        validation.validateLastName(last_name);
    } catch(err) {
        req.flash('error', err.message);
        last_name = "";
    }
    try {
        validation.validateGender(gender);
    } catch(err) {
        req.flash('error', err.message);
        gender = "";
    }
    let changeObj = { username, first_name, last_name, gender};
    let doneObj = {};
    try {
        await changeProperties(changeObj, req.user.id, doneObj);
        res.status(200);
        req.flash('success', 'Change successfull.');
        res.send(doneObj);
    } catch(err) {
        console.log(err);
        if(err.routine === '_bt_check_unique' && err.constraint === 'users_username_key') {
            req.flash('error', 'This username is already taken.')
        }
        res.status(204);
        res.send(doneObj);
    }
})

router.patch('/profile/change-account-data', async(req, res) => {
    let { email, country, phone_number } = req.body;
    try {
        validation.validateEmail(email);
    } catch(err) {
        req.flash('error', err.message);
        email = "";
    }
    try {
        validation.validateCountry(country);
    } catch(err) {
        req.flash('error', err.message);
        country = "";
    }
    try {
        validation.validatePhoneNumber(phone_number);
    } catch(err) {
        req.flash('error', err.message);
        phone_number = "";
    }
    let changeObj = { email, country, phone_number};
    let doneObj = {};
    try {
        await changeProperties(changeObj, req.user.id, doneObj);
        res.status(200);
        req.flash('success', 'Change successfull.');
        res.send(doneObj);
    } catch(err) {
        if(err.routine === '_bt_check_unique' && err.constraint === 'users_email_key') {
            req.flash('error', 'This e-mail is already taken.')
        }
        res.status(204);
        res.send(doneObj);
    }
})

export default router;