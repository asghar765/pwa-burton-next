import React, { useMemo, useState } from 'react';
import { Member } from '../types';
import { generateRawMemberNumber } from '../utils/memberUtils';
import { db } from '../firebase/clientApp'; // Import Firestore instance
import { doc, updateDoc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore functions

interface CollectorsSectionProps {
  members: Member[];
}

const CollectorsSectionItem: React.FC<{ collector: { name: string; members: Member[], number: string }, searchTerm: string }> = ({ collector, searchTerm }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(collector.name);

  const filteredMembers = useMemo(() => {
    return collector.members.map((member, index) => {
      // Generate the raw member number using the new utility function
      const memberNumber = generateRawMemberNumber(
        collector.name, 
        parseInt(collector.number, 10), 
        index + 1
      );

      return {
        ...member,
        memberNumber
      };
    }).filter(member => 
      member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.name || member.fullName).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collector.members, searchTerm]);

  if (filteredMembers.length === 0) {
    return null;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    // Sanitize the collector name to remove any invalid characters or extra spaces
    const sanitizedName = editedName.replace(/\s+/g, ' ').trim().replace(/\//g, '-');

    // Log the document ID and collection path before the update call
    console.log(`Document ID: ${sanitizedName}, Collection Path: collectors`);

    // Log the edited name before passing it to the update function
    console.log(`Edited Name: ${sanitizedName}`);

    try {
      // Check if the document exists in the Firestore database
      const collectorRef = doc(db, 'collectors', sanitizedName);
      const collectorDoc = await getDoc(collectorRef);

      if (!collectorDoc.exists()) {
        // If the document does not exist, create it with the necessary fields
        await setDoc(collectorRef, { name: sanitizedName });
      } else {
        // If the document exists, update it with the new collector name
        await updateDoc(collectorRef, { name: sanitizedName });
      }

      // Update the collector field in the members collection
      const membersRef = collection(db, 'members');
      const q = query(membersRef, where('collector', '==', collector.name));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { collector: sanitizedName });
      });

      // Update the local state
      collector.name = sanitizedName;
      setIsEditing(false);
    } catch (error) {
      // Log any errors that occur during the update process
      console.error('Error updating collector name:', error);
    }
  };

  return (
    <li className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-grow">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-grow">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="border rounded-md px-2 py-1 flex-grow"
              />
              <button 
                onClick={handleSaveClick} 
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 flex-grow">
              <h3 className="text-xl font-bold">{`${collector.number} - ${collector.name}`}</h3>
              <button 
                onClick={handleEditClick} 
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Members: {filteredMembers.length}</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <div className="max-h-60 overflow-x-auto overflow-y-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Member ID</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Contact Number</th>
                  <th className="text-left p-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={`${member.id}-${collector.number}`} className="border-b">
                    <td className="p-2">{member.name || member.fullName}</td>
                    <td className="p-2">{member.memberNumber}</td>
                    <td className="p-2">{member.email}</td>
                    <td className="p-2">{member.mobileNo}</td>
                    <td className="p-2">{member.address}</td>
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
      .sort((a, b) => b.members.length - a.members.length)
      .map((collector, index) => ({
        ...collector,
        number: String(index + 1).padStart(2, '0') // Add collector number
      }));
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
