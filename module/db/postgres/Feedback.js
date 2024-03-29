export default class {
  addComment(user_id, profile_id, text) {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO user_feedback (user_id, profile_id, text) VALUES ($1, $2, $3) RETURNING id`
      globalThis.DbClient.query(query, [user_id, profile_id, text], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0].id);
      })
    })
  }
  getComment(id) {
    return new Promise((resolve, reject) => {
      let query = `SELECT user_feedback.*, users.first_name FROM user_feedback 
      INNER JOIN users ON user_feedback.user_id = users.id
      WHERE user_feedback.id = $1`;
      globalThis.DbClient.query(query, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0]);
      })
    })
  }
  loadComments(id) {
    return new Promise((resolve, reject) => {
      let query = `SELECT user_feedback.*, u1.first_name FROM user_feedback
      INNER JOIN users u1 ON u1.id = user_feedback.user_id WHERE user_feedback.profile_id = $1`;
      globalThis.DbClient.query(query, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows);
      })
    })
  }
  editComment(text, id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`UPDATE user_feedback SET text = $1 WHERE id = $2`, [text, id], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
  deleteComment(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`DELETE FROM user_feedback WHERE id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
}
