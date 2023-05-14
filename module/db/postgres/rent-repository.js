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
        console.log([keys, values, placeholders]);
        let query = `INSERT INTO rental_properties (${keys.join(", ")}) VALUES (${placeholders})`;
        return new Promise((resolve, reject) => {
            this.client.query(query, values, (err, result) => {
                if(err) reject(err);
                resolve(result);
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
                resolve(result);
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
}