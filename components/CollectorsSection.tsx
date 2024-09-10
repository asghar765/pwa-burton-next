import React, { useEffect, useState } from 'react';
import { Collector, Member } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/clientApp';

interface CollectorsSectionProps {
  collectors: Collector[];
}

const CollectorsSection: React.FC<CollectorsSectionProps> = ({ collectors }) => {
  const [collectorMembers, setCollectorMembers] = useState<{ [key: string]: Member[] }>({});

  useEffect(() => {
    const fetchMembers = async () => {
      const membersRef = collection(db, 'members');
      const membersData: { [key: string]: Member[] } = {};

      for (const collector of collectors) {
        const q = query(membersRef, where('collectorId', '==', collector.id));
        const querySnapshot = await getDocs(q);
        membersData[collector.id] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
      }

      setCollectorMembers(membersData);
    };

    fetchMembers();
  }, [collectors]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Collectors</h2>
      <ul className="space-y-6">
        {collectors.map(collector => (
          <li key={collector.id} className="bg-white rounded shadow p-4">
            <h4 className="font-bold text-lg">{collector.name || 'N/A'}</h4>
            <p className="mb-2">Email: {collector.email || 'N/A'}</p>
            <h5 className="font-semibold mt-4 mb-2">Members:</h5>
            <ul className="list-disc list-inside">
              {collectorMembers[collector.id]?.map(member => (
                <li key={member.id} className="ml-4">
                  {member.name} ({member.email})
                </li>
              )) || <li className="ml-4 text-gray-500">No members found</li>}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectorsSection;
