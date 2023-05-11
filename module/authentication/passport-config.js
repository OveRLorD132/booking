import passport from "passport";
import { Strategy } from 'passport-local'; 

import login from "./login.js";

passport.use(new Strategy((username, password, done) => {
    login(username, password, done);
}));

passport.serializeUser((user, done) => {
    delete user.password;
    done(0, user);
});

passport.deserializeUser((user, done) => {
    done(0, user);
})

export default passport;