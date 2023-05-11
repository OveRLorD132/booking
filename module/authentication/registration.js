import Password from "../Password/Password.js";
import Postgres from "../db/postgresql.js";

export default async function registration(user) {
    try {
        let hash = await Password.prototype.hash(user.password); 
        let res = await Postgres.prototype.createProfile(user.username, hash, user.email);
        return res;
    } catch(err) {
        throw err;
    }
}