import Comments from "../db/postgres/Comments.js";

let comments = new Comments();

export default async function(req, res, next) {
  try {
    let comment = await comments.getComment(req.body.id);
    if(comment.user_id == req.user.id) next();
    else {
      res.status(400);
      req.flash('error', 'Access Denied');
      res.send('Access Error');
    }
  } catch(err) {
    res.status(400);
    req.flash('error', 'Internal Server Error');
    res.send('Internal Server Error');
  }
}