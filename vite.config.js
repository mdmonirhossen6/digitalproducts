import { Trash2, ShoppingBag, ArrowRight, Package, Tag } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CartView({ cart, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const savings = cart.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);

  const handleCheckout = () => {
    onCheckout();
    toast.success('🎉 Order placed! Check your email for download links.', {
      position: 'top-center',
      autoClose: 4000,
    });
  };

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 animate-fade-up stagger-1">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
            <ShoppingBag size={18} className="text-brand-400" />
          </div>
          <div>
            <h2 className="font-display font-700 text-2xl text-white">Your Cart</h2>
            <p className="text-sm text-slate-500">{cart.length} {cart.length === 1 ? 'item' : 'items'} selected</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 animate-fade-up stagger-2">
            <div className="w-20 h-20 rounded-2xl bg-surface-600 border border-white/6 flex items-center justify-center mx-auto mb-5">
              <Package size={32} className="text-slate-600" />
            </div>
            <h3 className="font-display font-600 text-xl text-slate-400 mb-2">Your cart is empty</h3>
            <p className="text-slate-600 text-sm">Add some tools to get started</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items list */}
            <div className="flex-1 space-y-4">
              {cart.map((item, index) => {
                const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-5 rounded-2xl bg-surface-700 border border-white/6 glow-border animate-fade-up stagger-${Math.min(index + 2, 10)}`}
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-surface-600 border border-white/8 flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-display font-600 text-white text-sm truncate">{item.name}</h4>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium shrink-0">
                          −{discount}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{item.category} · One-time license</p>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="font-display font-700 text-white">${item.price}</div>
                        <div className="text-xs text-slate-600 line-through">${item.originalPrice}</div>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-all duration-200 active:scale-90"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="lg:w-72 animate-fade-up stagger-4">
              <div className="rounded-2xl bg-surface-700 border border-white/6 p-6 sticky top-24">
                <h3 className="font-display font-700 text-white mb-5">Order Summary</h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal ({cart.length} items)</span>
                    <span className="text-white">${cart.reduce((s, i) => s + i.originalPrice, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Tag size={12} />
                      Discounts applied
                    </span>
                    <span className="text-emerald-400">−${savings}</span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between">
                    <span className="font-display font-600 text-white">Total</span>
                    <span className="font-display font-700 text-2xl text-white">${total}</span>
                  </div>
                </div>

                <div className="mb-4 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
                  <p className="text-xs text-emerald-400 font-medium">
                    🎉 You save <span className="font-display font-700">${savings}</span> on this order!
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-display font-700 text-sm bg-brand-500 hover:bg-brand-600 text-white transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-95"
                >
                  Proceed to Checkout
                  <ArrowRight size={15} />
                </button>

                <p className="text-center text-xs text-slate-600 mt-3">
                  🔒 Secure payment · Instant delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
