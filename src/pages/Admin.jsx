import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Package, ShoppingCart, DollarSign, Clock, CheckCircle, XCircle, Plus, Edit3, Trash2, UploadCloud, Layers } from 'lucide-react';
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

  // Modal and CRUD states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add, object = Edit
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    icon: '💻',
    category: 'developer',
    download_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingZip, setUploadingZip] = useState(false);

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

  // Open modal for adding a new product
  function handleOpenAddModal() {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      original_price: '',
      icon: '💻',
      category: 'developer',
      download_url: ''
    });
    setIsModalOpen(true);
  }

  // Open modal for editing a product
  function handleOpenEditModal(p) {
    setEditingProduct(p);
    setProductForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      original_price: p.original_price || '',
      icon: p.icon || '💻',
      category: p.category || 'developer',
      download_url: p.download_url || ''
    });
    setIsModalOpen(true);
  }

  // Submit add or edit form
  async function handleSaveProduct(e) {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      return toast.error("Please enter a name and price.");
    }
    
    setSaving(true);
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
        icon: productForm.icon,
        category: productForm.category,
        download_url: productForm.download_url,
      };

      if (editingProduct) {
        // Edit existing product
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully!");
      } else {
        // Add new product
        const { error } = await supabase
          .from('products')
          .insert({ ...payload, is_active: true });

        if (error) throw error;
        toast.success("Product added successfully!");
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(`Error saving product: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  // Delete product
  async function handleDeleteProduct(id) {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      toast.error(`Error deleting product: ${err.message}`);
    }
  }

  // Handle uploading product image to Supabase Storage
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Upload to 'product-images' bucket
      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setProductForm(prev => ({ ...prev, icon: publicUrl }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(`Image upload failed: ${err.message}. Make sure 'product-images' bucket is created in Supabase storage.`);
    } finally {
      setUploadingImage(false);
    }
  }

  // Handle uploading product zip payload to Supabase Storage
  async function handleZipUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingZip(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `downloads/${fileName}`;

      // Upload to 'downloads' bucket
      const { error } = await supabase.storage
        .from('downloads')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('downloads')
        .getPublicUrl(filePath);

      setProductForm(prev => ({ ...prev, download_url: publicUrl }));
      toast.success("Download file uploaded successfully!");
    } catch (err) {
      toast.error(`Download file upload failed: ${err.message}. Make sure 'downloads' bucket is created in Supabase storage.`);
    } finally {
      setUploadingZip(false);
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
            <div className="space-y-6">
              {/* Add product button bar */}
              <div className="flex justify-end">
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-display font-700 text-sm transition-all duration-300 shadow-md shadow-brand-500/25 active:scale-95"
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-surface-700/30 rounded-2xl border border-white/5">
                  <Package size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold text-lg">No products configured in database</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-surface-700/50 backdrop-blur-xl border border-white/6 rounded-2xl p-5 flex flex-col justify-between hover:border-white/12 transition-all duration-300 glow-border">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-surface-600 border border-white/8 flex items-center justify-center shrink-0 overflow-hidden text-xl">
                            {p.icon && p.icon.startsWith('http') ? (
                              <img src={p.icon} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{p.icon || '💻'}</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-display font-600 text-white text-base leading-snug">{p.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 capitalize">{p.category} · <span className="text-brand-400 font-semibold">${p.price}</span></p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {p.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {p.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 font-mono select-all">ID: {p.id.slice(0, 18)}...</span>
                        <button
                          onClick={() => toggleProduct(p.id, p.is_active)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase border transition-all duration-300 ${p.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'
                            }`}
                        >
                          {p.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CRUD Modal overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/80 backdrop-blur-md animate-fade-in">
            <div className="bg-surface-850 border border-white/8 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
              <h2 className="font-display font-800 text-xl text-white mb-6">
                {editingProduct ? 'Edit Digital Tool' : 'Add New Digital Tool'}
              </h2>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NoteSprint Pro"
                    className="w-full bg-surface-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 outline-none"
                    value={productForm.name}
                    onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Price & Original Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Price (USD)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="39"
                      className="w-full bg-surface-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 outline-none"
                      value={productForm.price}
                      onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Original Price (optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="59"
                      className="w-full bg-surface-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 outline-none"
                      value={productForm.original_price}
                      onChange={e => setProductForm(prev => ({ ...prev, original_price: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Category</label>
                  <select
                    className="w-full bg-surface-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 outline-none"
                    value={productForm.category}
                    onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="developer">Developer Tools</option>
                    <option value="seo">SEO & Marketing</option>
                    <option value="ai">AI Tools</option>
                    <option value="graphics">Design & Graphics</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Short description of the software features..."
                    className="w-full bg-surface-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 outline-none"
                    value={productForm.description}
                    onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Icon / Image upload */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Product Icon (Emoji, URL or Upload file)</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. 💻 or https://..."
                      className="flex-1 bg-surface-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 outline-none"
                      value={productForm.icon}
                      onChange={e => setProductForm(prev => ({ ...prev, icon: e.target.value }))}
                    />
                    <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors">
                      <UploadCloud size={14} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                {/* Download url / file upload */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Download Payload URL (.zip package)</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="https://delivery.digitools.cloud/..."
                      className="flex-1 bg-surface-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 outline-none"
                      value={productForm.download_url}
                      onChange={e => setProductForm(prev => ({ ...prev, download_url: e.target.value }))}
                    />
                    <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition-colors">
                      <UploadCloud size={14} />
                      <span>{uploadingZip ? 'Uploading...' : 'Upload Zip'}</span>
                      <input
                        type="file"
                        accept=".zip,.rar,.tar"
                        className="hidden"
                        onChange={handleZipUpload}
                        disabled={uploadingZip}
                      />
                    </label>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploadingImage || uploadingZip}
                    className="flex items-center justify-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-xs text-white" />
                    ) : (
                      <>
                        <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                        <CheckCircle size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
