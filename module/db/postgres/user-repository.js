import pgk from "pg";

let { Client } = pgk;

export default class UserRepostitory {
    constructor() {
        this.client = new Client({user: 'postgres', password: 'password', database: 'booking'})
        this.client.connect();
    }
    getById(id) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT * FROM users WHERE id = $1`, [id], (err, result) => {
                if(err) reject(err);
                console.log(result);
                resolve(result.rows[0]);
            })
        })
    }
    getByUsername(username) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT * FROM users WHERE username = $1`, [username], (err, result) => {
                if(err) reject(err);
                resolve(result.rows[0]);
            })
        })
    }
    createProfile(obj) {
        let values = Object.values(obj);
        let keys = Object.keys(obj);
        let query = `INSERT INTO users (${keys.join(", ")}) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        return new Promise((resolve, reject) => {
            this.client.query(query, values, (err, result) => {
                if(err) reject(err);
                else resolve(result.rows[0]);
            })
        });
    }
    addToWishlist(id, user_id) {
        return new Promise((resolve, reject) => {
            this.client.query(`UPDATE users SET wishlist = wishlist || $1 WHERE id = $2`, [[id], user_id], (err, result) => {
                if(err) reject(err);
                resolve(result);
            })
        })
    }
    removeFromWishlist(id, user_id) {
        return new Promise((resolve, reject) => {
            this.client.query(`UPDATE users SET wishlist = array_remove(wishlist, $1) WHERE id = $2`, [+id, user_id], (err, result) => {
                if(err) reject(err);
                resolve(result);
            })
        })
    }
}