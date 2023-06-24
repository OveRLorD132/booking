function adminCheckBrowser(req, res, next) {
  if(req.user.id == 1) next();
  else res.redirect('/');
}

function adminCheckClient(req, res, next) {
  if(req.user.id == 1) next();
  else {
    res.status(403);
    res.send('Access Denied');
  } 
}

export default {
  adminCheckBrowser,
  adminCheckClient
}