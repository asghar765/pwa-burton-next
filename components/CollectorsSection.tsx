import React, { useMemo } from 'react';
import { Member } from '../types';

interface CollectorsSectionProps {
  members: Member[];
}

const CollectorsSection: React.FC<CollectorsSectionProps> = ({ members }) => {
  const collectorsWithMembers = useMemo(() => {
    const collectorMap = new Map<string, { name: string; members: Member[] }>();

    members.forEach(member => {
      if (member.collector) {
        if (!collectorMap.has(member.collector)) {
          collectorMap.set(member.collector, { name: member.collector, members: [] });
        }
        collectorMap.get(member.collector)!.members.push(member);
      }
    });

    return Array.from(collectorMap.values())
      .sort((a, b) => b.members.length - a.members.length);
  }, [members]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Collectors</h2>
      {collectorsWithMembers.length === 0 ? (
        <p>No collectors found.</p>
      ) : (
        <ul className="space-y-8">
          {collectorsWithMembers.map(collector => (
            <li key={collector.name} className="border-b pb-6 last:border-b-0">
              <h3 className="text-xl font-bold mb-2">{collector.name}</h3>
              <h4 className="font-semibold mb-2">
                Members: {collector.members.length}
              </h4>
              {collector.members.length > 0 ? (
                <ul className="list-disc list-inside pl-4">
                  {collector.members.map(member => (
                    <li key={member.id} className="mb-1">
                      {member.name || member.fullName} ({member.email})
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
