// DatabaseSection.tsx
import React from 'react';
import { runConversion } from '../utils/conversionUtils';

interface DatabaseSectionProps {
  collections: { name: string; count: number }[];
}

const DatabaseSection: React.FC<DatabaseSectionProps> = ({ collections }) => {
  const handleRunConversion = () => {
    runConversion();
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Database Information</h2>
      <div>
        <h3 className="text-lg font-medium mb-2">Firestore Collections</h3>
        {collections.length > 0 ? (
          <ul className="space-y-2">
            {collections.map((collection) => (
              <li key={collection.name} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{collection.name}</span>
                <span className="text-sm text-gray-600">{collection.count} documents</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No collections found in the database.</p>
        )}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleRunConversion}>
          Run Conversion
        </button>
      </div>
    </div>
  );
};

export default DatabaseSection;
