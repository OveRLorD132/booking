import createHttpError  from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createServer } from 'https';

import { sessionMiddleware } from './module/authentication/session.js';

import postgresConnect from './module/db/postgres/postgres-connect.js';

import fs from 'fs';

postgresConnect();

import authRoute from './routes/auth-route.js';
import mainRouter from './routes/main.js';
import usersRouter from './routes/users.js';
import setupRouter from './routes/setup-data.js';
import rentRouter from './routes/rent-route.js';
import RentAddRouter from './routes/rent-add.js';
import profileRouter from './routes/profile-route.js'; 
import complainsRouter from './routes/complains.js';
import conversationsRouter from './routes/conversations.js';
import publicProfileRouter from './routes/public-profile.js';
import passwordChangeRouter from './routes/password-change.js';

let app = express();

let server = createServer({
  key: fs.readFileSync('./https-keys/key.pem'),
  cert: fs.readFileSync('./https-keys/cert.pem')
},app).listen(3000);

export default server;

import socketConnect from './module/sockets/setup.js';

socketConnect();

// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '40mb'}));
app.use(express.urlencoded({ limit: '40mb',extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

sessionMiddleware(app);

app.use(mainRouter);
app.use(authRoute);
app.use(setupRouter);
app.use(rentRouter);
app.use(RentAddRouter);
app.use(profileRouter);
app.use(conversationsRouter);
app.use(complainsRouter);
app.use(publicProfileRouter);
app.use(passwordChangeRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if(err.message === 'Not Found') res.render('Error404');
  else res.render('Error500');
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

