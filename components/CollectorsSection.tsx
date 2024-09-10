import React from 'react';
import { Collector } from '../types';

interface CollectorsSectionProps {
  collectors: Collector[];
}

const CollectorsSection: React.FC<CollectorsSectionProps> = ({ collectors }) => {
  // Sort collectors by number of members (descending order)
  const sortedCollectors = [...collectors].sort((a, b) => 
    (b.members?.length || 0) - (a.members?.length || 0)
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Collectors</h2>
      {sortedCollectors.length === 0 ? (
        <p>No collectors found.</p>
      ) : (
        <ul className="space-y-8">
          {sortedCollectors.map(collector => (
            <li key={collector.id} className="border-b pb-6 last:border-b-0">
              <h3 className="text-xl font-bold mb-2">{collector.name || 'N/A'}</h3>
              <p className="mb-4">Email: {collector.email || 'N/A'}</p>
              <h4 className="font-semibold mb-2">
                Members: {collector.members?.length || 0}
              </h4>
              {collector.members && collector.members.length > 0 ? (
                <ul className="list-disc list-inside pl-4">
                  {collector.members.map(member => (
                    <li key={member.id} className="mb-1">
                      {member.fullName} ({member.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No members found</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollectorsSection;
