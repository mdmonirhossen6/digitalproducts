import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Download, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const STATUS_COLOR = {
  pending:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  rejected:  'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Please sign in to view your purchases.");
        navigate('/login');
      } else {
        fetchUserOrders();
      }
    }
  }, [authLoading, user]);

  async function fetchUserOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      toast.error(`Error loading purchases: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-800 text-white pt-24 p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-50 pointer-events-none" />
      <div className="absolute w-[800px] h-[550px] rounded-full bg-brand-500/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 animate-fade-up">
        {/* Navigation */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to marketplace</span>
        </button>

        <h1 className="font-display font-800 text-3xl text-white mb-8">
          My <span className="text-gradient">Purchases</span>
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-brand-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-12 text-center">
            <ShoppingBag size={48} className="mx-auto mb-4 text-slate-600" />
            <h3 className="font-display font-600 text-xl text-slate-300 mb-2">No purchases found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              You haven't bought any premium digital tools yet. Explore our marketplace and secure your one-time licenses!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-brand-500/20"
            >
              Browse Digital Arsenal
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-6 glow-border"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">ORDER ID: {order.id.slice(0, 18)}...</span>
                    <span className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-display font-600 uppercase tracking-wider ${STATUS_COLOR[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-2">Selected Tools</span>
                    <div className="divide-y divide-white/5">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                              <p className="text-[10px] text-slate-500 capitalize">{item.category}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-slate-300">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-xs text-slate-500">Transaction TrxID:</span> <code className="text-xs text-slate-300 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">{order.bkash_trx_id}</code>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-500">Paid:</span> <strong className="text-brand-400 font-display font-700 text-lg">${order.total_amount}</strong>
                    </div>
                  </div>

                  {/* Confirmed Dashboard Area with Downloads */}
                  {order.status === 'confirmed' ? (
                    <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                      <div className="flex items-center gap-2 mb-3 text-emerald-400 font-display font-700 text-sm">
                        <ShieldCheck size={18} />
                        <span>🔑 Access Granted — Instant Delivery Dashboard</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4">
                        Your payment has been successfully confirmed. You can now download the packages or copy your deployment keys below:
                      </p>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-surface-900/60 p-3 rounded-lg border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <span className="text-xs font-semibold text-white flex items-center gap-2">
                              <span>{item.icon}</span>
                              <span>{item.name} License Pack</span>
                            </span>
                            <a
                              href={`https://delivery.digitools.cloud/download/${item.id}?license=${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => {
                                e.preventDefault();
                                toast.success(`📥 Starting download for ${item.name}!`);
                              }}
                              className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-surface-900 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                            >
                              <Download size={13} />
                              <span>Download Zip</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : order.status === 'pending' ? (
                    <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 text-xs text-slate-400 leading-relaxed">
                      <HelpCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        Your bKash transaction confirmation is currently being verified by an administrator. This usually takes <strong className="text-slate-300">5-10 minutes</strong>. Once confirmed, download access keys will appear here instantly, and you'll receive updates.
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex gap-3 text-xs text-rose-400/80 leading-relaxed">
                      <HelpCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        This order was rejected due to an invalid Transaction ID or sender details. Please double-check your receipt details or contact support for manual routing.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
