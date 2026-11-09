import React, { useState } from 'react';
import { EXPERIMENTS } from '../../data/laboratories';
import { SubjectId, UserProgress } from '../../types';
import { ProjectileMotionLab } from '../experiments/ProjectileMotionLab';
import { FunctionExplorerLab } from '../experiments/FunctionExplorerLab';
import { AtomicStructureLab } from '../experiments/AtomicStructureLab';
import { CellExplorerLab } from '../experiments/CellExplorerLab';
import { AIAssistantDrawer } from './AIAssistantDrawer';
import { ArrowLeft, Bookmark, CheckCircle, Sparkles, BookOpen, Target, Info, ShieldCheck } from 'lucide-react';

interface LaboratoryWorkspaceProps {
  experimentId: string;
  onNavigate: (view: string, subParam?: any) => void;
  userProgress: UserProgress;
  onToggleBookmark: (id: string) => void;
  onMarkCompleted: (id: string) => void;
}

export const LaboratoryWorkspace: React.FC<LaboratoryWorkspaceProps> = ({
  experimentId,
  onNavigate,
  userProgress,
  onToggleBookmark,
  onMarkCompleted,
}) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Live telemetry collected from the active experiment
  const [currentParameters, setCurrentParameters] = useState<Record<string, any>>({});
  const [currentMeasurements, setCurrentMeasurements] = useState<Record<string, any>>({});

  const experiment = EXPERIMENTS.find((e) => e.id === experimentId) || EXPERIMENTS[0];
  const isBookmarked = userProgress.bookmarkedIds.includes(experiment.id);
  const isCompleted = userProgress.completedExperimentIds.includes(experiment.id);

  const handleUpdateTelemetry = (params: Record<string, any>, measurements: Record<string, any>) => {
    setCurrentParameters(params);
    setCurrentMeasurements(measurements);
  };

  const renderActiveLab = () => {
    switch (experiment.id) {
      case 'projectile-motion':
        return (
          <ProjectileMotionLab
            onUpdateTelemetry={handleUpdateTelemetry}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      case 'function-explorer':
        return (
          <FunctionExplorerLab
            onUpdateTelemetry={handleUpdateTelemetry}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      case 'atomic-structure':
        return (
          <AtomicStructureLab
            onUpdateTelemetry={handleUpdateTelemetry}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      case 'cell-explorer':
        return (
          <CellExplorerLab
            onUpdateTelemetry={handleUpdateTelemetry}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      default:
        return (
          <div className="p-12 text-center text-slate-400">
            Selected experiment is in active development.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. TOP WORKSPACE NAVIGATION & CONTROLS */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sky-500/15">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('subject', experiment.subjectId)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Return to subject laboratory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase font-semibold">
                {experiment.subjectId} Lab
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Difficulty: {experiment.difficulty}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {experiment.title}
            </h1>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Explanation & Governing Equations toggle */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              showExplanation
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theory & Equations</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onToggleBookmark(experiment.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isBookmarked
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isBookmarked ? 'Remove from saved' : 'Save experiment'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Mark completed */}
          <button
            onClick={() => onMarkCompleted(experiment.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isCompleted
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>

          {/* Open AI Assistant */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* 2. OPTIONAL COLLAPSIBLE THEORY & EQUATIONS BANNER */}
      {showExplanation && (
        <div className="mb-6 p-6 rounded-2xl bg-[#091224] border border-sky-500/20 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Governing Equations & Scientific Foundations</span>
            </h3>
            <button
              onClick={() => setShowExplanation(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiment.equations.map((eq, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-sky-400">{eq.name}</span>
                <p className="font-mono text-sm text-white">{eq.formula}</p>
                <p className="text-[11px] text-slate-400 leading-normal">{eq.explanation}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-semibold text-slate-300 block mb-1">Learning Objectives:</span>
              <ul className="space-y-1 text-slate-400">
                {experiment.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-sky-400">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-slate-300 block mb-1">Model Assumptions & Limitations:</span>
              <ul className="space-y-1 text-slate-400">
                {experiment.assumptions.map((assump, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE INTERACTIVE EXPERIMENT SIMULATION */}
      <div className="w-full">
        {renderActiveLab()}
      </div>

      {/* 4. CONTEXTUAL AI LABORATORY ASSISTANT SIDE DRAWER */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        context={{
          experimentId: experiment.id,
          experimentTitle: experiment.title,
          parameters: currentParameters,
          measurements: currentMeasurements,
        }}
      />
    </div>
  );
};
