import React from 'react';
import { EXPERIMENTS } from '../../data/laboratories';
import { Bookmark, X, Play, Trash2, ArrowRight } from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedIds: string[];
  onSelectExperiment: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedIds,
  onSelectExperiment,
  onToggleBookmark,
}) => {
  if (!isOpen) return null;

  const bookmarkedExperiments = EXPERIMENTS.filter((e) => bookmarkedIds.includes(e.id));

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-[#090f1d] border-l border-sky-500/20 shadow-2xl flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0b1426]">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400 fill-current" />
          <h3 className="text-sm font-bold text-white">Saved Laboratories</h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {bookmarkedExperiments.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {bookmarkedExperiments.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-slate-400" />
            <p>You have not saved any laboratories yet.</p>
            <p className="text-[11px] text-slate-400">Click the bookmark icon on any experiment card to pin it here.</p>
          </div>
        ) : (
          bookmarkedExperiments.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
                    {exp.subjectId}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{exp.title}</h4>
                </div>
                <button
                  onClick={() => onToggleBookmark(exp.id)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400">~{exp.estimatedMinutes} mins</span>
                <button
                  onClick={() => {
                    onSelectExperiment(exp.id);
                    onClose();
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Open Lab</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
