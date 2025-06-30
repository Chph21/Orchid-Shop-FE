import { useState } from 'react';
import { BarChart3, Users, Package, Filter, ShoppingBag } from 'lucide-react';
import { OrchidManagement } from './OrchidManagement';
import { CategoryManagement } from './CategoryManagement';
import { UserManagement } from './UserManagement';
import { OrderManagement } from './OrderManagement';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'categories' | 'orders'>('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <OrchidManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <OrchidManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your orchid store and customer accounts</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              // { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Orchids', icon: Package },
              { id: 'categories', label: 'Categories', icon: Filter },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'users', label: 'Users', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}