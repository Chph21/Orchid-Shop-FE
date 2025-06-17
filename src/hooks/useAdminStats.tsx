import { useState, useEffect } from 'react';
import { useOrchid } from '../context/OrchidContext';
import { userApi } from '../api/userApi';
import type { UserDTO } from '../types/types';

export function useAdminStats() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const { orchids, categories } = useOrchid();

  const fetchUsers = async () => {
    try {
      const userData = await userApi.getAll();
      const transformedUsers = userData.map(user => ({
        ...user,
        isActive: true,
        role: user.roleId ? { id: user.roleId, name: user.roleId === '1' ? 'admin' : 'customer' } : undefined
      }));
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users for stats:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = {
    totalProducts: orchids.length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalRevenue: 15420.50,
    monthlyGrowth: 12.5,
    naturalOrchids: orchids.filter(o => o.isNatural === 'true').length,
    totalCategories: categories.length
  };

  return { users, stats };
}