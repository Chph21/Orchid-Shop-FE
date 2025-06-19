import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrchidProvider } from './context/OrchidContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toaster } from 'react-hot-toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OrchidDetailPage } from './pages/OrchidDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Components
import { Cart } from './components/Cart';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { CheckoutFlow } from './components/checkout/CheckoutFlow';
import { ProtectedRoute } from './components/ProtectedRoute';

import { useState } from 'react';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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
    <BrowserRouter>
      <AuthProvider>
        <OrchidProvider>
          <CartProvider>
            <div className="min-h-screen bg-white">
              <Header 
                onCartOpen={() => setIsCartOpen(true)} 
                onLoginOpen={() => setIsLoginOpen(true)}
              />
              
              <main>
                <Toaster position="top-center" />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/orchid/:id" element={<OrchidDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />

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
          </CartProvider>
        </OrchidProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;