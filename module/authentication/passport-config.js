import passport from "passport";
import { Strategy } from 'passport-local'; 

import UserRepostitory from "../db/postgres/Users.js";

let userRepostitory = new UserRepostitory();

import login from "./login.js";

passport.use(new Strategy((username, password, done) => {
    login(username, password, done);
}));

passport.serializeUser(({ id }, done) => {
    console.log(id);
    done(0, id);
});

passport.deserializeUser(async(id, done) => {
    let user = await userRepostitory.getById(id);
    done(0, user);
})

export default passport;