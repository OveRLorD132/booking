import pgk from "pg";

let { Client } = pgk;

export default class Rent {
  constructor() {
    this.client = new Client({
      user: "postgres",
      password: "password",
      database: "booking",
    });
    this.client.connect();
  }
  addRent(object) {
    let keys = Object.keys(object);
    let values = Object.values(object);
    let placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    let query = `INSERT INTO rental_properties (${keys.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING id`;
    return new Promise((resolve, reject) => {
      this.client.query(query, values, (err, result) => {
        if (err) reject(err);
        else resolve(result.rows[0]);
      });
    });
  }
  loadList() {
    return new Promise((resolve, reject) => {
      this.client.query(
        `SELECT users.username AS user_name, rental_properties.* FROM users 
        INNER JOIN rental_properties ON users.id = rental_properties.user_id`,
        [],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
  getRentById(id) {
    return new Promise((resolve, reject) => {
      this.client.query(
        `SELECT users.first_name AS first_name, rental_properties.*, COALESCE((SELECT AVG(rating) 
        FROM comments WHERE rent_id = $1), 5) AS rating 
        FROM users
        INNER JOIN rental_properties ON users.id = rental_properties.user_id WHERE rental_properties.id = $1`,
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rows[0]);
        }
      );
    });
  }
  async getWishlist(wishlist) {
    if (!wishlist) return [];
    let result = [];
    for (let wish_id of wishlist) {
      result.push(await this.getRentById(wish_id));
    }
    return result;
  }
  getWish(id) {
    return new Promise((resolve, reject) => {
      this.client.query(
        `SELECT rental_properties.*, users.first_name FROM rental_properties 
        INNER JOIN users ON rental_properties.user_id = users.id
        WHERE rental_properties.id = $1`,
        [id],
        (err, result) => {
          console.log(result);
          if (err) reject(err);
          else resolve(result.rows[0]);
        }
      );
    });
  }
  async getShortWishlist(wishlist) {
    let wishArray = [];
    for (let wish of wishlist) {
      wishArray.push(await this.getWish(wish));
    }
    return wishArray;
  }
  getRentUser(id) {
    return new Promise((resolve, reject) => {
      this.client.query(
        `SELECT user_id FROM rental_properties WHERE id = $1`,
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.rows[0]);
        }
      );
    });
  }
  changeRentProperty(propertyName, propertyValue, id) {
    return new Promise((resolve, reject) => {
      this.client.query(
        `UPDATE rental_properties SET ${propertyName} = $1 WHERE id = $2`,
        [propertyValue, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(propertyValue);
        }
      );
    });
  }
  changeAddressLine(id, addressLine) {
    return new Promise((resolve, reject) => {
      this.client.query(
        `SELECT address FROM rental_properties WHERE id = $1`,
        [id],
        (err, result) => {
          if (err) reject(err);
          else {
            let address = result.rows[0].address;
            address = JSON.parse(address);
            address.addressLine = addressLine;
            this.client.query(
              `UPDATE rental_properties SET address = $1 WHERE id = $2`,
              [address, id],
              (err, result) => {
                if (err) reject(err);
                else resolve(addressLine);
              }
            );
          }
        }
      );
    });
  }
  changeCoords(coords, id) {
    return new Promise((resolve, reject) => {
      this.client.query(
        `SELECT address FROM rental_properties WHERE id = $1`,
        [id],
        (err, result) => {
          if (err) reject(err);
          else {
            let address = result.rows[0].address;
            address = JSON.parse(address);
            address.coords = coords;
            this.client.query(
              `UPDATE rental_properties SET address = $1 WHERE id = $2`,
              [address, id],
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            );
          }
        }
      );
    });
  }
  checkUsernameUnique(username) {
    return new Promise((resolve, reject) => {
      this.client.query(`SELECT username FROM users WHERE username = $1`, [username], (err, result) => {
        if(err) reject(err);
        else resolve(result.rowCount);
      })
    })
  }
  checkEmailUnique(email) {
    return new Promise((resolve, reject) => {
      this.client.query(`SELECT email FROM users WHERE email = $1`, [email], (err, result) => {
        if(err) reject(err);
        else resolve(result.rowCount);
      })
    })
  }
}
