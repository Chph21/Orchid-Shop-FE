import { useState } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { useOrchid } from '../../context/OrchidContext';
import { categoryApi } from '../../api/categoryApi';
import { CategoryEditModal } from './modals/CategoryEditModal';
import { toast } from 'react-hot-toast';

export function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const { orchids, categories, refreshCategories } = useOrchid();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setLocalLoading(true);
        await categoryApi.delete(categoryId);
        await refreshCategories();
        toast.success('Category deleted successfully');
      } catch (err) {
        console.error('Error deleting category:', err);
        toast.error('Failed to delete category');
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
  };

  const handleCreateCategory = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingCategory(null);
    setIsCreateModalOpen(false);
    refreshCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
        <button 
          onClick={handleCreateCategory}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">ID: {category.id}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditCategory(category)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category.id!)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                  disabled={localLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                {orchids.filter(o => o.categoryName === category.name).length} orchids
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {(editingCategory || isCreateModalOpen) && (
        <CategoryEditModal
          category={editingCategory}
          isOpen={true}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}