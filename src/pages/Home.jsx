import { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import Stats from '../components/Stats';
import ProductGrid from '../components/ProductGrid';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        // Try fetching from Supabase table
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (error || !data || data.length === 0) {
          // Fallback to products.json
          const res = await fetch('/products.json');
          const localData = await res.json();
          setProducts(localData);
        } else {
          setProducts(data);
        }
      } catch (err) {
        // Safe fallback
        try {
          const res = await fetch('/products.json');
          const localData = await res.json();
          setProducts(localData);
        } catch (_) {
          console.error("Failed to load products completely");
        }
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-surface-800">
      <Banner />
      <Stats />
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <span className="loading loading-spinner loading-lg text-brand-500" />
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
