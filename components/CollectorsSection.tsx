import React, { useEffect, useState } from 'react';
import { Collector, Member } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/clientApp';

interface CollectorsSectionProps {
  collectors: Collector[];
}

const CollectorsSection: React.FC<CollectorsSectionProps> = ({ collectors }) => {
  const [collectorsWithMembers, setCollectorsWithMembers] = useState<Collector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembersForCollectors = async () => {
      try {
        setIsLoading(true);
        const membersRef = collection(db, 'members');
        const membersSnapshot = await getDocs(membersRef);
        const allMembers = membersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));

        const updatedCollectors = collectors.map(collector => ({
          ...collector,
          members: allMembers.filter(member => member.collector === collector.id)
        }));

        // Sort collectors by number of members (descending order)
        const sortedCollectors = updatedCollectors.sort((a, b) => 
          (b.members?.length || 0) - (a.members?.length || 0)
        );

        setCollectorsWithMembers(sortedCollectors);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchMembersForCollectors();
  }, [collectors]);

  if (isLoading) {
    return <div>Loading collectors and members...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Collectors</h2>
      {collectorsWithMembers.length === 0 ? (
        <p>No collectors found.</p>
      ) : (
        <ul className="space-y-8">
          {collectorsWithMembers.map(collector => (
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
