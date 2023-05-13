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
    createProfile(username, password, email) {
        return new Promise((resolve, reject) => {
            this.client.query(`INSERT INTO users (username, password, email) VALUES ($1, $2, $3)`, [username, password, email], (err, res) => {
                if(err) reject(err);
                resolve(res);
            })
        });
    }
}