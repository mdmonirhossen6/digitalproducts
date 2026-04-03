import { ShoppingCart, Zap, X } from 'lucide-react';

export default function Navbar({ cartCount, onCartToggle, showCart }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl bg-surface-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => showCart && onCartToggle()}>
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-700 text-lg text-white tracking-tight">
              Digi<span className="text-gradient">Tools</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {['Products', 'Pricing', 'Blog', 'Support'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Sign In
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                showCart
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {showCart ? (
                <>
                  <X size={16} />
                  <span className="hidden sm:inline">Close Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span className="hidden sm:inline">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-cyan-400 text-surface-900 text-xs font-display font-bold leading-none animate-bounce-once">
                      {cartCount}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
