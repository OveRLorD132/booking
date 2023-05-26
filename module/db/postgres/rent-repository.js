import pgk from 'pg';

let { Client } = pgk;

export default class RentRepostitory {
    constructor() {
        this.client = new Client({user: 'postgres', password: 'password', database: 'booking'})
        this.client.connect();
    }
    addRent(rentalObject) {
        let keys = Object.keys(rentalObject);
        let values = Object.values(rentalObject);
        let placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
        let query = `INSERT INTO rental_properties (${keys.join(", ")}) VALUES (${placeholders}) RETURNING id`;
        return new Promise((resolve, reject) => {
            this.client.query(query, values, (err, result) => {
                if(err) reject(err);
                else resolve(result.rows[0]);
            })
        })
    }
    loadList() {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT * FROM rental_properties`, [], (err, result) => {
                if(err) reject(err);
                resolve(result);
            })
        })
    }
    getRentById(id) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT * FROM rental_properties WHERE id = $1`, [id], (err, result) => {
                if(err) reject(err);
                resolve(result.rows[0]);
            })
        })
    }
    calculateRating(avg_rating, id) {
        return new Promise((resolve, reject) => {
            this.client.query(`UPDATE rental_properties SET rating = $1 WHERE id = $2`, [avg_rating, id], (err, result) => {
                if(err) reject(err);
                resolve(result);
            })
        })
    }
    async getWishlist(wishlist) {
        if(!wishlist) return [];
        let result = [];
        for(let wish_id of wishlist) {
            result.push(await this.getRentById(wish_id));
        }
        return result;
    }
    getWish(id) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT id AS id, user_name, header, price, user_id FROM rental_properties WHERE id = $1`, [id], (err, result) => {
                console.log(result);
                if(err) reject(err);
                else resolve(result.rows[0]);
            })
        })
    }
    async getShortWishlist(wishlist) {
        let wishArray = [];
        for(let wish of wishlist) {
            wishArray.push(await this.getWish(wish));
        }
        return wishArray;
    }
}