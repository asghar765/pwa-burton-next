     // DatabaseSection.tsx
import React, { useRef, useState } from 'react';
import Papa from 'papaparse';

interface DatabaseSectionProps {
  collections: { name: string; count: number }[];
  onBulkAddMembers: () => void;
  onBulkDeleteMembers: () => void;
  onApproveMember?: (member: Member) => void;
}

interface Member {
  Name: string;
  No: string;
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
  const [parsedData, setParsedData] = useState<Member[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<Member>(file, {
        complete: (results) => {
          setParsedData(results.data);
          console.log('Parsed data:', results.data);
        },
        header: true,
        skipEmptyLines: true
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleApproveMember = (member: Member) => {
    if (onApproveMember) {
      onApproveMember(member);
    }
    setParsedData(prevData => prevData.filter(m => m !== member));
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
            <ul className="space-y-2">
              {parsedData.map((member, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{member.Name} - {member.No} - {member.Address} - {member.Collector}</span>
                  <button
                    onClick={() => handleApproveMember(member)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSection;
