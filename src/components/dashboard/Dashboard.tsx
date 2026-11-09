import React, { useState } from 'react';
import { LABORATORIES, EXPERIMENTS } from '../../data/laboratories';
import { Experiment, SubjectId, UserProgress } from '../../types';
import { Search, Bookmark, CheckCircle, Clock, ArrowRight, Play, Atom, Sigma, FlaskConical, Dna, Sparkles, Filter, X } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string, subParam?: any) => void;
  userProgress: UserProgress;
  onToggleBookmark: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  userProgress,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'recent'>('all');

  // Filter experiments
  const filteredExperiments = EXPERIMENTS.filter((exp) => {
    // Tab filter
    if (activeTab === 'saved' && !userProgress.bookmarkedIds.includes(exp.id)) {
      return false;
    }
    if (activeTab === 'recent' && !userProgress.recentExperimentIds.includes(exp.id)) {
      return false;
    }

    // Subject filter
    if (selectedSubject !== 'all' && exp.subjectId !== selectedSubject) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all' && exp.difficulty !== selectedDifficulty) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = exp.title.toLowerCase().includes(q);
      const matchDesc = exp.description.toLowerCase().includes(q);
      const matchTags = exp.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchTags;
    }

    return true;
  });

  const getSubjectIcon = (sub: SubjectId) => {
    switch (sub) {
      case 'physics': return Atom;
      case 'mathematics': return Sigma;
      case 'chemistry': return FlaskConical;
      case 'biology': return Dna;
    }
  };

  const completedCount = userProgress.completedExperimentIds.length;
  const totalActive = EXPERIMENTS.filter(e => e.status === 'active').length;
  const progressPercent = Math.round((completedCount / (totalActive || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#070b14] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. WELCOME & SCIENTIFIC WORKSPACE HEADER */}
      <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0b1528] via-[#091224] to-[#070b14] border border-sky-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold mb-2 border border-sky-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Virtual Laboratory Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              STEM Experimentation Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Select an experiment to enter its real-time digital workspace, adjust physical parameters, and review scientific telemetry.
            </p>
          </div>

          {/* Genuine progress tracking */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="space-y-1 text-left">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                Core Lab Progress
              </div>
              <div className="text-lg font-mono-num font-bold text-white flex items-baseline gap-1.5">
                <span>{completedCount}</span>
                <span className="text-xs text-slate-400">/ {totalActive} Experiments</span>
              </div>
              <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-400 to-cyan-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUBJECT LABORATORIES SELECTOR STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {LABORATORIES.map((lab) => {
          const Icon = getSubjectIcon(lab.id);
          const isSelected = selectedSubject === lab.id;
          return (
            <button
              key={lab.id}
              onClick={() => setSelectedSubject(isSelected ? 'all' : lab.id)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-500/50 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5" style={{ color: lab.accentColor }} />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {lab.activeCount} Live
                </span>
              </div>
              <div className="text-sm font-bold text-white">{lab.name}</div>
              <div className="text-[11px] text-slate-400 line-clamp-1">{lab.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Tabs: All / Saved / Recent */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Experiments ({EXPERIMENTS.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({userProgress.bookmarkedIds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'recent'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Explored</span>
          </button>
        </div>

        {/* Search input & difficulty dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by keyword or equation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* 4. EXPERIMENTS GRID */}
      {filteredExperiments.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/30 border border-slate-800">
          <p className="text-slate-400 text-sm mb-3">No experiments match the selected criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('all');
              setSelectedDifficulty('all');
              setActiveTab('all');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-500 text-slate-950"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.map((exp) => {
            const isBookmarked = userProgress.bookmarkedIds.includes(exp.id);
            const isCompleted = userProgress.completedExperimentIds.includes(exp.id);
            const Icon = getSubjectIcon(exp.subjectId);

            return (
              <div
                key={exp.id}
                className="lab-card p-5 rounded-2xl flex flex-col justify-between hover:border-sky-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-800/80 text-sky-400 border border-slate-700/60 uppercase">
                      <Icon className="w-3 h-3" />
                      {exp.subjectId}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        exp.difficulty === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : exp.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {exp.difficulty}
                      </span>

                      <button
                        onClick={() => onToggleBookmark(exp.id)}
                        className={`p-1 rounded-md transition-colors ${
                          isBookmarked
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark experiment'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {exp.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {exp.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    {isCompleted ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      <span>~{exp.estimatedMinutes} mins</span>
                    )}
                  </div>

                  {exp.status === 'active' ? (
                    <button
                      onClick={() => onNavigate('experiment', exp.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Enter Workspace</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded text-[11px] font-mono bg-slate-800/80 text-slate-400 border border-slate-700">
                      Phase 5 Expansion
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
