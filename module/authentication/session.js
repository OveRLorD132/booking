import passport from "./passport-config.js";
import flash from 'connect-flash';

import sessionSetup from "./session-setup.js";

export function sessionMiddleware(app) {
    app.use(sessionSetup);
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
}