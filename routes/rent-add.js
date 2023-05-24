import { Router } from "express";

let router = Router();

import RentRepostitory from "../module/db/postgres/rent-repository.js";

let rentRepository = new RentRepostitory();

import StaticPhotos from "../module/serve-static/rent-photos.js";

let staticPhotos = new StaticPhotos();

router.get('/become-a-host', (req, res) => {
    res.render('AddRent');
})

router.post('/new-rent', async(req, res) => {
    if(req.user && req.body.user.id === req.user.id) {
        let photos = req.body.rent.images;
        let { address, description, type, header, price } = req.body.rent;
        let user_id = req.body.user.id;
        let user_name = req.body.user.name;
        address = JSON.stringify(address);
        let id = await rentRepository.addRent({  address, description, type, header, price, user_id, user_name, images_count: photos.length-1 });
        let filename;
        for(let i = 0; i < photos.length; i++) {
            let photo = photos[i];
            let directoryInfo = {rent_id: id, user_name: user_name, user_id: user_id};
            if(photo.isMain) filename = 'Main.png';
            else filename = `${i}.png`;
            await  staticPhotos.addPhoto(photo.src, filename, directoryInfo);
        }
        res.status(200);
        res.send(id.id);
    } else {
        res.status(500);
        res.send('Error');
    }
})

export default router;