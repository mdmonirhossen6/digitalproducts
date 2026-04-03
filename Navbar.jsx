import { Users, Package, Star, Download } from 'lucide-react';

const stats = [
  { icon: <Users size={22} className="text-brand-400" />, value: '48,000+', label: 'Happy Customers' },
  { icon: <Package size={22} className="text-cyan-400" />, value: '120+', label: 'Digital Products' },
  { icon: <Star size={22} className="text-amber-400" />, value: '4.9 / 5', label: 'Average Rating' },
  { icon: <Download size={22} className="text-emerald-400" />, value: '200k+', label: 'Total Downloads' },
];

export default function Stats() {
  return (
    <section className="relative py-12 border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/3 via-transparent to-cyan-500/3" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon, value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center text-center p-6 rounded-2xl bg-surface-700/50 border border-white/5 glow-border animate-fade-up stagger-${i + 1}`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                {icon}
              </div>
              <div className="font-display font-700 text-2xl text-white mb-0.5">{value}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
