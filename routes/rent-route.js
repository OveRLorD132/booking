import { Router } from "express";

import RentRepostitory from "../module/db/postgres/rent-repository.js";

let rentRepository = new RentRepostitory();

let router = Router();

router.get('/booking/rent/:rentId', async(req, res) => {
    console.log(req.params.rentId);
    res.render('rent');
})

router.get('/booking/rent/:rentId/rent', async(req, res) => {
    try {
        let result = await rentRepository.getRentById(req.params.rentId);
        res.send(result);
    } catch(err) {
        console.error(err);
    }
})

export default router;