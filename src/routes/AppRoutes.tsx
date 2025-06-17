import { Hero } from '../components/Hero';
import { OrchidGrid } from '../components/OrchidGrid';
import { About } from '../pages/About';
import { Contact } from '../components/Contact';
import { AdminDashboard } from '../components/admin/AdminDashBoard';
import { useAuth } from '../context/AuthContext';
import type { User, PageType, AppRoutesProps } from '../types/types';

export function AppRoutes({
  currentPage,
  orchids,
  categories,
  loading,
  error,
  onViewDetails,
  onShopClick
}: AppRoutesProps) {
  const { user }: { user: User | null } = useAuth();
  
  const renderLoadingState = () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-lg text-gray-600">Loading orchids...</div>
    </div>
  );

  const renderErrorState = (errorMessage: string) => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-lg text-red-600">{errorMessage}</div>
    </div>
  );

  const renderShopPage = () => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState(error);
    return <OrchidGrid orchids={orchids} categories={categories} onViewDetails={onViewDetails} />;
  };

  const renderAdminPage = () => {
    const isAdmin = user?.role === 'admin';
    return isAdmin ? <AdminDashboard /> : <Hero onShopClick={onShopClick} />;
  };

  const renderCurrentPage = () => {
    const page = currentPage as PageType;

    switch (page) {
      case 'home':
        return <Hero onShopClick={onShopClick} />;
      case 'shop':
        return renderShopPage();
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'admin':
        return renderAdminPage();
      default:
        return <Hero onShopClick={onShopClick} />;
    }
  };

  return <>{renderCurrentPage()}</>;
}