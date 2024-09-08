     // DatabaseSection.tsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

interface DatabaseSectionProps {
  collections: { name: string; count: number }[];
  onUploadMembers: (members: any[]) => void;
  onDeleteAllUploadedMembers: () => void;
  uploadedMembers: any[];
  onBulkAddMembers: () => void;
  onBulkDeleteMembers: () => void;
}

const DatabaseSection: React.FC<DatabaseSectionProps> = ({ 
  collections, 
  onUploadMembers, 
  onDeleteAllUploadedMembers, 
  uploadedMembers,
  onBulkAddMembers,
  onBulkDeleteMembers
}) => {

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (result) => {
        const members = result.data.map((row: any) => ({
          name: row.Name || '',
          addressNo: row.No || '',
          address: row.Address || '',
          collector: row.Collector || '',
        }));
        onUploadMembers(members);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <h3 className="text-lg font-medium mb-2">Bulk Upload Members</h3>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the CSV file here ...</p>
          ) : (
            <p>Drag 'n' drop a CSV file here, or click to select a file</p>
          )}
        </div>
        {uploadedMembers.length > 0 && (
          <div className="mt-4">
            <p>{uploadedMembers.length} members uploaded. Please review the details below:</p>
            <ul className="mt-2 space-y-2">
              {uploadedMembers.map((member, index) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                  <p><strong>Name:</strong> {member.name || 'N/A'}</p>
                  <p><strong>No:</strong> {member.addressNo || 'N/A'}</p>
                  <p><strong>Address:</strong> {member.addressNo} {member.address || 'N/A'}</p>
                  <p><strong>Collector:</strong> {member.collector || 'N/A'}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-x-4">
              <button
                onClick={onBulkAddMembers}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Bulk Add Members
              </button>
              <button
                onClick={onDeleteAllUploadedMembers}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove All Bulk Upload Members
              </button>
              <button
                onClick={onBulkDeleteMembers}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Bulk Delete Members
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSection;
