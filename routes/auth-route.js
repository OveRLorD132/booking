import express from "express";

import passport from '../module/authentication/passport-config.js';

import registration from "../module/authentication/registration.js";

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
        console.log(result);
        req.login(req.body, (err) => {
            console.log(err);
            if(err) return next(err);
            res.redirect('/');
        })
    } catch(err) {
        console.error(err);
        res.redirect('/registration');
    } 
})

export default router;