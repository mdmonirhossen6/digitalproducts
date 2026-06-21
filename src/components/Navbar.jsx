import { Link } from 'react-router-dom';
import { ShoppingCart, Zap, LogOut, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onCartToggle }) {
  const { user, signOut, isAdmin } = useAuth();
  const { items } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 backdrop-blur-xl bg-surface-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-700 text-lg text-white tracking-tight">
              Digi<span className="text-gradient">Tools</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">
              Home
            </Link>
            <Link to="/orders" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">
              My Purchases
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors duration-200">
                <ShieldAlert size={14} /> Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all duration-300 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-cyan-400 text-surface-900 text-[10px] font-display font-bold leading-none animate-bounce">
                  {items.length}
                </span>
              )}
            </button>

            {/* Auth / Account */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-medium text-slate-300 max-w-[150px] truncate">{user.email}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{isAdmin ? 'Admin User' : 'Customer'}</span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:text-red-300 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-xl transition-all duration-300 shadow-md shadow-brand-500/20"
              >
                <User size={14} />
                <span>Sign In</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
