import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Package, ShoppingCart, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const STATUS_COLOR = {
  pending:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  rejected:  'bg-rose-500/10 text-rose-400 border border-rose-500/20',
};

export default function Admin() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate    = useNavigate();
  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab]           = useState('orders');
  const [stats, setStats]       = useState({ totalSales: 0, pendingCount: 0, confirmedCount: 0 });

  useEffect(() => {
    if (!authLoading) {
      if (!isAdmin) {
        toast.error("Access denied. Admin authorization required.");
        navigate('/');
      } else {
        fetchOrders();
        fetchProducts();
      }
    }
  }, [authLoading, isAdmin]);

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    const orderData = data || [];
    setOrders(orderData);

    // Calculate quick stats
    const totalSales = orderData
      .filter(o => o.status === 'confirmed')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const pendingCount = orderData.filter(o => o.status === 'pending').length;
    const confirmedCount = orderData.filter(o => o.status === 'confirmed').length;

    setStats({ totalSales, pendingCount, confirmedCount });
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*');
    setProducts(data || []);
  }

  async function updateOrderStatus(id, status) {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;

      toast.success(`Order successfully marked as ${status}!`);
      fetchOrders();
    } catch (err) {
      toast.error(`Error updating order status: ${err.message}`);
    }
  }

  async function toggleProduct(id, is_active) {
    try {
      const { error } = await supabase.from('products').update({ is_active: !is_active }).eq('id', id);
      if (error) throw error;

      toast.success(`Product visibility updated!`);
      fetchProducts();
    } catch (err) {
      toast.error(`Error updating product: ${err.message}`);
    }
  }

  return (
    <div className="min-h-screen bg-surface-800 text-white pt-24 p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-50 pointer-events-none" />
      <div className="absolute w-[800px] h-[550px] rounded-full bg-brand-500/5 blur-3xl top-10 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-up stagger-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Shield size={22} className="text-rose-400" />
          </div>
          <div>
            <h1 className="font-display font-800 text-3xl text-white">Admin Dashboard</h1>
            <p className="text-xs text-slate-500">Manage premium store orders and digital arsenals</p>
          </div>
        </div>

        {/* Metric widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-fade-up stagger-2">
          {/* revenue */}
          <div className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Total Sales</span>
              <h2 className="text-2xl font-display font-700 text-emerald-400">${stats.totalSales}</h2>
            </div>
          </div>
          {/* pending */}
          <div className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Pending Confirmation</span>
              <h2 className="text-2xl font-display font-700 text-amber-400">{stats.pendingCount} orders</h2>
            </div>
          </div>
          {/* confirmed */}
          <div className="bg-surface-700/60 backdrop-blur-xl border border-white/6 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CheckCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Completed Orders</span>
              <h2 className="text-2xl font-display font-700 text-cyan-400">{stats.confirmedCount} delivered</h2>
            </div>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex gap-3 mb-8 animate-fade-up stagger-3">
          {['orders', 'products'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-display font-600 capitalize transition-all duration-300
                ${tab === t
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                  : 'bg-surface-700/40 hover:bg-surface-700 text-slate-400 hover:text-white border border-white/5'
                }`}
            >
              {t === 'orders' ? 'Manage Orders' : 'Catalog Toggles'}
            </button>
          ))}
        </div>

        {/* Tab display */}
        <div className="space-y-4 animate-fade-up stagger-4">
          {tab === 'orders' && (
            orders.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <ShoppingCart size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-lg">No orders placed yet</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-surface-700/50 backdrop-blur-xl border border-white/6 rounded-2xl p-6 glow-border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-white text-base">{order.user_email}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{order.id} · {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-display font-600 uppercase tracking-wider ${STATUS_COLOR[order.status]}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-y border-white/5 text-sm mb-4">
                    <div>
                      <span className="text-xs text-slate-500 block">bKash Phone Number</span>
                      <strong className="text-white font-mono text-base">{order.bkash_number}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Transaction ID (TrxID)</span>
                      <strong className="text-white font-mono text-base tracking-wide select-all">{order.bkash_trx_id}</strong>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs text-slate-500 block mb-1.5">Purchased Tools</span>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                          <span className="text-slate-500">(${item.price})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="text-sm">
                      <span className="text-slate-500">Order Revenue:</span> <strong className="text-brand-400 text-lg font-display font-700">${order.total_amount}</strong>
                    </div>

                    {order.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-surface-900 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                        >
                          <CheckCircle size={15} /> Confirm
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'rejected')}
                          className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                        >
                          <XCircle size={15} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )
          )}

          {tab === 'products' && (
            products.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <Package size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-lg">No products configured in database</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-surface-700/50 backdrop-blur-xl border border-white/6 rounded-2xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-surface-600 border border-white/8 flex items-center justify-center text-xl shrink-0">
                        {p.icon}
                      </div>
                      <div>
                        <h4 className="font-display font-600 text-white text-sm">{p.name}</h4>
                        <p className="text-xs text-slate-500">{p.category} · <span className="text-brand-400 font-semibold">${p.price}</span></p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleProduct(p.id, p.is_active)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase border transition-all duration-300 ${p.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'
                        }`}
                    >
                      {p.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
