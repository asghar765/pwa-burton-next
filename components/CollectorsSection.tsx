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
    <li className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xl font-bold">{collector.name}</h3>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Members: {filteredMembers.length}</span>
          <button className="text-blue-500 focus:outline-none">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="max-h-60 overflow-y-auto pr-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Member ID</th>
                  <th className="text-left p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id} className="border-b">
                    <td className="p-2">{member.name || member.fullName}</td>
                    <td className="p-2">{member.memberNumber}</td>
                    <td className="p-2">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Collectors</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by member ID or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {filteredCollectors.length === 0 ? (
        <p className="text-center text-gray-500">No collectors or members found matching the search criteria.</p>
      ) : (
        <ul className="space-y-4">
          {filteredCollectors.map(collector => (
            <CollectorsSectionItem key={collector.name} collector={collector} searchTerm={searchTerm} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CollectorsSection;
