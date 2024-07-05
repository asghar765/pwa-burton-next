import React, { useContext, useEffect } from 'react';
import { AdminDashboard } from '../../components/AdminDashboard';
import { AuthContext } from '../../context/authContext';
import { useRouter } from 'next/router';

const DashboardPage = () => {
  const { user, userRole } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Ensures this code runs only on the client side
    if (typeof window !== "undefined") {
      if (!user || userRole !== 'admin') {
        router.push('/');
      }
    }
  }, [user, userRole, router]);

  return <div>{user && userRole === 'admin' && <AdminDashboard />}</div>;
};

export default DashboardPage;