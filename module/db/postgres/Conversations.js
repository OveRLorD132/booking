export default class {
  checkConversation(id1, id2) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM conversations WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`;
      globalThis.DbClient.query(query, [id1, id2], (err, result) => {
        if(err) reject(err);
        else resolve(result.rowCount);
      })
    })
  }
  createConversation(id1, id2) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`INSERT INTO conversations (user1_id, user2_id) 
      VALUES ($1, $2) RETURNING id`, 
      [id1, id2], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0].id);
      })
    })
  }
  getConversationById(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`SELECT conversations.*, u1.first_name AS user1_name, u2.first_name AS user2_name 
      FROM conversations 
      INNER JOIN users u1 ON u1.id = conversations.user1_id
      INNER JOIN users u2 ON u2.id = conversations.user2_id
      WHERE conversations.id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0]);
      })
    })
  }
  getConversation(id1, id2) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`SELECT conversations.*, u1.first_name AS user1_name, u2.first_name AS user2_name  
      FROM conversations
      INNER JOIN users u1 ON u1.id = conversations.user1_id
      INNER JOIN users u2 ON u2.id = conversations.user2_id
      WHERE (user1_id = $1 AND user2_id = $2) 
      OR (user1_id = $2 AND user2_id = $1)`, [id1, id2], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0]);
      })
    })
  }
  loadConversations(id) {
    return new Promise((resolve, reject) => {
      let query = `SELECT conversations.*, u1.first_name AS user1_name, u2.first_name AS user2_name
      FROM conversations
      INNER JOIN users u1 ON u1.id = conversations.user1_id
      INNER JOIN users u2 ON u2.id = conversations.user2_id
      WHERE user1_id = $1 OR user2_id = $1`
      globalThis.DbClient.query(query, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows);
      })
    })
  }
  editConversationName(name, id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`UPDATE conversations SET name = $1 WHERE id = $2`, [name, id], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
}