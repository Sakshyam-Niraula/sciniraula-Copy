import React, { useState, useEffect } from 'react';
import { EXPERIMENTS } from '../../data/laboratories';
import { Search, X, Play, ArrowRight, Atom, Sigma, FlaskConical, Dna } from 'lucide-react';
import { SubjectId } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperiment: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectExperiment,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = EXPERIMENTS.filter((exp) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      exp.title.toLowerCase().includes(q) ||
      exp.description.toLowerCase().includes(q) ||
      exp.tags.some((t) => t.toLowerCase().includes(q)) ||
      exp.equations.some((eq) => eq.formula.toLowerCase().includes(q) || eq.name.toLowerCase().includes(q))
    );
  });

  const getIcon = (sub: SubjectId) => {
    switch (sub) {
      case 'physics': return Atom;
      case 'mathematics': return Sigma;
      case 'chemistry': return FlaskConical;
      case 'biology': return Dna;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0b1222] border border-sky-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#0d1627]">
          <Search className="w-5 h-5 text-sky-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search experiments, equations, or scientific concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No scientific experiments found for "{query}".
            </div>
          ) : (
            results.map((exp) => {
              const Icon = getIcon(exp.subjectId);
              return (
                <div
                  key={exp.id}
                  onClick={() => {
                    if (exp.status === 'active') {
                      onSelectExperiment(exp.id);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    exp.status === 'active'
                      ? 'bg-slate-900/60 border-slate-800 hover:border-sky-500/40 hover:bg-slate-900 cursor-pointer'
                      : 'bg-slate-900/30 border-slate-800/40 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {exp.subjectId}
                      </span>
                      <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{exp.shortDescription}</p>
                  </div>

                  {exp.status === 'active' ? (
                    <span className="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 font-semibold text-xs flex items-center gap-1">
                      <span>Launch</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">Roadmap</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
