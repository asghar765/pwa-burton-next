"use client";

import React from 'react';
import { DashboardProvider } from './dashboard-context';
import { DashboardLayout } from './dashboard-layout';

export const DashboardClient: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  );
};

export default DashboardClient;
