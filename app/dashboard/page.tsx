'use client';

import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, User } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

interface RouteStatus {
  path: string;
  status: string;
}

interface MembershipData {
  totalMembers: number;
  activeMembers: number;
  pendingApprovals: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [routesStatus, setRoutesStatus] = useState<RouteStatus[]>([]);
  const [membershipData, setMembershipData] = useState<MembershipData>({
    totalMembers: 0,
    activeMembers: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch route statuses
      const routesRef = ref(database, 'routes');
      onValue(routesRef, (snapshot) => {
        const data = snapshot.val();
        const routesList: RouteStatus[] = Object.entries(data || {}).map(([path, status]) => ({
          path,
          status: status as string
        }));
        setRoutesStatus(routesList);
      });

      // Fetch membership data
      const membershipRef = ref(database, 'membership');
      onValue(membershipRef, (snapshot) => {
        const data = snapshot.val();
        setMembershipData(data || { totalMembers: 0, activeMembers: 0, pendingApprovals: 0 });
      });
    }
  }, [user]);

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error('Error signing out:', error));
  };

  if (!user) {
    return <div>Please sign in to access the admin dashboard.</div>;
  }

  const maxValue = Math.max(...Object.values(membershipData));

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Sign Out</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(membershipData).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
              <p className="text-4xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Membership Overview</h2>
          <div className="h-64">
            {Object.entries(membershipData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <div className="flex items-center">
                  <div className="w-32 text-right mr-4">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                  <div className="flex-grow bg-gray-200 rounded-full h-5">
                    <div
                      className="bg-blue-600 h-5 rounded-full"
                      style={{ width: `${(value / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right ml-4">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Route Statuses</h2>
          <ul className="divide-y divide-gray-200">
            {routesStatus.map((route, index) => (
              <li key={index} className="py-4 flex justify-between items-center">
                <span className="text-gray-800">{route.path}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  route.status === 'Accessible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {route.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;