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
import rentHiddenCheck from "../module/middlewares/rent-hidden-check.js";
import commentUserCheck from "../module/middlewares/comment-user-check.js";

import Comments from "../module/db/postgres/Comments.js";

let comments = new Comments();

let rent = new Rent();

let router = Router();

router.get('/booking/rent/:rentId', rentHiddenCheck, async(req, res) => {
    res.render('rent');
})

router.get('/booking/rent/:rentId/rent', async(req, res) => {
    try {
        let result = await rent.getRentById(req.params.rentId);
        if(req.user && req.user.id == result.user_id) res.send(result);
        else if(result.is_hidden) {
            res.status(403);
            res.send('Error! No Access');
        }
        else res.send(result);
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
    let { rent_id, address, description, header, price, type} = req.body;
    try {
        if(!address) {
            res.status(500);
            res.send('Error');
            return;
        }
        validator.validateAddress(address.addressLine);
        validator.validateCountry(address.country);
        validator.validateCity(address.city);
        validator.validateIndex(address.postIndex);
        validator.validateDescription(description);
        validator.validateHeader(header);
        validator.validatePrice(price);
        validator.validateType(type);
        let changeObj = {
            address: {
                addressLine: address.addressLine,
                country: address.country,
                city: address.city,
                postIndex: address.postIndex,
                coords: await rent.getCoords(req.body.rent_id) 
            },
            description,
            header,
            price,
            type
        }
        try {

            for(let key in changeObj) {
                await rent.changeRentProperty(key, changeObj[key], rent_id);
            }
            res.status(200);
            req.flash('success', 'Properties Changed Successfully');
            res.send(changeObj);
        } catch(err) {
            res.status(500);
            req.flash('error', 'Internal Server Error');
            res.send('Internal Server Error');
            return;
        }
    } catch(err) {
        res.status(400);
        req.flash('error', err);
        res.send('Validation Error');
        return;
    }

})

router.patch('/rent/comment/edit', authCheck.authCheckClient, commentUserCheck, async (req, res) => {
    try {
        try {
            if(!req.body.id || !req.body.text || !req.body.rating) throw new Error('Field is empty');
            if(req.body.text.length > 500) throw new Error('Comment is too long');
            if (!/^\d+(\.\d{1,2})?$/.test(req.body.rating)) throw new Error('Invalid format.');
            if(req.body.rating <= 0) throw new Error('Rating must be greater than zero');
            if(req.body.rating > 5) throw new Error('Too big num');
        } catch(err) {
            res.status(400);
            req.flash('error', err);
            res.send('Validation Error');
            return;
        }
        await comments.editComment(req.body.text, req.body.id, req.body.rating);
        res.status(200);
        req.flash('success', 'Comment edited successfully');
        res.send('Success');
    } catch(err) {
        res.status(500);
        req.flash('error', 'Internal server error');
        res.send('Error');
    }
})

router.patch('/rent/hide', authCheck.authCheckClient, rentUserCheck, async (req, res) => {
    try {
        if(req.user.type === 'Guest') {
            res.status(403);
            res.send('Error');
            return;
        }
        await rent.hideRent(req.body.rent_id, req.body.isHidden);
        res.status(200);
        res.send('Success');
    } catch(err) {
        res.status(400);
        req.flash('error', 'Internal server error');
        res.send('Error');
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

router.post('/rent/comment/new', authCheck.authCheckClient, async (req, res) => {
    try {
        try {
            if(!req.body.rent_id && !req.body.text && !req.body.rating) throw new Error('All fields must not be empty');
            if(req.body.text.length > 500) throw new Error('Comment is too long');
            if (!/^\d+(\.\d{1,2})?$/.test(req.body.rating)) throw new Error('Invalid format.');
            if(req.body.rating <= 0) throw new Error('Rating must be greater than zero');
            if(req.body.rating > 5) throw new Error('Too big num');
        } catch(err) {
            res.status(400);
            req.flash('error', err);
            res.send('Validation Error');
            return;
        }
        let id = await comments.addComment(req.body.rent_id, req.body.rating, req.body.text, req.user.id);
        let comment = await comments.getComment(id);
        res.status(200);
        req.flash('success', 'Comment added successfully');
        res.send(comment);
    } catch(err) {
        res.status(500);
        req.flash('error', 'Internal server error');
        res.send('Error');
    }
})

router.delete('/rent/comment/delete', authCheck.authCheckClient, commentUserCheck, async (req, res) => {
    try {
        await comments.deleteComment(req.body.id);
        res.status(200);
        req.flash('success', 'Comment deleted successfully');
        res.send('Success');
    } catch(err) {
        res.status(500);
        req.flash('error', 'Internal server error');
        res.send('Error');
    }
})

export default router;