@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    box-sizing: border-box;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family: 'DM Sans', sans-serif;
    background-color: #0e0e1a;
    color: #e2e8f0;
    overflow-x: hidden;
  }
  h1, h2, h3, h4, h5 {
    font-family: 'Syne', sans-serif;
  }
}

@layer components {
  .card-hover {
    @apply transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl;
  }
  .glow-border {
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.08);
  }
  .glow-border:hover {
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.6), 0 0 40px rgba(99, 102, 241, 0.15);
  }
  .text-gradient {
    background: linear-gradient(135deg, #6366f1 0%, #22d3ee 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .badge-bestseller { @apply bg-amber-500/20 text-amber-400 border border-amber-500/30; }
  .badge-new       { @apply bg-emerald-500/20 text-emerald-400 border border-emerald-500/30; }
  .badge-hot       { @apply bg-rose-500/20 text-rose-400 border border-rose-500/30; }
  .badge-sale      { @apply bg-cyan-500/20 text-cyan-400 border border-cyan-500/30; }
  .badge-popular   { @apply bg-purple-500/20 text-purple-400 border border-purple-500/30; }
  .badge-trending  { @apply bg-indigo-500/20 text-indigo-400 border border-indigo-500/30; }
}

/* Subtle noise texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}

/* React-Toastify overrides */
.Toastify__toast {
  font-family: 'DM Sans', sans-serif;
  background: #1c1c2e !important;
  border: 1px solid rgba(99, 102, 241, 0.3) !important;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.12) !important;
  color: #e2e8f0 !important;
  border-radius: 12px !important;
}
.Toastify__toast--success .Toastify__toast-icon svg { fill: #10b981; }
.Toastify__progress-bar { background: linear-gradient(90deg, #6366f1, #22d3ee) !important; }
.Toastify__close-button { color: #94a3b8 !important; }

/* Stagger animation helpers */
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.10s; }
.stagger-3 { animation-delay: 0.15s; }
.stagger-4 { animation-delay: 0.20s; }
.stagger-5 { animation-delay: 0.25s; }
.stagger-6 { animation-delay: 0.30s; }
.stagger-7 { animation-delay: 0.35s; }
.stagger-8 { animation-delay: 0.40s; }
.stagger-9 { animation-delay: 0.45s; }
.stagger-10 { animation-delay: 0.50s; }

.animate-fade-up {
  opacity: 0;
  animation: fadeUp 0.55s ease forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
