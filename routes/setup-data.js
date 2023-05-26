import { Router } from "express";

import RentRepostitory from "../module/db/postgres/rent-repository.js";

let rentRepository = new RentRepostitory();

let router = Router();

router.get('/booking/user-profile', async(req, res) => {
    console.log(req);
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
    let result = await rentRepository.getWishlist(req.user.wishlist);
    res.send(result);
})

router.get('/short-wishlist', async(req, res) => {
    if(!req.user) {
        res.status(500);
        res.send('Error');
        return;
    } 
    let result = await rentRepository.getShortWishlist(req.user.wishlist);
    res.send(result);
})

export default router;