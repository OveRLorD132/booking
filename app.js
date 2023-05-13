import createHttpError  from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { createServer } from 'http';

import { sessionMiddleware } from './module/authentication/session.js';

import authRoute from './routes/auth-route.js';
import mainRouter from './routes/main.js';
import usersRouter from './routes/users.js';
import setupRouter from './routes/setup-data.js';
import rentRouter from './routes/rent-route.js';

let app = express();

let server = createServer(app).listen(3000);

export default server;

import socketConnect from './module/sockets/setup.js';

socketConnect();

// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

sessionMiddleware(app);

app.use(mainRouter);
app.use(authRoute);
app.use(setupRouter);
app.use(rentRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

