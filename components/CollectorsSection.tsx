import React, { useMemo, useState } from 'react';
import { Member } from '../types';

interface CollectorsSectionProps {
  members: Member[];
}

const CollectorsSectionItem: React.FC<{ collector: { name: string; members: Member[] } }> = ({ collector }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="border-b pb-6 last:border-b-0">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-xl font-bold">{collector.name}</h3>
        <span className="text-sm text-gray-500">Members: {collector.members.length}</span>
        <button className="text-blue-500">{isExpanded ? '▲' : '▼'}</button>
      </div>
      {isExpanded && (
        <div className="mt-4">
          {collector.members.length > 0 ? (
            <div className="max-h-60 overflow-y-auto pr-4">
              <ul className="list-disc list-inside">
                {collector.members.map(member => (
                  <li key={member.id} className="mb-1">
                    {member.name || member.fullName} - {member.memberNumber} ({member.email})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">No members found</p>
          )}
        </div>
      )}
    </li>
  );
};

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
            <CollectorsSectionItem key={collector.name} collector={collector} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollectorsSection;
