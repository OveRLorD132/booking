import pgk from 'pg';

let { Client } = pgk;

export default class {
  constructor() {
    this.client = new Client({user: 'postgres', password: 'password', database: 'booking'})
    this.client.connect();
  }
  addComplain(rent_id, user_id, reason, text) {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO complains (rent_id, user_id, reason, text) VALUES ($1, $2, $3, $4)`;
      this.client.query(query, [rent_id, user_id, reason, text], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
  getComplains() {
    return new Promise((resolve, reject) => {
      let query = `SELECT complains.*, users.username AS username, rental_properties.header AS rent_header,
      rental_properties.user_id AS rent_user_id
      FROM complains INNER JOIN users ON users.id = complains.user_id
      INNER JOIN rental_properties ON rental_properties.id = complains.rent_id`
      this.client.query(query, [], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows);
      })
    })
  }
  deleteComplain(id) {
    return new Promise((resolve, reject) => {
      this.client.query(`DELETE FROM complains WHERE id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rowCount);
      })
    })
  }
  acceptComplain(id) {
    return new Promise((resolve, reject) => {
      this.client.query(`UPDATE complains SET is_accepted = $2 WHERE id = $1`, [id, true], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
}