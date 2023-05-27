import pgk from 'pg';

let { Client } = pgk;

import Rent from './Rent.js';

let rent = new Rent();

export default class CommentsRepository {
    constructor() {
        this.client = new Client({user: 'postgres', password: 'password', database: 'booking'})
        this.client.connect();
    }
    addComment(obj) {
        delete obj.first_name;
        let keys = Object.keys(obj);
        let values = Object.values(obj);
        let placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
        let query = `INSERT INTO comments (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
        return new Promise((resolve, reject) => {
            this.client.query(query, values, async (err, result) => {
                if(err) reject(err);
                let comment = result.rows[0];
                resolve(comment);
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
    editComment({text, id, rating, rent_id}) {
        return new Promise((resolve, reject) => {
            this.client.query(`UPDATE comments SET text = $1, rating = $3 WHERE id = $2`, [text, id, rating], async (err, result) => {
                if(err) reject(err);
                let rating = await this.getRentRating(rent_id);
                await rent.calculateRating(rating, rent_id);
                resolve(rating);
            })
        })
    }
    deleteComment(id, rent_id) {
        return new Promise((resolve, reject) => {
            this.client.query(`DELETE FROM comments WHERE id = $1`, [id], async (err, result) => {
                if(err) reject(err);
                let rating = await this.getRentRating(rent_id);
                await rent.calculateRating(rating, rent_id);
                resolve(rating);
            })
        })
    }
}