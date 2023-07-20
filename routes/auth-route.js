import express from "express";

import passport from '../module/authentication/passport-config.js';

import bcrypt from 'bcrypt';

import validation from "../module/user-properties-change/validation.js";

import Users from "../module/db/postgres/Users.js";
import authCheck from "../module/middlewares/auth-check.js";

let users = new Users();

let router = express.Router();

router.get('/registration', (req, res) => {
    res.render('Registration');
})

router.get('/login', (req, res) => {
    res.render('Login');
})

router.get('/logout', authCheck.authCheckBrowser, async (req, res) => {
    req.logout((err) => {
        if(err) req.flash('error', 'Error During Logging Out');
        res.redirect('/login');
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}),async(req, res) => {})

router.post('/registration', async (req, res, next) => {
    let registrationObj = req.body;
    let { first_name, last_name, username, email, password, gender, phone, birth_date, type, country, description} = registrationObj
    if(!first_name || !last_name || !username || !email || !password || !type) {
        res.status(400);
        req.flash('error', 'Invalid input.');
        res.send('Error');
        return;
    } else if(type === 'Host' && !description) {
        res.status(400);
        req.flash('error', 'Invalid input.');
        res.send('Error');
        return;
    } else if(await users.checkUsernameUnique(username) > 0 ||await users.checkEmailUnique(email)) {
        res.status(400);
        req.flash('error', 'Invalid input.');
        res.send('Error');
        return;
    }
    try {
        validation.validateUsername(username);
        validation.validateFirstName(first_name);
        validation.validateLastName(last_name);
        validation.validateEmail(email);
        validation.validatePassword(password);
        validation.validateGender(gender);
        validation.validatePhoneNumber(phone);
        validation.validateBirthDate(birth_date);
        validation.validateType(type);
        validation.validateCountry(country);
        validation.validateDescription(description);
        try {
            password = await bcrypt.hash(password, 11);
        } catch(err) {
            res.status(500);
            req.flash('Internal Server Error');
            res.send('Error');
            return;
        }
        registrationObj = { 
            first_name, 
            last_name,
            username, 
            email, 
            password, 
            gender, 
            phone, 
            birth_date, 
            type, 
            country, 
            description
        }
        let object = await users.createProfile(registrationObj)
        req.login(object, (err) => {
            if(err) {
                req.flash('error', 'Internal Server Error');
                res.status(500);
                res.send('Internal Server Error');
                return;
            } else {
                res.status(200);
                res.send('Success');
                return;
            }
        });
    } catch(err) {
        req.flash('error', err.message)
        res.status(400);
        res.send('Error');
    }
})

router.post('/registration/unique-check', async(req, res) => {
    let { username, email } = req.body; 
    try {
        validation.validateUsername(username);
    } catch(err) {
        username = '';
    }
    try {
        validation.validateEmail(email);
    } catch(err) {
        email = '';
    }
    if(!username || !email) {
        res.status(500);
        res.send('Invalid request.');
    }
    else {
        try {
            let usernameMatches = await users.checkUsernameUnique(username);
            let emailMatches = await users.checkEmailUnique(email);
            if(usernameMatches > 0 || emailMatches > 0) {
                if(usernameMatches > 0) req.flash('error', 'This username is already taken.');
                if(emailMatches > 0) req.flash('error', 'This email is already taken.');
                res.status(400);
                res.send('Not unique');
            }
            else {
                res.status(200);
                res.send('Unique');
            }
        } catch(err) {
            res.status(500);
            res.send('Internal Server Error');
        }
    }
})

export default router;