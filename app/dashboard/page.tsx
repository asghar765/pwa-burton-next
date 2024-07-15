'use client';

import { getAuth, signOut, User } from 'firebase/auth';
import { getDatabase, ref, onValue, set, remove, push } from 'firebase/database';
import { app, auth } from '../../config/firebaseConfig';
import React, { useState, useEffect } from 'react';

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

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface MemberDetails {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [routesStatus, setRoutesStatus] = useState<RouteStatus[]>([]);
  const [membershipData, setMembershipData] = useState<MembershipData>({
    totalMembers: 0,
    activeMembers: 0,
    pendingApprovals: 0
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<MemberDetails[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const routesRef = ref(database, 'routes');
      onValue(routesRef, (snapshot) => {
        const data = snapshot.val();
        const routesList: RouteStatus[] = Object.entries(data || {}).map(([path, status]) => ({
          path,
          status: status as string
        }));
        setRoutesStatus(routesList);
      });

      const membershipRef = ref(database, 'membership');
      onValue(membershipRef, (snapshot) => {
        const data = snapshot.val();
        setMembershipData(data || { totalMembers: 0, activeMembers: 0, pendingApprovals: 0 });
      });

      const rolesRef = ref(database, 'roles');
      onValue(rolesRef, (snapshot) => {
        const data = snapshot.val();
        const rolesList: Role[] = Object.entries(data || {}).map(([id, role]: [string, any]) => ({
          id,
          ...role
        }));
        setRoles(rolesList);
      });

      const membersRef = ref(database, 'members');
      onValue(membersRef, (snapshot) => {
        const data = snapshot.val();
        const membersList: MemberDetails[] = Object.entries(data || {}).map(([id, member]: [string, any]) => ({
          id,
          ...member
        }));
        setMembers(membersList);
      });
    }
  }, [user]);

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error('Error signing out:', error));
  };

  const addRole = (name: string, permissions: string[]) => {
    const rolesRef = ref(database, 'roles');
    push(rolesRef, { name, permissions });
  };

  const updateRole = (id: string, name: string, permissions: string[]) => {
    const roleRef = ref(database, `roles/${id}`);
    set(roleRef, { name, permissions });
  };

  const deleteRole = (id: string) => {
    const roleRef = ref(database, `roles/${id}`);
    remove(roleRef);
  };

  const addMember = (name: string, email: string, role: string) => {
    const membersRef = ref(database, 'members');
    push(membersRef, { name, email, role });
  };

  const updateMember = (id: string, name: string, email: string, role: string) => {
    const memberRef = ref(database, `members/${id}`);
    set(memberRef, { name, email, role });
  };

  const deleteMember = (id: string) => {
    const memberRef = ref(database, `members/${id}`);
    remove(memberRef);
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

        <div className="bg-white p-6 rounded-lg shadow mb-8">
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

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          <ul className="divide-y divide-gray-200">
            {roles.map((role) => (
              <li key={role.id} className="py-4 flex justify-between items-center">
                <span className="text-gray-800">{role.name}</span>
                <button onClick={() => deleteRole(role.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </li>
            ))}
          </ul>
          {/* Add form for adding/updating roles */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Member Details</h2>
          <ul className="divide-y divide-gray-200">
            {members.map((member) => (
              <li key={member.id} className="py-4 flex justify-between items-center">
                <span className="text-gray-800">{member.name} - {member.email}</span>
                <span className="text-gray-600">{member.role}</span>
              </li>
            ))}
          </ul>
          {/* Add form for adding/updating members */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
