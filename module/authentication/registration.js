import Password from "../Password/Password.js";
import UserRepostitory from "../db/postgres/user-repository.js";

let userRepostitory = new UserRepostitory();

export default async function registration(user) {
    try {
        let hash = await Password.prototype.hash(user.password); 
        let res = await userRepostitory.createProfile(user.username, hash, user.email);
        return res;
    } catch(err) {
        throw err;
    }
}