import { useState } from 'react';
import { Eye, Edit, Trash2, Plus, Search } from 'lucide-react';
import { useOrchid } from '../../context/OrchidContext';
import { orchidApi } from '../../api/orchidApi';

export function OrchidManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { orchids, loading, error, refreshOrchids } = useOrchid();

  const filteredOrchids = orchids.filter(orchid =>
    orchid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (orchid.categoryName && orchid.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (orchid.description && orchid.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteOrchid = async (orchidId: string) => {
    if (window.confirm('Are you sure you want to delete this orchid?')) {
      try {
        setLocalLoading(true);
        await orchidApi.delete(orchidId);
        await refreshOrchids();
      } catch (err) {
        console.error('Error deleting orchid:', err);
        setLocalError('Failed to delete orchid');
      } finally {
        setLocalLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orchid Management</h2>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Orchid</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search orchids..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Loading/Error States */}
      {(loading || localLoading) && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-gray-600">Loading orchids...</div>
        </div>
      )}

      {(error || localError) && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-red-600">{error || localError}</div>
        </div>
      )}

      {/* Orchids Table */}
      {!loading && !localLoading && !error && !localError && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orchid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Natural
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrchids.map((orchid) => (
                  <tr key={orchid.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={orchid.url}
                          alt={orchid.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/40x40?text=No+Image';
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{orchid.name}</div>
                          <div className="text-sm text-gray-500">ID: {orchid.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full capitalize">
                        {(orchid.categoryName || 'Uncategorized').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${(orchid.price || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        orchid.isNatural === 'true'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {orchid.isNatural === 'true' ? 'Natural' : 'Hybrid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-emerald-600 hover:text-emerald-900 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrchid(orchid.id!)}
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