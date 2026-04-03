import { Zap, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  Products: ['Productivity', 'Design', 'Developer Tools', 'AI Tools', 'Security', 'Analytics'],
  Company:  ['About Us', 'Blog', 'Careers', 'Press Kit'],
  Support:  ['Help Center', 'Contact Us', 'Refund Policy', 'Affiliate Program'],
  Legal:    ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Licenses'],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-800/50 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-700 text-lg text-white">
                Digi<span className="text-gradient">Tools</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-xs">
              Premium digital tools for creators, developers, and businesses. Buy once, own forever.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-600 text-white text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-white/5">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} DigiTools. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
            <span>Made with</span>
            <span className="text-rose-500">♥</span>
            <span>for makers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
