import React, { useEffect, useState } from 'react';
import { Collector, Member } from '../types';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/clientApp';

interface CollectorsSectionProps {
  collectors: Collector[];
}

const CollectorsSection: React.FC<CollectorsSectionProps> = ({ collectors }) => {
  const [collectorsWithMembers, setCollectorsWithMembers] = useState<Collector[]>([]);

  useEffect(() => {
    const fetchMembersForCollectors = async () => {
      const membersRef = collection(db, 'members');
      const membersSnapshot = await getDocs(membersRef);
      const allMembers = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));

      const updatedCollectors = collectors.map(collector => ({
        ...collector,
        members: allMembers.filter(member => member.collector === collector.id)
      }));

      setCollectorsWithMembers(updatedCollectors);
    };

    fetchMembersForCollectors();
  }, [collectors]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Collectors</h2>
      <ul className="space-y-6">
        {collectorsWithMembers.map(collector => (
          <li key={collector.id} className="bg-white rounded shadow p-4">
            <h4 className="font-bold text-lg">{collector.name || 'N/A'}</h4>
            <p className="mb-2">Email: {collector.email || 'N/A'}</p>
            <h5 className="font-semibold mt-4 mb-2">Members:</h5>
            <ul className="list-disc list-inside">
              {collector.members && collector.members.length > 0 ? (
                collector.members.map(member => (
                  <li key={member.id} className="ml-4">
                    {member.fullName} ({member.email})
                  </li>
                ))
              ) : (
                <li className="ml-4 text-gray-500">No members found</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectorsSection;
