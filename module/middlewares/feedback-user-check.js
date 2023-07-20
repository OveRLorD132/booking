import Feedback from "../db/postgres/Feedback.js";

let feedback = new Feedback();

export default async function(req, res, next) {
  if(!req.body.id) {
    res.status(400);
    req.flash('error', 'Invalid Input');
    res.send('Invalid Input');
  } else {
    let comment = await feedback.getComment(req.body.id);
    if(comment.user_id != req.user.id || comment.profile_id != req.params.id) {
      res.status(401);
      req.flash('error', 'Access Denied');
      res.send('Access Denied');
    } else next();
  }
}