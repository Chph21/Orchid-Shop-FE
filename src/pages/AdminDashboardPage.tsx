import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from '../components/admin/AdminDashBoard';

export const AdminDashboardPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/*" element={<AdminDashboard />} />
    </Routes>
  );
};