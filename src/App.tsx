import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrchidProvider } from './context/OrchidContext';
import { Header } from './components/Header';
import { OrchidDetail } from './components/OrchidDetail';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { AppRoutes } from './routes/AppRoutes';
import { Register } from './components/Register';
import { Toaster } from 'react-hot-toast';
import { CheckoutFlow } from './components/checkout/CheckoutFlow';
import { useOrchid } from './context/OrchidContext';
import type { OrchidDTO } from './types/types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedOrchid, setSelectedOrchid] = useState<OrchidDTO | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { orchids, categories, loading, error } = useOrchid();

  const handleViewDetails = (orchid: OrchidDTO) => {
    setSelectedOrchid(orchid);
  };

  // const handleCloseDetail = () => {
  //   setSelectedOrchid(null);
  // };

  const handleShopClick = () => {
    setCurrentPage('shop');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onCartOpen={() => setIsCartOpen(true)} 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLoginOpen={() => setIsLoginOpen(true)}
      />
      
      <main>
        <Toaster position="top-center" />
        <AppRoutes
          currentPage={currentPage}
          orchids={orchids}
          categories={categories}
          loading={loading}
          error={error}
          onViewDetails={handleViewDetails}
          onShopClick={handleShopClick}
        />
      </main>

      {currentPage !== 'admin' && <Footer />}

      {/* Orchid Detail Modal
      {selectedOrchid && (
        <OrchidDetail
          orchid={selectedOrchid}
          onClose={handleCloseDetail}
        />
      )} */}

      {/* Shopping Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Checkout Flow */}
      <CheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Login Modal */}
      {isLoginOpen && (
        <Login 
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <Register 
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrchidProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </OrchidProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;