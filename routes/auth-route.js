import express from "express";

import passport from '../module/authentication/passport-config.js';

import registration from "../module/authentication/registration.js";

import validation from "../module/user-properties-change/validation.js";

import Rent from "../module/db/postgres/Rent.js";

let rent = new Rent();

let router = express.Router();

router.get('/registration', (req, res) => {
    res.render('Registration');
})

router.get('/login', (req, res) => {
    res.render('Login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}),async(req, res) => {})

router.post('/registration', async (req, res, next) => {
    try {
        let result = await registration(req.body);
        req.login(result, (err) => {
            if(err) return next(err);
            res.redirect('/');
        })
    } catch(err) {
        console.error(err);
        res.redirect('/registration');
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
            let usernameMatches = await rent.checkUsernameUnique(username);
            let emailMatches = await rent.checkEmailUnique(email);
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