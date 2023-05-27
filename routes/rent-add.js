import { Router } from "express";

let router = Router();

import Rent from "../module/db/postgres/Rent.js";

let rent = new Rent();

import StaticPhotos from "../module/serve-static/rent-photos.js";

let staticPhotos = new StaticPhotos();

router.get('/become-a-host', (req, res) => {
    res.render('AddRent');
})

router.get('/load-photos', async(req, res) => {
    try {
        let photos = await staticPhotos.getPhotos(req.query.id);
        res.status(200);
        res.send(photos);
    } catch(err) {
        console.error(err);
        res.status(500);
        res.send('Error');
    }
})

router.post('/new-rent', async(req, res) => {
    if(req.user && req.body.user.id === req.user.id) {
        let photos = req.body.rent.images;
        let { address, description, type, header, price } = req.body.rent;
        let user_id = req.body.user.id;
        let user_name = req.body.user.name;
        address = JSON.stringify(address);
        let id = await rent.addRent({  address, description, type, header, price, user_id, user_name, images_count: photos.length-1 });
        for(let i = 0; i < photos.length; i++) {
            let photo = photos[i];
            await staticPhotos.addPhoto(photo.src, `${i}.png`, id.id);
        }
        res.status(200);
        res.send(id.id);
    } else {
        res.status(500);
        res.send('Error');
    }
})

export default router;