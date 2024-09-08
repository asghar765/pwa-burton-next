     // DatabaseSection.tsx
import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { NewMember } from '../types';
import { generateMemberNumber } from '../utils/memberUtils';
import { db } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

interface DatabaseSectionProps {
  collections: { name: string; count: number }[];
  onBulkAddMembers: (members: NewMember[]) => void;
  onBulkDeleteMembers: () => void;
  onApproveMember?: (member: NewMember) => void;
}

interface CsvMember {
  Name: string;
  Address: string;
  Collector: string;
}

const DatabaseSection: React.FC<DatabaseSectionProps> = ({ 
  collections, 
  onBulkAddMembers,
  onBulkDeleteMembers,
  onApproveMember
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<NewMember[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<CsvMember>(file, {
        complete: (results) => {
          const newMembers: NewMember[] = results.data.map((csvMember) => ({
            name: csvMember.Name,
            email: '',
            role: 'member',
            memberNumber: generateMemberNumber(),
            verified: true,
            address: csvMember.Address,
            collector: csvMember.Collector,
          }));
          setParsedData(newMembers);
          console.log('Parsed data:', newMembers);
        },
        header: true,
        skipEmptyLines: true
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleApproveMember = async (member: NewMember) => {
    try {
      const approvedMember = { ...member, memberNumber: generateMemberNumber() };
      const membersRef = collection(db, 'members');
      await addDoc(membersRef, approvedMember);
      if (onApproveMember) {
        onApproveMember(approvedMember);
      }
      setParsedData(prevData => prevData.filter(m => m !== member));
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      const approvedMembers = parsedData.map(member => ({
        ...member,
        memberNumber: generateMemberNumber()
      }));
      const membersRef = collection(db, 'members');
      for (const member of approvedMembers) {
        await addDoc(membersRef, member);
      }
      if (onBulkAddMembers) {
        onBulkAddMembers(approvedMembers);
      }
      setParsedData([]);
    } catch (error) {
      console.error("Error bulk approving members:", error);
    }
  };
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Database Information</h2>
      <div>
        <h3 className="text-lg font-medium mb-2">Firestore Collections</h3>
        {collections.length > 0 ? (
          <ul className="space-y-2">
            {collections.map((collection) => (
              <li key={collection.name} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{collection.name}</span>
                <span className="text-sm text-gray-600">{collection.count} documents</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No collections found in the database.</p>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Bulk Operations</h3>
        <div className="mt-4 space-x-4">
          <button
            onClick={onBulkAddMembers}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Bulk Add Members
          </button>
          <button
            onClick={onBulkDeleteMembers}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Bulk Delete Members
          </button>
          <button
            onClick={triggerFileInput}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
        </div>
        {parsedData.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2">Parsed CSV Data</h4>
            <div>
              <ul className="space-y-2">
                {parsedData.map((member, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span>{member.name} - {member.memberNumber} - {member.address} - {member.collector}</span>
                    <button
                      onClick={() => handleApproveMember(member)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </li>
                ))}
              </ul>
              {parsedData.length > 0 && (
                <button
                  onClick={handleBulkApprove}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Bulk Approve All
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSection;
