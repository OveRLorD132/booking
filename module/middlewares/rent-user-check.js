import Rent from "../db/postgres/Rent.js";

let rent = new Rent();

export default async function(req, res, next) {
  if(!req.body.rent_id) {
    res.status(401);
    res.send('Error');
    return;
  }
  let rentUserId = await rent.getRentUser(req.body.rent_id);
  if(rentUserId.user_id == req.user.id) {
    return next();
  }
  else {
    res.status(401);
    res.send('Error');
    return;
  }
}