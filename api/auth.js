const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        return res.status(200).json({ status: "Database connected successfully!", time: result.rows[0].now });
    } catch (error) {
        return res.status(500).json({ error: "Database connection failed" });
    }
}