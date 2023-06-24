import pgk from "pg";

let { Client } = pgk;

export default class {
  constructor() {
    this.client = new Client({
      user: "postgres",
      password: "password",
      database: "booking",
    });
    this.client.connect();
  }
  addMessage(text, user_id, conversation_id) {
    return new Promise((resolve, reject) => {
      this.client.query(`INSERT INTO messages (user_id, conversation_id, text) 
      VALUES ($1, $2, $3) RETURNING *`, 
      [user_id, conversation_id, text], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0]);
      })
    })
  }
  loadMessages(id) {
    return new Promise((resolve, reject) => {
      this.client.query(`SELECT messages.*, users.first_name FROM messages 
      INNER JOIN users ON users.id = messages.user_id WHERE conversation_id = $1`,
      [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows);
      })
    })
  }
  getMessage(id) {
    return new Promise((resolve, reject) => {
      this.client.query(`SELECT user_id FROM messages WHERE id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0].user_id)
      })
    })
  }
  editMessage(id, text) {
    return new Promise((resolve, reject) => {
      this.client.query(`UPDATE messages SET text = $1 WHERE id = $2`, [text, id], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
}
