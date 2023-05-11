import passport from "./passport-config.js";
import session from "express-session";
import flash from 'connect-flash';

export function sessionMiddleware(app) {
    app.use(session({
        secret: 'some secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60 * 60 * 1000}
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
}