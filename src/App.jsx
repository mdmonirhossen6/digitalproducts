import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-surface-800">
            <ToastContainer theme="dark" />
            
            {/* Global Navbar */}
            <Navbar onCartToggle={() => setIsCartOpen(prev => !prev)} />
            
            {/* Slide-over Cart Sidebar */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Application pages */}
            <main className="flex-1">
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders"   element={<Orders />} />
                <Route path="/admin"    element={<Admin />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
