import { Router } from "express";

let router = Router();

import Rent from "../module/db/postgres/Rent.js";

let rent = new Rent();

import StaticPhotos from "../module/serve-static/rent-photos.js";
import authCheck from "../module/middlewares/auth-check.js";

import rentValidation from "../module/rent-change/rent-validation.js";

let staticPhotos = new StaticPhotos();

router.get('/become-a-host', authCheck.authCheckBrowser, (req, res) => {
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

router.post('/new-rent', authCheck.authCheckClient, async(req, res) => {
    if(req.user && req.body.user.id === req.user.id) {
        let photos = req.body.rent.images;
        let { address, description, type, header, price } = req.body.rent;
        try {
            rentValidation.validateCountry(address.country);
            rentValidation.validateAddress(address.addressLine);
            rentValidation.validateCity(address.city);
            rentValidation.validateIndex(address.index);
            rentValidation.validateDescription(description);
            rentValidation.validateType(type);
            rentValidation.validateHeader(header);
            rentValidation.validatePrice(price);
        } catch(err) {
            res.status(400);
            req.flash('error', err);
            res.send('Bad Request');
            return;
        }
        for(let photo of photos) {
            let strings = photo.src.split(',');
            let extension
            switch (strings[0]) {
                case "data:image/jpeg;base64":
                    extension = "jpeg";
                    break;
                case "data:image/png;base64":
                    extension = "png";
                    break;
                case 'data:image/webp;base64':
                    extension = "webp";
                default:
                    extension = "other";
                    break;
            }
            if(extension === 'other') {
                res.status(400);
                req.flash('error', 'Invalid File Format');
                res.send('Bad Request');
                return;
            }
        }
        let user_id = req.body.user.id;
        address = JSON.stringify(address);
        let isHidden = false;
        if(req.user.type === 'Guest') isHidden = true;
        let id = await rent.addRent({  address, description, type, header, price, user_id, is_hidden: isHidden });

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