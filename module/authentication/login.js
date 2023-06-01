import UserRepostitory from "../db/postgres/Users.js";

let userRepostitory = new UserRepostitory();

import Password from "../Password/Password.js";

export default async function login(username, password, done) {
    try {
        let user = await userRepostitory.getByUsername(username);
        console.log(user);
        try {
            console.log(password);
            let match = Password.prototype.comparePassword(password, user.password);
            if(!match) return done(0, false, {message: 'Incorrect password.'});
            if(match) {
                delete user.password;
                return done(0, user);
            }
        } catch(err) {
            return done(err);
        }
    } catch(err) {
        return done(0, false, {message: `This user doesn't exist.`});
    }
}