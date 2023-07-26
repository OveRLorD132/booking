export default class Rent {
  addRent(object) {
    let keys = Object.keys(object);
    let values = Object.values(object);
    let placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    let query = `INSERT INTO rental_properties (${keys.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING id`;
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(query, values, (err, result) => {
        if (err) reject(err);
        else resolve(result.rows[0]);
      });
    });
  }
  loadList() {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
        `SELECT users.username AS user_name, rental_properties.* FROM users 
        INNER JOIN rental_properties ON users.id = rental_properties.user_id
        WHERE is_hidden = false`,
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
      globalThis.DbClient.query(
        `SELECT users.first_name AS first_name, users.description AS user_description, users.join_date as join_date, rental_properties.*, 
        COALESCE((SELECT AVG(rating) FROM comments WHERE rent_id = $1), 5) AS rating 
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
      globalThis.DbClient.query(
        `SELECT rental_properties.*, users.first_name FROM rental_properties 
        INNER JOIN users ON rental_properties.user_id = users.id
        WHERE rental_properties.id = $1`,
        [id],
        (err, result) => {
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
    return wishArray.filter((elem) => !elem.is_hidden);
  }
  getRentUser(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(
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
      globalThis.DbClient.query(
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
      globalThis.DbClient.query(
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
      globalThis.DbClient.query(
        `SELECT address FROM rental_properties WHERE id = $1`,
        [id],
        (err, result) => {
          if (err) reject(err);
          else {
            let address = result.rows[0].address;
            address = JSON.parse(address);
            address.coords = coords;
            globalThis.DbClient.query(
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
  getAds(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`SELECT * FROM rental_properties WHERE user_id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows);
      })
    })
  }
  getVisibleAds(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`SELECT * FROM rental_properties WHERE user_id = $1 AND is_hidden = false`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result.rows)
      })
    })
  }
  hideRent(id, isHidden) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`UPDATE rental_properties SET is_hidden = $1 WHERE id = $2`, [isHidden, id], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
  hideUserRent(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`UPDATE rental_properties SET is_hidden = true WHERE user_id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(result);
      })
    })
  }
  getCoords(id) {
    return new Promise((resolve, reject) => {
      globalThis.DbClient.query(`SELECT address FROM rental_properties WHERE id = $1`, [id], (err, result) => {
        if(err) reject(err);
        else resolve(JSON.parse(result.rows[0].address).coords);
      })
    })
  }
}
