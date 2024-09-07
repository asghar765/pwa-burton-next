import React from 'react';
import { Member, Registration, Collector } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardSectionProps {
  members: Member[];
  registrations: Registration[];
  collectors: Collector[];
  accountBalance: number;
  registrationChartData: { date: string; registrations: number; totalMembers: number }[];
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
        <h3 className="text-xl font-semibold mb-4">Monthly Registrations and Total Members (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={400} minHeight={300}>
          <BarChart
            data={registrationChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: 'Registrations', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Total Members', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="registrations" name="Monthly Registrations" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="totalMembers" name="Total Members" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardSection;
