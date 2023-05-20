import express from 'express';
let router = express.Router();

import UserRepostitory from '../module/db/postgres/user-repository.js';
let userRepository = new UserRepostitory();

router.get('/', (req, res) => {
    res.redirect('/booking');
})

router.get('/main', (req, res) => {
    res.redirect('/booking');
})

router.get('/booking', (req, res) => {
    console.log(req);
    res.render('main');
})

router.patch('/booking/to-wish', async(req, res) => {
    try {
        let response = await userRepository.addToWishlist(req.body.id, req.body.user_id);
        console.log(response);
        res.status(200);
        res.send('OK');
    } catch(err) {
        console.error(err);
        res.status(400);
        res.send('Error');
    }
})

router.patch('/booking/remove-wish', async(req, res) => {
    try {
        let response = await userRepository.removeFromWishlist(req.body.id, req.body.user_id);
        console.log(response);
        res.status(200);
        res.send('OK');
    } catch(err) {
        console.error(err);
        res.status(400);
        res.send('Error');
    }
})

export default router;