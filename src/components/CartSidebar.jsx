import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Package, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartSidebar({ isOpen, onClose }) {
  const { items, removeItem, total } = useCart();
  const { user } = useAuth();
  const originalTotal = items.reduce((s, i) => s + (i.originalPrice || i.price), 0);
  const savings = originalTotal - total;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-surface-800 border-l border-white/5 shadow-2xl">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <ShoppingBag size={15} className="text-brand-400" />
                </div>
                <span className="font-display font-700 text-lg text-white">Your Cart</span>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 py-6 overflow-y-auto px-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface-700 border border-white/5 flex items-center justify-center mb-4">
                    <Package size={24} className="text-slate-500" />
                  </div>
                  <h3 className="font-display font-600 text-slate-300 mb-1">Your cart is empty</h3>
                  <p className="text-slate-500 text-xs max-w-[200px]">Add premium tools to jumpstart your workflow!</p>
                </div>
              ) : (
                items.map((item) => {
                  const itemDiscount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-700/50 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-surface-600 border border-white/8 flex items-center justify-center text-2xl shrink-0">
                        {item.icon}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="font-display font-600 text-white text-sm truncate">{item.name}</h4>
                          {itemDiscount > 0 && (
                            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-medium shrink-0">
                              −{itemDiscount}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </div>

                      {/* Pricing and Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-display font-700 text-white">${item.price}</div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-[10px] text-slate-500 line-through">${item.originalPrice}</div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-white/5 bg-surface-700/30 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal</span>
                    <span>${originalTotal}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-xs text-emerald-400">
                      <span className="flex items-center gap-1"><Tag size={12} /> Discount Applied</span>
                      <span>−${savings}</span>
                    </div>
                  )}
                  <div className="h-px bg-white/5 my-1" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-600 text-white text-sm">Total</span>
                    <span className="font-display font-700 text-2xl text-white">${total}</span>
                  </div>
                </div>

                {/* Checkout Navigation */}
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-display font-700 text-sm bg-brand-500 hover:bg-brand-600 text-white transition-all duration-300 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </Link>

                <p className="text-center text-[10px] text-slate-500">
                  🔒 Secure checkout via bKash · Instant bot notification
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
