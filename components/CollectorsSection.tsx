import React, { useMemo, useState } from 'react';
import { Member } from '../types';

interface CollectorsSectionProps {
  members: Member[];
}

const CollectorsSectionItem: React.FC<{ collector: { name: string; members: Member[] }, searchTerm: string }> = ({ collector, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredMembers = useMemo(() => {
    return collector.members.filter(member => 
      member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.name || member.fullName).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collector.members, searchTerm]);

  if (filteredMembers.length === 0) {
    return null;
  }

  return (
    <li className="border-b pb-6 last:border-b-0">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-xl font-bold">{collector.name}</h3>
        <span className="text-sm text-gray-500">Members: {filteredMembers.length}</span>
        <button className="text-blue-500">{isExpanded ? '▲' : '▼'}</button>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="max-h-60 overflow-y-auto pr-4">
            <ul className="list-disc list-inside">
              {filteredMembers.map(member => (
                <li key={member.id} className="mb-1">
                  {member.name || member.fullName} - {member.memberNumber} ({member.email})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

const CollectorsSection: React.FC<CollectorsSectionProps> = ({ members }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCollectors = useMemo(() => {
    if (searchTerm === '') {
      return collectorsWithMembers;
    }
    return collectorsWithMembers.filter(collector => 
      collector.members.some(member => 
        member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.name || member.fullName).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [collectorsWithMembers, searchTerm]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Collectors</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by member ID or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      {filteredCollectors.length === 0 ? (
        <p>No collectors or members found matching the search criteria.</p>
      ) : (
        <ul className="space-y-8">
          {filteredCollectors.map(collector => (
            <CollectorsSectionItem key={collector.name} collector={collector} searchTerm={searchTerm} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollectorsSection;
