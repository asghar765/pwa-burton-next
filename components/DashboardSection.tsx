import React from 'react';
import { Member, Registration, Collector } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardSectionProps {
  members: Member[];
  registrations: Registration[];
  collectors: Collector[];
  accountBalance: number;
  registrationChartData: { date: string; count: number }[];
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  members,
  registrations,
  collectors,
  accountBalance,
  registrationChartData,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Members</h3>
          <p className="text-2xl font-bold">{members.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Registrations</h3>
          <p className="text-2xl font-bold">{registrations.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Collectors</h3>
          <p className="text-2xl font-bold">{collectors.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Account Balance</h3>
          <p className="text-2xl font-bold">£{accountBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Registrations (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={registrationChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardSection;
