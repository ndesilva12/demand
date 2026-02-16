'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Avatar component - generates colored initials
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const colors = ['#00aaff', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: colors[colorIndex],
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
  );
}

// Toast system
let toastTimeout: NodeJS.Timeout;
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const existing = document.getElementById('global-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'global-toast';
  toast.className = `fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all duration-300 ${
    type === 'success' ? 'bg-[#22c55e] text-white' :
    type === 'error' ? 'bg-[#ef4444] text-white' :
    'bg-[#00aaff] text-white'
  }`;
  toast.style.animation = 'toast-in 0.3s ease-out';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '/' && !e.metaKey) {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        window.location.href = '/create';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { href: '/demands', label: 'Demands', icon: '📋' },
    { href: '/pressure-board', label: 'Pressure Board', icon: '📊' },
    { href: '/coalitions', label: 'Coalitions', icon: '🤝' },
    { href: '/victories', label: 'Victories', icon: '🏆' },
    { href: '/companies', label: 'Companies', icon: '🏢' },
  ];

  const mobileNavItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/demands', label: 'Demands', icon: '📋' },
    { href: '/create', label: 'Create', icon: '➕', accent: true },
    { href: '/pressure-board', label: 'Board', icon: '📊' },
    { href: user ? '/dashboard' : '/login', label: user ? 'Profile' : 'Login', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#222222]/50 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
              <span className="text-[#00aaff]">demand</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-[#00aaff] bg-[#00aaff]/10'
                      : 'text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/create"
                    className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-[#00aaff]/20"
                  >
                    + New Demand
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Avatar name={user.displayName || user.email || 'User'} size={32} />
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[#a0a0a0] hover:text-white text-sm font-medium transition-colors px-3 py-2">
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-[#00aaff] hover:bg-[#0088cc] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-[#00aaff]/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
              aria-label="Menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#111111] z-50 md:hidden animate-slide-in border-l border-[#222222]">
            <div className="p-6 pt-20">
              {user && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#222222]">
                  <Avatar name={user.displayName || 'User'} size={40} />
                  <div>
                    <div className="font-medium text-sm">{user.displayName || 'User'}</div>
                    <div className="text-xs text-[#666666]">{user.email}</div>
                  </div>
                </div>
              )}
              <nav className="space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname === link.href
                        ? 'text-[#00aaff] bg-[#00aaff]/10'
                        : 'text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-[#222222] mt-4">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a]">
                        <span>📱</span> Dashboard
                      </Link>
                      <Link href="/create" className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm font-medium bg-[#00aaff] text-white">
                        <span>➕</span> New Demand
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a]">
                        Log in
                      </Link>
                      <Link href="/signup" className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl text-sm font-medium bg-[#00aaff] text-white">
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main content with top padding for fixed header */}
      <main className="pt-16 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#111111]/95 backdrop-blur-xl border-t border-[#222222]/50">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg min-w-[56px] transition-all ${
                item.accent
                  ? 'text-white -mt-4'
                  : pathname === item.href
                  ? 'text-[#00aaff]'
                  : 'text-[#666666]'
              }`}
            >
              {item.accent ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00aaff] to-[#0066cc] flex items-center justify-center text-xl shadow-lg shadow-[#00aaff]/30">
                  {item.icon}
                </div>
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Floating Create Button (desktop) */}
      <Link
        href="/create"
        className="hidden md:flex fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#00aaff] to-[#0066cc] items-center justify-center text-white text-2xl shadow-2xl shadow-[#00aaff]/30 hover:scale-110 transition-transform"
        title="Create Demand"
      >
        +
      </Link>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 md:bottom-24 right-4 md:right-8 z-30 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#222222] flex items-center justify-center text-[#a0a0a0] hover:text-white hover:border-[#00aaff] transition-all shadow-lg"
        >
          ↑
        </button>
      )}

      {/* Footer (desktop only, above mobile nav) */}
      <footer className="hidden md:block border-t border-[#1e1e1e] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold text-[#00aaff] mb-4">demand</div>
              <p className="text-sm text-[#666666] leading-relaxed">
                Consumer-powered corporate accountability. Organize demands, force change, win victories.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-4">Platform</div>
              <div className="space-y-2">
                <Link href="/demands" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Browse Demands</Link>
                <Link href="/create" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Create Demand</Link>
                <Link href="/pressure-board" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Pressure Board</Link>
                <Link href="/coalitions" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Coalitions</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-4">Resources</div>
              <div className="space-y-2">
                <Link href="/victories" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Victories</Link>
                <Link href="/companies" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Company Profiles</Link>
                <Link href="/weekly" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Weekly Digest</Link>
                <Link href="/templates" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Templates</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider mb-4">Legal</div>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">About</Link>
                <Link href="/privacy" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-[#666666] hover:text-[#00aaff] transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1e1e1e] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[#666666]">
              © 2026 Demand. Empowering consumers to create change.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#444444]">Press <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] border border-[#222222] rounded text-[10px]">/</kbd> to search · <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] border border-[#222222] rounded text-[10px]">n</kbd> new demand</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
