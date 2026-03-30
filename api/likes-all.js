import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const client = await pool.connect();

    try {
        const result = await client.query(
            'SELECT prompt_id, COUNT(*) as count FROM likes GROUP BY prompt_id'
        );

        const likesMap = {};
        for (const row of result.rows) {
            likesMap[row.prompt_id] = parseInt(row.count);
        }

        return res.status(200).json(likesMap);
    } finally {
        client.release();
    }
}
