import express from 'express';
let router = express.Router();

import UserRepostitory from '../module/db/postgres/Users.js';
import Rent from '../module/db/postgres/Rent.js';
let userRepository = new UserRepostitory();

router.get('/', (req, res) => {
    res.redirect('/booking');
})

router.get('/main', (req, res) => {
    res.redirect('/booking');
})

router.get('/booking', (req, res) => {
    res.render('main');
})

router.get('/booking/load-rent', async (req, res) => {
    try {
        let list = await Rent.prototype.loadList();
        res.status(200).send(list.rows);
    } catch(err) {
        req.flash('Internal Server Error');
        res.status(500);
        res.send('Error');
    }
})

router.patch('/booking/to-wish', async(req, res) => {
    try {
        let response = await userRepository.addToWishlist(req.body.id, req.body.user_id);
        console.log(response);
        res.status(200);
        res.send('OK');
    } catch(err) {
        console.error(err);
        res.status(500);
        res.send('Error');
    }
})

router.patch('/booking/remove-wish', async(req, res) => {
    if(!req.user || req.body.user_id !== req.user.id) {
        res.status(500);
        res.send('Error')
    }
    try {
        let response = await userRepository.removeFromWishlist(req.body.id, req.body.user_id);
        console.log(response);
        res.status(200);
        res.send('OK');
    } catch(err) {
        console.error(err);
        res.status(500);
        res.send('Error');
    }
})

export default router;