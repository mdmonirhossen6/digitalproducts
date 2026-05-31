import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

export default function Banner() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-100" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-32 right-10 w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-20 left-10 w-56 h-56 rounded-full bg-purple-500/5 blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Floating orbs */}
      <div className="absolute top-16 right-[20%] w-3 h-3 rounded-full bg-brand-500/60 animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-32 right-[35%] w-2 h-2 rounded-full bg-cyan-400/60 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-20 left-[25%] w-2.5 h-2.5 rounded-full bg-purple-400/60 animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-medium mb-8 animate-fade-up stagger-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          New tools added every week
          <ArrowRight size={12} />
        </div>

        <h1 className="font-display font-800 text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6 animate-fade-up stagger-2">
          Premium Digital Tools
          <br />
          <span className="text-gradient">Built to Accelerate</span>
        </h1>

        <p className="max-w-xl mx-auto text-slate-400 text-lg leading-relaxed mb-10 animate-fade-up stagger-3">
          Handpicked software & tools to boost your workflow. One-time purchase, lifetime value — no subscriptions, no surprises.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up stagger-4">
          <a href="#products" className="w-full sm:w-auto btn bg-brand-500 hover:bg-brand-600 text-white border-0 px-8 rounded-xl shadow-lg shadow-brand-500/25 font-body font-medium gap-2">
            Browse All Tools <ArrowRight size={16} />
          </a>
          <a href="#" className="w-full sm:w-auto btn bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 rounded-xl font-body font-medium">
            View Bundles
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-up stagger-5">
          {[
            { icon: <Star size={14} className="text-amber-400" fill="#f59e0b" />, text: '4.9/5 from 12k+ reviews' },
            { icon: <Shield size={14} className="text-emerald-400" />, text: '30-day money back' },
            { icon: <Zap size={14} className="text-cyan-400" />, text: 'Instant digital delivery' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
              {icon}
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
