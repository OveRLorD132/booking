import { Router } from "express";

import Rent from "../module/db/postgres/Rent.js";

let rent = new Rent();

let router = Router();

router.get('/booking/user-profile', async(req, res) => {
    res.send(req.user);
})

router.get('/flash-messages', async(req, res) => {
    res.send(req.flash());
})

router.get('/load-wishlist', async(req, res) => {
    if(!req.user) {
        res.status(500);
        res.send('Error');
        return;
    } 
    let result = await rent.getWishlist(req.user.wishlist);
    res.send(result);
})

router.get('/short-wishlist', async(req, res) => {
    if(!req.user) {
        res.status(500);
        res.send('Error');
        return;
    } 
    let result = await rent.getShortWishlist(req.user.wishlist);
    res.send(result);
})

export default router;