import React from 'react';
import { Collector } from '../types';

interface CollectorsSectionProps {
  collectors: Collector[];
}

const CollectorsSection: React.FC<CollectorsSectionProps> = ({ collectors }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Collectors</h2>
      <ul className="space-y-4">
        {collectors.map(collector => (
          <li key={collector.id} className="bg-white rounded shadow p-4">
            <h4 className="font-bold">{collector.name || 'N/A'}</h4>
            <p>Email: {collector.email || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectorsSection;