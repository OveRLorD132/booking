export default class Users {
  getById(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        `SELECT * FROM users WHERE id = $1`,
        [id],
        (err, result) => {
          if (err) reject(err);
          resolve(result.rows[0]);
        }
      );
    });
  }
  getByUsername(username) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        `SELECT * FROM users WHERE username = $1`,
        [username],
        (err, result) => {
          if (err) reject(err);
          resolve(result.rows[0]);
        }
      );
    });
  }
  createProfile(obj) {
    let query = `INSERT INTO users 
        (username, first_name, last_name, email, password, gender,
        phone_number, birth_date, type, country, description) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, type`;
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        query,
        [
          obj.username,
          obj.first_name,
          obj.last_name,
          obj.email,
          obj.password,
          obj.gender,
          obj.phone,
          obj.birth_date,
          obj.type,
          obj.country,
          obj.description,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rows[0]);
        }
      );
    });
  }
  addToWishlist(id, user_id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        `UPDATE users SET wishlist = wishlist || $1 WHERE id = $2`,
        [[id], user_id],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  removeFromWishlist(id, user_id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        `UPDATE users SET wishlist = array_remove(wishlist, $1) WHERE id = $2`,
        [+id, user_id],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  changeUserProperty(name, value, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE users SET ${name} = $1 WHERE id = $2`;
      globalThis.DbClient.query(query, [value, id], (err, result) => {
        if (err) reject(err);
        else resolve(result.rowCount);
      });
    });
  }
  checkUsernameUnique(username) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        `SELECT username FROM users WHERE username = $1`,
        [username],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rowCount);
        }
      );
    });
  }
  checkEmailUnique(email) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        `SELECT email FROM users WHERE email = $1`,
        [email],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rowCount);
        }
      );
    });
  }
  getPublicProfile(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`SELECT id, first_name, join_date, type, description FROM users WHERE id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0]);
      })
    })
  }
  getPassword(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`SELECT password FROM users WHERE id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows[0].password);
      })
    })
  }
}