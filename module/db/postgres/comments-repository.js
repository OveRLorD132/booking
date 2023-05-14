import pgk from 'pg';

let { Client } = pgk;

import RentRepository from './rent-repository.js';

let rentRepository = new RentRepository();

export default class CommentsRepository {
    constructor() {
        this.client = new Client({user: 'postgres', password: 'password', database: 'booking'})
        this.client.connect();
    }
    addComment(obj) {
        let keys = Object.keys(obj);
        let values = Object.values(obj);
        let placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
        let query = `INSERT INTO comments (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
        return new Promise((resolve, reject) => {
            this.client.query(query, values, async (err, result) => {
                if(err) reject(err);
                await rentRepository.calculateRating(await this.getRentRating(obj.rent_id), obj.rent_id);
                resolve(result.rows[0]);
            })
        })
    }
    loadComments(id) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT * FROM comments WHERE rent_id = $1`, [id], (err, result) => {
                if(err) reject(err);
                resolve(result.rows);
            })
        })
    }
    getRentRating(rent_id) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT AVG(rating) AS avg_rating FROM comments WHERE rent_id = $1`, [rent_id], (err, result) => {
                if(err) reject(err);
                resolve(result.rows[0].avg_rating);
            })
        })
    }
}