import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Atom, Sigma, FlaskConical, Dna, ShieldCheck, Cpu } from 'lucide-react';
import { SubjectId } from '../../types';

interface FooterProps {
  onNavigate: (view: string, subParam?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#05080f] border-t border-sky-500/10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-slate-400 text-xs leading-relaxed pt-2">
              SciNiraula is a next-generation AI-enhanced virtual STEM laboratory. Interactive simulations powered by rigorous mathematical equations and contextual scientific intelligence.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-sky-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scientifically Rigorous • SI Standard Units</span>
            </div>
          </div>

          {/* Laboratories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Laboratories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('subject', 'physics' as SubjectId)}
                  className="hover:text-sky-300 transition-colors flex items-center gap-2"
                >
                  <Atom className="w-3.5 h-3.5 text-sky-400" />
                  Physics Laboratory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subject', 'mathematics' as SubjectId)}
                  className="hover:text-violet-300 transition-colors flex items-center gap-2"
                >
                  <Sigma className="w-3.5 h-3.5 text-violet-400" />
                  Mathematics Laboratory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subject', 'chemistry' as SubjectId)}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-2"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                  Chemistry Laboratory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('subject', 'biology' as SubjectId)}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-2"
                >
                  <Dna className="w-3.5 h-3.5 text-emerald-400" />
                  Biology Laboratory
                </button>
              </li>
            </ul>
          </div>

          {/* Active Experiments */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Core Experiments
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('experiment', 'projectile-motion')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Projectile Motion Laboratory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('experiment', 'function-explorer')}
                  className="hover:text-violet-300 transition-colors"
                >
                  Interactive Function Laboratory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('experiment', 'atomic-structure')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Atomic Structure Laboratory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('experiment', 'cell-explorer')}
                  className="hover:text-emerald-300 transition-colors"
                >
                  Interactive Cell Laboratory
                </button>
              </li>
            </ul>
          </div>

          {/* AI Architecture Principle */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-sky-500/15 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Product Architecture Principle</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              SciNiraula is a <strong className="text-white">virtual laboratory with AI integrated into it</strong>, not a chatbot with laboratory features. Simulations operate independently, remaining 100% operational offline.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} SciNiraula Virtual STEM Laboratory. All scientific models mathematically grounded.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Physics • Mathematics • Chemistry • Biology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
