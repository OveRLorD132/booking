import Password from "../Password/Password.js";
import UserRepostitory from "../db/postgres/Users.js";

let userRepostitory = new UserRepostitory();

export default async function registration(user) {
    try {
        let hash = await Password.prototype.hash(user.password); 
        user.password = hash;
        let res = await userRepostitory.createProfile(user);
        delete res.password;
        return res;
    } catch(err) {
        throw err;
    }
}