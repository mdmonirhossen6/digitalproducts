import { useState } from 'react';
import ProductCard from './ProductCard';

const CATEGORIES = ['All', 'Productivity', 'Design', 'Security', 'Analytics', 'AI Tools', 'Media', 'Developer', 'No-Code', 'Storage'];

export default function ProductGrid({ products, cart, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  const cartIds = new Set(cart.map(c => c.id));

  return (
    <section id="products" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 animate-fade-up stagger-1">
          <h2 className="font-display font-700 text-3xl sm:text-4xl text-white mb-3">
            Our <span className="text-gradient">Digital Arsenal</span>
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Professional-grade tools at indie prices. Buy once, use forever.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-up stagger-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/8'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                inCart={cartIds.has(product.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-600">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-display font-600 text-lg">No tools in this category yet</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
