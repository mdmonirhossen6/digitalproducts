import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar     from './components/Navbar';
import Banner     from './components/Banner';
import Stats      from './components/Stats';
import ProductGrid from './components/ProductGrid';
import CartView   from './components/CartView';
import Footer     from './components/Footer';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart]         = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading]   = useState(true);

  // Load products from JSON
  useEffect(() => {
    fetch('/products.json')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    if (cart.find(c => c.id === product.id)) return;
    setCart(prev => [...prev, product]);
    toast.success(
      <span>
        <strong>{product.icon} {product.name}</strong> added to cart!
      </span>,
      {
        position: 'bottom-right',
        autoClose: 2500,
        hideProgressBar: false,
        pauseOnHover: true,
      }
    );
  };

  const removeFromCart = (id) => {
    const item = cart.find(c => c.id === id);
    setCart(prev => prev.filter(c => c.id !== id));
    if (item) {
      toast.info(`${item.icon} ${item.name} removed from cart.`, {
        position: 'bottom-right',
        autoClose: 2000,
      });
    }
  };

  const checkout = () => {
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-800">
      <ToastContainer theme="dark" />

      <Navbar
        cartCount={cart.length}
        onCartToggle={() => setShowCart(v => !v)}
        showCart={showCart}
      />

      <main className="flex-1">
        {showCart ? (
          <CartView
            cart={cart}
            onRemove={removeFromCart}
            onCheckout={checkout}
          />
        ) : (
          <>
            <Banner />
            <Stats />
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <span className="loading loading-spinner loading-lg text-brand-500" />
              </div>
            ) : (
              <ProductGrid
                products={products}
                cart={cart}
                onAddToCart={addToCart}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
