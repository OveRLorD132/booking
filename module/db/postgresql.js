import pgk from "pg";
let { Client } = pgk;
let client = new Client({
    database: 'booking',
    user: 'postgres',
    password: 'password',
});
client.connect();

class Postgres {
    getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            client.query(`SELECT * FROM users WHERE username = $1`, [username], (err, result) => {
                if(err) reject(err);
                resolve(result.rows[0]);
            })
        })
    }
    createProfile(username, password, email) {
        return new Promise((resolve, reject) => {
            client.query(`INSERT INTO users (username, password, email) VALUES ($1, $2, $3)`, [username, password, email], (err, res) => {
                if(err) reject(err);
                resolve(res);
            })
        });
    }
}

export default Postgres;