import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { notifyOrder } from '../lib/telegram';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guestEmail, setGuestEmail] = useState('');
  const [bkashNum, setBkashNum] = useState('');
  const [trxId, setTrxId]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const BKASH_NUMBER = import.meta.env.VITE_BKASH_NUMBER || '017XXXXXXXX';
  const originalTotal = items.reduce((s, i) => s + (i.originalPrice || i.price), 0);
  const savings = originalTotal - total;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!bkashNum || !trxId) return setError('Please fill in both fields.');
    
    const emailToUse = user ? user.email : guestEmail;
    if (!emailToUse) return setError('Please enter your email address.');
    
    setError('');
    setLoading(true);

    try {
      const { data: order, error: err } = await supabase
        .from('orders')
        .insert({
          user_id:     user?.id || null,
          user_email:  emailToUse,
          items:       items,
          total_amount: total,
          bkash_number: bkashNum,
          bkash_trx_id: trxId,
          status:      'pending'
        })
        .select()
        .single();

      if (err) throw err;

      // Save guest order locally to track it easily without account signup
      if (!user) {
        const existingGuestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
        existingGuestOrders.push({ id: order.id, email: emailToUse, trxId: trxId });
        localStorage.setItem('guest_orders', JSON.stringify(existingGuestOrders));
      }

      // Notify Bot
      await notifyOrder(order);

      toast.success('🎉 Order submitted! Confirming your bKash payment now.', {
        position: 'top-center',
        autoClose: 5000,
      });

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message || 'Failed to submit order. Please try again.');
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-800 text-white p-6 pt-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-50 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to marketplace</span>
        </button>

        <h1 className="font-display font-800 text-3xl text-white mb-8">
          Checkout <span className="text-gradient">Arsenal</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Summary & bKash details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Order Items */}
            <div className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
              <h2 className="font-display font-600 text-lg text-white mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-400" />
                <span>Selected Tools</span>
              </h2>
              <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 capitalize">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-brand-400">${item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-[10px] text-slate-600 line-through">${item.originalPrice}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* bKash instructions */}
            <div className="bg-gradient-to-r from-pink-950/40 to-pink-900/10 border border-pink-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-display font-900">
                  bK
                </div>
                <div>
                  <h2 className="font-display font-700 text-pink-400 text-lg">bKash Send Money</h2>
                  <p className="text-xs text-pink-500/80">Zero-subscription, pay once, own forever</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  Please send the equivalent BDT amount for <strong className="text-white">${total}</strong> to our bKash personal wallet:
                </p>
                <div className="bg-surface-900/60 rounded-xl p-4 flex items-center justify-between border border-pink-500/10">
                  <div>
                    <span className="text-xs text-slate-500 block">bKash Personal Number</span>
                    <span className="text-xl font-mono font-700 text-pink-400 select-all">{BKASH_NUMBER}</span>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                    Send Money
                  </span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  💡 After successful transfer, keep note of the <strong className="text-slate-400">Sender Mobile Number</strong> and <strong className="text-slate-400">Transaction ID (TrxID)</strong>. Enter them on the right to place your order.
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Payment details form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price calculation summary */}
            <div className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
              <h3 className="font-display font-600 text-sm text-slate-400 mb-4 uppercase tracking-wider">Summary</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>${originalTotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span className="flex items-center gap-1.5"><Tag size={12} /> Discounts applied</span>
                    <span>−${savings}</span>
                  </div>
                )}
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-display font-600 text-white">Total</span>
                  <span className="font-display font-700 text-3xl text-gradient">${total}</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
                  <p className="text-xs text-emerald-400 font-medium">
                    🎉 You save <span className="font-display font-700">${savings}</span> on this order!
                  </p>
                </div>
              )}
            </div>

            {/* Verification Form */}
            <div className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-6">
              <h3 className="font-display font-600 text-base text-white mb-4">Complete Your Order</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!user && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Your Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@example.com"
                      className="w-full bg-surface-600/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all duration-200"
                      value={guestEmail}
                      onChange={e => setGuestEmail(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Your bKash Number (Sender)</label>
                  <input
                    type="text"
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-surface-600/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all duration-200"
                    value={bkashNum}
                    onChange={e => setBkashNum(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Transaction ID (TrxID)</label>
                  <input
                    type="text"
                    required
                    placeholder="ABC1234567"
                    className="w-full bg-surface-600/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all duration-200"
                    value={trxId}
                    onChange={e => setTrxId(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-display font-700 text-sm bg-brand-500 hover:bg-brand-600 text-white transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/45 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs text-white" />
                  ) : (
                    <>
                      <span>Place My Order</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Verified bKash Secure Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
