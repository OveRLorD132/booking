import { Router } from "express";

let router = Router();

router.get('/become-a-host', (req, res) => {
    res.render('AddRent');
})

export default router;