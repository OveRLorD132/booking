import { Router } from "express";

import Rent from "../module/db/postgres/Rent.js";

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

export default router;