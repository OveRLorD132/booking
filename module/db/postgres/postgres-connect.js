import pgk from 'pg';

let { Pool } = pgk;

export default function() {
    globalThis.DbClient = new Pool({user: 'postgres', password: 'password', host: 'localhost', port: 5432, database: 'booking'})
    globalThis.DbClient.connect();
}