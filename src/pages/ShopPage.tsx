import { OrchidGrid } from '../components/OrchidGrid';
import { useOrchid } from '../context/OrchidContext';
import { useNavigate } from 'react-router-dom';
import type { OrchidDTO } from '../types/types';

export const ShopPage: React.FC = () => {
  const { orchids, categories, loading, error } = useOrchid();
  const navigate = useNavigate();

  const handleViewDetails = (orchid: OrchidDTO) => {
    navigate(`/orchid/${orchid.id}`);
  };

  return (
    <OrchidGrid 
      orchids={orchids} 
      categories={categories} 
      onViewDetails={handleViewDetails}
      loading={loading}
      error={error}
    />
  );
};