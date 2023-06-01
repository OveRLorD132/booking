function authCheckBrowser(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else res.redirect('/login');
}

function authCheckClient(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.status(403);
    res.send('Error');
  };
}

export default {
  authCheckBrowser,
  authCheckClient
} 