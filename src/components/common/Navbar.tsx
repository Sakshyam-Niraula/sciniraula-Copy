import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Bookmark, Search, Compass, FlaskConical, Atom, Sigma, Dna, Menu, X, Sparkles } from 'lucide-react';
import { SubjectId } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, subParam?: any) => void;
  bookmarkCount: number;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  bookmarkCount,
  onOpenSearch,
  onOpenBookmarks,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const subjects: { id: SubjectId; name: string; icon: any; color: string }[] = [
    { id: 'physics', name: 'Physics', icon: Atom, color: 'text-sky-400' },
    { id: 'mathematics', name: 'Mathematics', icon: Sigma, color: 'text-violet-400' },
    { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: 'text-cyan-400' },
    { id: 'biology', name: 'Biology', icon: Dna, color: 'text-emerald-400' },
  ];

  const handleNav = (view: string, param?: any) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070b14]/80 backdrop-blur-md border-b border-sky-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center text-left focus:outline-none group"
        >
          <BrandLogo size="md" showTagline={false} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => handleNav('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentView === 'dashboard'
                ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-400" />
            Dashboard
          </button>

          {/* Subjects */}
          {subjects.map((sub) => {
            const Icon = sub.icon;
            const isActive = currentView === `subject-${sub.id}`;
            return (
              <button
                key={sub.id}
                onClick={() => handleNav('subject', sub.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${sub.color}`} />
                {sub.name}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-sky-500/40 transition-colors flex items-center gap-2 text-xs"
            title="Search experiments (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span className="hidden lg:inline text-slate-400">Search labs...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-sky-500/40 transition-colors"
            title="Saved experiments"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleNav('experiment', 'projectile-motion')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Launch Lab</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-[#0b1120] border-b border-sky-500/15">
          <button
            onClick={() => handleNav('dashboard')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-sky-400" />
            Dashboard
          </button>
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <button
                key={sub.id}
                onClick={() => handleNav('subject', sub.id)}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <Icon className={`w-4 h-4 ${sub.color}`} />
                {sub.name} Laboratory
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => handleNav('experiment', 'projectile-motion')}
              className="w-full py-2 px-3 rounded-lg text-sm font-semibold text-center bg-gradient-to-r from-sky-500 to-blue-600 text-white"
            >
              Launch Projectile Motion Lab
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
