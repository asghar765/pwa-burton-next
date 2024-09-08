import React from 'react';
import { Member, Registration, Collector } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardSectionProps {
  members: Member[];
  registrations: Registration[];
  collectors: Collector[];
  accountBalance: number;
  registrationChartData: { date: string; registrations: number; totalMembers: number }[];
  currentUser: Member | null;
  userRole: string | null;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  members,
  registrations,
  collectors,
  accountBalance,
  registrationChartData,
  currentUser,
  userRole,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      {currentUser && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold mb-2">Welcome, {currentUser.name}</h3>
          <p>Member Number: {currentUser.memberNumber}</p>
          <p>Role: {userRole}</p>
        </div>
      )}
      
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
        <ResponsiveContainer width="100%" height={600} minHeight={500}>
          <BarChart
            data={registrationChartData}
            margin={{ top: 20, right: 40, left: 40, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              tick={{ fontSize: 14 }}
            />
            <YAxis 
              yAxisId="left" 
              label={{ value: 'Registrations', angle: -90, position: 'insideLeft', offset: -10, fontSize: 14 }} 
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 14 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              label={{ value: 'Total Members', angle: 90, position: 'insideRight', offset: 10, fontSize: 14 }} 
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 14 }}
            />
            <Tooltip 
              formatter={(value) => value.toLocaleString()} 
              contentStyle={{ fontSize: 16 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }} 
              verticalAlign="bottom" 
              height={40}
              iconSize={16}
              fontSize={14}
            />
            <Bar yAxisId="left" dataKey="registrations" name="Monthly Registrations" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="totalMembers" name="Total Members" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardSection;
