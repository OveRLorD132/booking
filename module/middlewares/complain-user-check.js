import Rent from '../db/postgres/Rent.js';

let rent = new Rent();

export default async function(req, res, next) {
  if(!req.body.id) {
    res.status(401);
    req.flash('error', 'Invalid input');
    res.send('Error');
    return;
  }
  let rentId = await rent.getRentById(req.body.id);
  if(req.user.id != rentId) {
    return next();
  } else {
    res.status(401);
    req.flash('error', `You can't complain to own ad`);
    res.send('Error');
    return;
  }
}