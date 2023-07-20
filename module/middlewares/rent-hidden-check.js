import Rent from "../db/postgres/Rent.js";

let rent = new Rent();

export default async function(req, res, next) {
  try {
    let ad = await rent.getRentById(req.params.rentId);
    if(req.user && ad.user_id == req.user.id) next();
    else if(!ad.is_hidden) next();
    else {
      res.redirect('/');
    }
  } catch(err) {
    res.redirect('/');
  }
}