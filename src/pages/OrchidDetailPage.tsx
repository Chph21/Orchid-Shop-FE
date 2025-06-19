import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OrchidDetail } from '../components/OrchidDetail';
import { orchidApi } from '../api/orchidApi';
import type { OrchidDTO } from '../types/types';

export const OrchidDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orchid, setOrchid] = useState<OrchidDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrchid = async () => {
      if (!id) {
        setError('Orchid ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orchidData = await orchidApi.getById(id);
        if (orchidData) {
          setOrchid(orchidData);
        } else {
          setError('Orchid not found');
        }
      } catch (err) {
        console.error('Error fetching orchid:', err);
        setError('Failed to load orchid details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrchid();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading orchid details...</div>
      </div>
    );
  }

  if (error || !orchid) {
    return <Navigate to="/shop" replace />;
  }

  return <OrchidDetail orchid={orchid} />;
};