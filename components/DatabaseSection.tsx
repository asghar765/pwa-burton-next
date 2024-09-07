     // DatabaseSection.tsx
import React, { useState, useEffect } from 'react';
import { Pool } from 'pg';

interface TableInfo {
  table_name: string;
  row_count: string;
}

const DatabaseSection: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });

        const client = await pool.connect();
        const result = await client.query(`
          SELECT 
            table_name,
            (SELECT COUNT(*) FROM ${table_name}) AS row_count
          FROM 
            information_schema.tables
          WHERE 
            table_schema = 'public'
        `);

        setTables(result.rows);
        client.release();
      } catch (err) {
        console.error('Error fetching table information:', err);
        setError('Failed to fetch database information');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Database Tools</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Loading database information...</p>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-2">Database Tables</h3>
          {tables.length > 0 ? (
            <ul className="space-y-2">
              {tables.map((table) => (
                <li key={table.table_name} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{table.table_name}</span>
                  <span className="text-sm text-gray-600">{table.row_count} rows</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tables found in the database.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseSection;
