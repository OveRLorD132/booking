import express from 'express';
let router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/booking');
})

router.get('/main', (req, res) => {
    res.redirect('/booking');
})

router.get('/booking', (req, res) => {
    console.log(req);
    res.render('main');
})

export default router;