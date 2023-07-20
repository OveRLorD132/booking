import { Redis } from "ioredis";

let redis = new Redis();

import pgk from "pg";

let { Client } = pgk;

let client = new Client({
  user: "postgres",
  password: "password",
  database: "booking",
});

client.connect();

export default class {
  async addNotification(user_id, header, text, type) {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT uuid_generate_v4() as id`,
        [],
        async (err, result) => {
          if (err) reject(err);
          else {
            await redis.hmset(
              `notifications:${user_id}:${result.rows[0].id}`,
              "header",
              header,
              "text",
              text,
              "type",
              type
            );
            await redis.expire(
              `notifications:${user_id}:${result.rows[0].id}`,
              5000
            );
            resolve(result.rows[0].id);
          }
        }
      );
    });
  }
  async getNotification(user_id, id) {
    try {
      return await redis.hgetall(`notifications:${user_id}:${id}`);
    } catch (err) {
      throw err;
    }
  }
  async getNotifications(user_id) {
    try {
      let notificationsList = await redis.keys(`notifications:${user_id}:*`);
      let notifications = [];
      for (let notification of notificationsList) {
        notifications.push(await redis.hgetall(notification));
      }
      return notifications;
    } catch (err) {
      throw err;
    }
  }
}
