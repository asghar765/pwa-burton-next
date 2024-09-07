     // DatabaseSection.tsx
import React, { useState, useEffect } from 'react';
import { connectToDatabase, executeQuery, DatabaseConnection } from '../utils/database';

interface TableInfo {
  table_name: string;
  row_count: number;
}

const DatabaseSection: React.FC = () => {
  const [connection, setConnection] = useState<DatabaseConnection | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const conn = await connectToDatabase();
        setConnection(conn);
        await fetchTables(conn);
      } catch (err) {
        setError('Failed to connect to the database');
        console.error(err);
      }
    };

    initializeDatabase();

    return () => {
      if (connection) {
        connection.end();
      }
    };
  }, []);

  const fetchTables = async (conn: DatabaseConnection) => {
    try {
      const query = `
        SELECT table_name, 
               (SELECT COUNT(*) FROM ${conn.options.database}.information_schema.columns WHERE table_name = t.table_name) as column_count,
               (SELECT COUNT(*) FROM ${conn.options.database}."${table_name}") as row_count
        FROM ${conn.options.database}.information_schema.tables t
        WHERE table_schema = 'public'
      `;
      const result = await executeQuery(conn, query);
      setTables(result.rows);
    } catch (err) {
      setError('Failed to fetch table information');
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Database Tools</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {tables.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-2">Database Tables</h3>
          <ul className="space-y-2">
            {tables.map((table) => (
              <li key={table.table_name} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{table.table_name}</span>
                <span className="text-sm text-gray-600">{table.row_count} rows</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading database information...</p>
      )}
    </div>
  );
};

export default DatabaseSection;
