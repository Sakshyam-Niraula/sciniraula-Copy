import React, { useState } from 'react';
import { LABORATORIES, EXPERIMENTS } from '../../data/laboratories';
import { SubjectId, UserProgress } from '../../types';
import { ArrowLeft, Play, Bookmark, CheckCircle, Atom, Sigma, FlaskConical, Dna, Clock, Target, ShieldCheck } from 'lucide-react';

interface SubjectPageProps {
  subjectId: SubjectId;
  onNavigate: (view: string, subParam?: any) => void;
  userProgress: UserProgress;
  onToggleBookmark: (id: string) => void;
}

export const SubjectPage: React.FC<SubjectPageProps> = ({
  subjectId,
  onNavigate,
  userProgress,
  onToggleBookmark,
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const lab = LABORATORIES.find((l) => l.id === subjectId) || LABORATORIES[0];
  const experiments = EXPERIMENTS.filter((e) => e.subjectId === subjectId);

  const filtered = experiments.filter((e) => {
    if (filterDifficulty !== 'all' && e.difficulty !== filterDifficulty) return false;
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

  const Icon = getSubjectIcon(lab.id);

  return (
    <div className="min-h-screen bg-[#070b14] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Breadcrumb */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>

      {/* Hero Banner for Subject */}
      <div className={`mb-10 p-8 rounded-3xl bg-gradient-to-br ${lab.gradient} border border-sky-500/20 shadow-2xl relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/60 text-xs font-semibold text-white mb-3">
              <Icon className="w-4 h-4" style={{ color: lab.accentColor }} />
              <span>Scientific Discipline Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              {lab.name}
            </h1>
            <p className="text-sky-300 font-medium text-sm mb-3">{lab.tagline}</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lab.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[120px]">
              <div className="text-2xl font-mono-num font-bold text-white">{lab.activeCount}</div>
              <div className="text-[11px] text-slate-400">Active Workspaces</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center min-w-[120px]">
              <div className="text-2xl font-mono-num font-bold text-slate-400">{lab.upcomingCount}</div>
              <div className="text-[11px] text-slate-400">Roadmap Labs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Experiment Filtering */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>Experiment Catalogue</span>
          <span className="text-xs font-mono font-normal text-slate-400">({filtered.length})</span>
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Difficulty:</span>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-6">
        {filtered.map((exp) => {
          const isBookmarked = userProgress.bookmarkedIds.includes(exp.id);
          const isCompleted = userProgress.completedExperimentIds.includes(exp.id);

          return (
            <div
              key={exp.id}
              className="p-6 rounded-2xl lab-card border border-slate-800 hover:border-sky-500/30 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="max-w-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    exp.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : exp.difficulty === 'Intermediate'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {exp.difficulty}
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{exp.estimatedMinutes} mins
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>

                {/* Learning Objectives */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Learning Objectives:</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-400">
                    {exp.learningObjectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-sky-400 mt-0.5">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-3 w-full lg:w-auto justify-end">
                {exp.status === 'active' ? (
                  <button
                    onClick={() => onNavigate('experiment', exp.id)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Enter Workspace</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800/80 text-slate-400 border border-slate-700 text-center">
                    Roadmap Phase 5
                  </span>
                )}

                <button
                  onClick={() => onToggleBookmark(exp.id)}
                  className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs ${
                    isBookmarked
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
