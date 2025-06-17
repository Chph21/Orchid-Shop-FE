import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, Eye } from 'lucide-react';
import { userApi } from '../../api/userApi';
import type { UserDTO } from '../../types/types';

export function UserManagement() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const userData = await userApi.getAll();
      // Transform backend AccountDTO to frontend UserDTO format
      const transformedUsers = userData.map(user => ({
        ...user,
        isActive: true, // Default to active since backend doesn't have this field
        createdAt: undefined, // Backend doesn't provide this
        lastLogin: undefined, // Backend doesn't provide this
        role: user.roleId ? { id: user.roleId, name: user.roleId === '1' ? 'admin' : 'customer' } : undefined
      }));
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError('Failed to load users. Please try again later.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setUsersLoading(true);
        await userApi.delete(userId);
        await fetchUsers(); // Refresh users list
      } catch (err) {
        console.error('Error deleting user:', err);
        setUsersError('Failed to delete user');
      } finally {
        setUsersLoading(false);
      }
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    // This is for local state only since backend doesn't have isActive field
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button 
          onClick={fetchUsers}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Loading/Error States */}
      {usersLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-gray-600">Loading users...</div>
        </div>
      )}

      {usersError && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-red-600">{usersError}</div>
        </div>
      )}

      {/* Users Table */}
      {!usersLoading && !usersError && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        user.role?.name === 'admin' || user.roleId === '1'
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role?.name || (user.roleId === '1' ? 'admin' : 'customer')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => user.id && handleToggleUserStatus(user.id)}
                          className={`transition-colors ${
                            user.isActive 
                              ? 'text-orange-600 hover:text-orange-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => user.id && handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}