import { Hero } from '../components/Hero';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate('/shop');
  };

  return <Hero onShopClick={handleShopClick} />;
};