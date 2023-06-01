import pgk from 'pg';

let { Client } = pgk;

import Rent from './Rent.js';

let rent = new Rent();

export default class Comments {
    constructor() {
        this.client = new Client({user: 'postgres', password: 'password', database: 'booking'})
        this.client.connect();
    }
    addComment(obj) {
        let keys = Object.keys(obj);
        let values = Object.values(obj);
        let placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
        let query = 
        `INSERT INTO comments (${keys.join(", ")}) VALUES (${placeholders}) RETURNING id`;
        return new Promise((resolve, reject) => {
            this.client.query(query, values, async (err, result) => {
                if(err) reject(err);
                else  {
                    let res = await this.getComment(result.rows[0].id);
                    resolve(res);
                }
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
    editComment({text, id, rating, rent_id}) {
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