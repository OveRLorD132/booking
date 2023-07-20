import UserRepostitory from "../db/postgres/Users.js";

let userRepostitory = new UserRepostitory();

import bcrypt from 'bcrypt';

export default async function login(username, password, done) {
    try {
        let user = await userRepostitory.getByUsername(username);
        if(!user) return done(0, false, { message: `This user doesn't exist`}) 
        try {
            let match = await bcrypt.compare(password, user.password);
            if(!match) return done(0, false, {message: 'Incorrect password'});
            if(match) {
                delete user.password;
                return done(0, user);
            }
        } catch(err) {
            return done(err);
        }
    } catch(err) {
        return done(0, false, {message: `Internal server error`});
    }
}