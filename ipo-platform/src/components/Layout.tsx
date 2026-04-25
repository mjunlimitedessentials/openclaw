import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ExitDisclaimer } from './ExitDisclaimer';
import { AlertTriangle } from 'lucide-react';

export function Layout() {
  const [exitUrl, setExitUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http://') || href.startsWith('https://')) {
        e.preventDefault();
        e.stopPropagation();
        setExitUrl(href);
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Persistent disclaimer banner */}
      <div className="border-t border-white/5 bg-black/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-amber-500/50 flex-shrink-0" />
            <span>
              Educational use only — not financial advice. Not affiliated with ThinkBox AI Operating
              Systems or MJUnlimited Essential Mktg. Users are solely responsible for any trading decisions.
            </span>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/terms" className="text-primary/70 hover:text-primary transition-colors">
              Terms &amp; IP
            </Link>
            <span>© 2025 IPO Insider</span>
          </div>
        </div>
      </div>

      <ExitDisclaimer url={exitUrl} onClose={() => setExitUrl(null)} />
    </div>
  );
}
