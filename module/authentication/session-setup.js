import expressSession from 'express-session';

export default expressSession({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000}
});