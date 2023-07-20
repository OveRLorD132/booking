import pgk from 'pg';

let { Client } = pgk;

import Rent from './Rent.js';

let rent = new Rent();

export default class Comments {
    constructor() {
        this.client = new Client({user: 'postgres', password: 'password', database: 'booking'})
        this.client.connect();
    }
    addComment(rent_id, rating, text, user_id) {
        return new Promise((resolve, reject) => {
            let query = `INSERT INTO comments (rent_id, rating, text, user_id) VALUES ($1, $2, $3, $4) RETURNING id`;
            this.client.query(query, [rent_id, rating, text, user_id], (err, result) => {
                if(err) reject(err);
                else resolve(result.rows[0].id);
            })
        })
    }
    loadComments(id) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT comments.*, users.first_name FROM comments
            INNER JOIN users ON users.id = comments.user_id WHERE rent_id = $1`, [id], (err, result) => {
                if(err) reject(err);
                else resolve(result.rows);
            })
        })
    }
    editComment(text, id, rating) {
        return new Promise((resolve, reject) => {
            this.client.query(`UPDATE comments SET text = $1, rating = $3 WHERE id = $2`, [text, id, rating], async (err, result) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }
    deleteComment(id) {
        return new Promise((resolve, reject) => {
            this.client.query(`DELETE FROM comments WHERE id = $1`, [id], async (err, result) => {
                if(err) reject(err);
                else resolve();
            })
        })
    }
    getComment(id) {
        return new Promise((resolve, reject) => {
            this.client.query(`SELECT comments.*, users.first_name FROM comments INNER JOIN users
            ON users.id = comments.user_id WHERE comments.id = $1`, [id], (err, result) => {
                if(err) reject(err);
                else resolve(result.rows[0]);
            })
        })
    }
}