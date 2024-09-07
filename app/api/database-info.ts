import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      const client = await pool.connect();
      const result = await client.query(`
        SELECT 
          table_name,
          (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name)::text AS row_count
        FROM 
          information_schema.tables t
        WHERE 
          table_schema = 'public'
      `);

      client.release();

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching table information:', error);
      res.status(500).json({ error: 'Failed to fetch database information' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
