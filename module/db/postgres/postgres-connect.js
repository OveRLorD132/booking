import pgk from 'pg';

let { Pool } = pgk;

export default function() {
    globalThis.DbClient = new Pool({user: 'postgres', password: 'password', database: 'booking'})
    globalThis.DbClient.connect();
}