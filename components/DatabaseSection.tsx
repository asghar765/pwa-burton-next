     // DatabaseSection.tsx
import React from 'react';

interface TableInfo {
  table_name: string;
  row_count: string;
}

interface DatabaseSectionProps {
  tables: TableInfo[];
  error: string | null;
}

const DatabaseSection: React.FC<DatabaseSectionProps> = ({ tables, error }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Database Tools</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
    </div>
  );
};

export default DatabaseSection;
