import { ShoppingCart, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BADGE_CLASS = {
  Bestseller: 'badge-bestseller',
  New:        'badge-new',
  Hot:        'badge-hot',
  Sale:       'badge-sale',
  Popular:    'badge-popular',
  Trending:   'badge-trending',
};

export default function ProductCard({ product, index }) {
  const { items, addItem } = useCart();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const inCart = items.some(item => item.id === product.id);

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-surface-700 border border-white/6 glow-border card-hover overflow-hidden animate-fade-up stagger-${Math.min(index + 1, 10)}`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header area */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-surface-600 border border-white/8 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform duration-300">
            {product.icon}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {product.badge && (
              <span className={`text-[10px] font-display font-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider ${BADGE_CLASS[product.badge] || ''}`}>
                {product.badge}
              </span>
            )}
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
              −{discount}%
            </span>
          </div>
        </div>

        {/* Name & Category */}
        <div className="mb-1">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{product.category}</span>
          <h3 className="font-display font-600 text-white text-lg leading-tight mt-0.5 group-hover:text-gradient transition-all duration-300">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={11}
                className={s <= Math.round(product.rating) ? 'text-amber-400' : 'text-slate-600'}
                fill={s <= Math.round(product.rating) ? '#f59e0b' : 'transparent'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">{product.rating} <span className="text-slate-600">({product.reviews.toLocaleString()})</span></span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-white/5" />

      {/* Features */}
      <div className="p-6 pt-4 flex-1">
        <ul className="space-y-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
              <Check size={13} className="text-brand-400 mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-display font-700 text-2xl text-white">${product.price}</div>
            <div className="text-sm text-slate-600 line-through">${product.originalPrice}</div>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <div>One-time</div>
            <div>payment</div>
          </div>
        </div>

        <button
          onClick={() => addItem(product)}
          disabled={inCart}
          className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-display font-600 text-sm transition-all duration-300 ${
            inCart
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 cursor-default'
              : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95'
          }`}
        >
          {inCart ? (
            <>
              <Check size={15} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart size={15} />
              Buy Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
