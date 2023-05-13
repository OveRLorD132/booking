import pgk from 'pg';

let { Client } = pgk;

export default async () => {
    let client = new Client({user: 'postgres', password: 'password', database: 'booking'})
    await client.connect();
    return client;
}