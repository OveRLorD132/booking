import { Router } from "express";

let router = Router();

router.get('/booking/user-profile', async(req, res) => {
    console.log(req);
    res.send(req.user);
})

export default router;