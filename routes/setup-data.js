import { Router } from "express";

import Rent from "../module/db/postgres/Rent.js";

let rent = new Rent();

import StaticPhotos from "../module/serve-static/rent-photos.js";
import authCheck from "../module/middlewares/auth-check.js";

let staticPhotos = new StaticPhotos();
 
let router = Router();

router.get('/booking/user-profile', async(req, res) => {
    res.send(req.user);
})

router.get('/flash-messages', async(req, res) => {
    res.send(req.flash());
})

router.get('/photos-count/:id', async(req, res) => {
    let photos = await staticPhotos.getPhotos(req.params.id);
    if(!photos) {
        res.status(404).send('Error. No photos found.');
    } else res.send(String(photos.length));
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
    } else if(!req.user.wishlist) {
        res.send(null);
        return;
    }
    let result = await rent.getShortWishlist(req.user.wishlist);
    res.send(result);
})

router.get('/booking/your-ads', authCheck.authCheckClient, async (req, res) => {
    try {
        let ads = await rent.getAds(req.user.id);
        res.status(200);
        res.send(ads);
    } catch(err) {
        res.status(400);
        req.flash('error', '')
    }
})

export default router;