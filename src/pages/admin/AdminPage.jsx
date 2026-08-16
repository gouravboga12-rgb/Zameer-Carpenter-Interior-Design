import React from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboardLayout from './AdminDashboardLayout';

export default function AdminPage() {
  const { isAdminAuthenticated } = useAdminData();

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  return <AdminDashboardLayout />;
}
