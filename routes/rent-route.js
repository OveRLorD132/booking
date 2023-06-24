import { Router } from "express";

import Rent from "../module/db/postgres/Rent.js";

import rentUserCheck from "../module/middlewares/rent-user-check.js";

import validator from '../module/rent-change/rent-validation.js';

import rentChange from "../module/rent-change/rent-change.js";

import authCheck from '../module/middlewares/auth-check.js';

import StaticPhotos from "../module/serve-static/rent-photos.js";

let staticPhotos = new StaticPhotos();

import Complains from "../module/db/postgres/Complains.js";

let complains = new Complains();

import complainUserCheck from "../module/middlewares/complain-user-check.js";

let rent = new Rent();

let router = Router();

router.get('/booking/rent/:rentId', async(req, res) => {
    res.render('rent');
})

router.get('/booking/rent/:rentId/rent', async(req, res) => {
    try {
        let result = await rent.getRentById(req.params.rentId);
        res.send(result);
    } catch(err) {
        console.error(err);
    }
})

router.patch('/rent/change-coords', authCheck.authCheckClient, rentUserCheck, async(req, res) => {
    let { coords, rent_id } = req.body;
    try {
        await rent.changeCoords(coords, rent_id);
        res.status(200);
        res.send(coords);
    } catch(err) {
        res.status(500);
        res.send('Error');
    }
})

router.patch('/rent/change-images', authCheck.authCheckClient, rentUserCheck, async(req, res) => {
    let { images, rent_id } = req.body;
    await staticPhotos.changePhotos(images, rent_id);
    res.status(200);
    res.send(images);
})

router.patch('/rent/change-properties', authCheck.authCheckClient, rentUserCheck, async(req, res) => {
    let { addressLine, description, header, price, type} = req.body;
    try {
        validator.validateAddress(addressLine);
    } catch(err) {
        req.flash('error', err);
        addressLine = "";
    }
    try {
        validator.validateDescription(description);
    } catch(err) {
        req.flash('error', err);
        description = "";
    }
    try {
        validator.validateHeader(header);
    } catch(err) {
        req.flash('error', err);
        header = "";
    }
    try {
        validator.validatePrice(price);
    } catch(err) {
        req.flash('error', err);
        price = "";
    }
    try {
        validator.validateType(type);
    } catch(err) {
        req.flash('error', err);
        type = "";
    }
    let doneObj = {};
    try {
        await rentChange({addressLine, description, header, price, type}, req.body.rent_id, doneObj);
        res.status(200);
        res.send(doneObj);
        req.flash('success', 'Change successful.');
        return;
    } catch(err) {
        if(err.message === 'Invalid input.') {
            req.flash('error', err.message);
        } else {
            req.flash('error', `Something's went wrong. Bad request.`);
        }
        res.status(500);
        res.send(doneObj);
    }

})

router.post('/rent/new-complain', authCheck.authCheckClient, complainUserCheck, async(req, res) => {
    try {
        await complains.addComplain(req.body.id, req.user.id, req.body.reason, req.body.text);
        res.status(200);
        req.flash('success', 'Complaint added successfully');
        res.send('Success');
    } catch(err) {
        res.status(400);
        req.flash('error', 'Internal server error');
        res.send('Error');
    }
})

export default router;