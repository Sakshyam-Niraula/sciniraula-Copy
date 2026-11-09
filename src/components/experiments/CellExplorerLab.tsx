import React, { useState, useEffect } from 'react';
import { ORGANELLES, Organelle, CellType } from '../../biology/cells';
import { Sparkles, Dna, Info, Layers, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface CellExplorerLabProps {
  onUpdateTelemetry: (params: Record<string, any>, measurements: Record<string, any>) => void;
  onOpenAssistant: () => void;
}

export const CellExplorerLab: React.FC<CellExplorerLabProps> = ({
  onUpdateTelemetry,
  onOpenAssistant,
}) => {
  const [cellType, setCellType] = useState<CellType>('plant');
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle>(ORGANELLES[0]);
  const [compareMode, setCompareMode] = useState<boolean>(false);

  // Filter organelles available in current cell type
  const availableOrganelles = ORGANELLES.filter((org) =>
    cellType === 'animal' ? org.presentInAnimal : org.presentInPlant
  );

  // Update telemetry for AI Assistant
  useEffect(() => {
    onUpdateTelemetry(
      {
        cellType,
        selectedOrganelleName: selectedOrganelle.name,
        category: selectedOrganelle.category,
        presentInAnimal: selectedOrganelle.presentInAnimal,
        presentInPlant: selectedOrganelle.presentInPlant,
      },
      {
        primaryFunction: selectedOrganelle.primaryFunction,
        biochemicalProcess: selectedOrganelle.biochemicalProcess,
        metabolicSignificance: selectedOrganelle.metabolicSignificance,
      }
    );
  }, [cellType, selectedOrganelle, onUpdateTelemetry]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. TOP BAR: CELL TYPE SELECTOR & COMPARISON MODE TOGGLE */}
      <div className="p-4 rounded-2xl bg-[#08121d] border border-emerald-500/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => {
                setCellType('animal');
                if (!selectedOrganelle.presentInAnimal) {
                  setSelectedOrganelle(ORGANELLES[0]);
                }
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                cellType === 'animal'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Animal Cell (Eukaryote)
            </button>
            <button
              onClick={() => {
                setCellType('plant');
                if (!selectedOrganelle.presentInPlant) {
                  setSelectedOrganelle(ORGANELLES[0]);
                }
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                cellType === 'plant'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Plant Cell (Eukaryote)
            </button>
          </div>

          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              compareMode
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {compareMode ? 'Exit Comparison' : 'Compare Plant vs Animal'}
          </button>
        </div>

        <button
          onClick={onOpenAssistant}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Ask Biology Mentor</span>
        </button>
      </div>

      {/* 2. MAIN CYTOLOGICAL VIEWPORT & ORGANELLE INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Interactive Cell Diagram */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#08121d] border border-emerald-500/20 shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#0c1a29] border-b border-emerald-500/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Interactive Cytological Map ({cellType === 'plant' ? 'Plant Cell' : 'Animal Cell'})
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300">
              Click any organelle to dissect
            </span>
          </div>

          {/* Cell SVG Canvas Area */}
          <div className="relative w-full h-[420px] sm:h-[460px] bg-[#070e17] flex items-center justify-center p-4 select-none">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-w-[420px] transition-all duration-300"
            >
              <defs>
                <radialGradient id="cytoplasmAnimal" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f1f33" />
                  <stop offset="100%" stopColor="#0a1524" />
                </radialGradient>
                <radialGradient id="cytoplasmPlant" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0c241d" />
                  <stop offset="100%" stopColor="#071712" />
                </radialGradient>
              </defs>

              {/* Plant Cell Wall & Membrane (Hexagonal / Rectangular) */}
              {cellType === 'plant' ? (
                <>
                  {/* Outer rigid cell wall */}
                  <polygon
                    points="50,4 92,20 92,80 50,96 8,80 8,20"
                    fill="url(#cytoplasmPlant)"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                    className="cursor-pointer hover:stroke-emerald-300 transition-colors"
                    onClick={() => {
                      const wall = ORGANELLES.find((o) => o.id === 'cell-wall');
                      if (wall) setSelectedOrganelle(wall);
                    }}
                  />
                  {/* Inner plasma membrane */}
                  <polygon
                    points="50,7 89,22 89,78 50,93 11,78 11,22"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="2 1"
                  />

                  {/* Large Central Vacuole */}
                  <ellipse
                    cx="60"
                    cy="52"
                    rx="22"
                    ry="20"
                    fill="rgba(6, 182, 212, 0.22)"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:fill-cyan-500/40 transition-colors"
                    onClick={() => {
                      const vac = ORGANELLES.find((o) => o.id === 'vacuole');
                      if (vac) setSelectedOrganelle(vac);
                    }}
                  />
                  <text x="60" y="53" textAnchor="middle" fill="#22d3ee" fontSize="3.5" fontFamily="monospace">
                    Central Vacuole
                  </text>
                </>
              ) : (
                /* Animal Cell (Amorphous Rounded Membrane) */
                <>
                  <path
                    d="M 50,5 C 75,4 94,22 95,48 C 96,74 78,95 50,95 C 22,95 4,76 5,48 C 6,20 25,6 50,5 Z"
                    fill="url(#cytoplasmAnimal)"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:stroke-sky-300 transition-colors"
                    onClick={() => {
                      const mem = ORGANELLES.find((o) => o.id === 'cell-membrane');
                      if (mem) setSelectedOrganelle(mem);
                    }}
                  />
                </>
              )}

              {/* Render Organelles as Interactive Nodes */}
              {availableOrganelles.map((org) => {
                const pos = cellType === 'animal' ? org.animalPos : org.plantPos;
                if (!pos || pos.r === 0) return null;

                const isSelected = selectedOrganelle.id === org.id;

                return (
                  <g
                    key={org.id}
                    onClick={() => setSelectedOrganelle(org)}
                    className="cursor-pointer group"
                  >
                    {/* Highlight ring if selected */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={pos.r + 3.5}
                        fill="none"
                        stroke="#f8fafc"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${pos.x}px ${pos.y}px`, animationDuration: '6s' }}
                      />
                    )}

                    {/* Organelle Body */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={pos.r}
                      fill={org.color}
                      fillOpacity={isSelected ? 0.9 : 0.7}
                      stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.3)'}
                      strokeWidth={isSelected ? 1.5 : 0.8}
                      className="transition-all duration-200 group-hover:scale-110"
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                    />

                    {/* Small name tag on node */}
                    {pos.r >= 7 && (
                      <text
                        x={pos.x}
                        y={pos.y + 1}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={pos.r > 12 ? '3.5' : '2.8'}
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {org.name.split(' ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Quick Helper Pill */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/20 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedOrganelle.color }} />
              <span className="font-semibold text-white">{selectedOrganelle.name}</span>
            </div>
          </div>

          {/* Organelle Quick Selector Strip */}
          <div className="p-3 bg-[#0a1522] border-t border-emerald-500/15 flex items-center gap-1.5 overflow-x-auto">
            {availableOrganelles.map((org) => {
              const isSelected = selectedOrganelle.id === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => setSelectedOrganelle(org)}
                  className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-emerald-500/25 border-emerald-400 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: org.color }} />
                  <span>{org.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Organelle Scientific Dossier */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#08121d] border border-emerald-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedOrganelle.color }} />
                <h3 className="text-base font-bold text-white">{selectedOrganelle.name}</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                {selectedOrganelle.category}
              </span>
            </div>

            {/* Primary Function */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Primary Physiological Function
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedOrganelle.primaryFunction}
              </p>
            </div>

            {/* Biochemical Process */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Biochemical Pathway & Mechanics
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {selectedOrganelle.biochemicalProcess}
              </p>
            </div>

            {/* Ultrastructure */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Membrane Ultrastructure
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedOrganelle.structuralDetails}
              </p>
            </div>

            {/* Metabolic Significance */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
              <strong>Metabolic Duty: </strong>
              {selectedOrganelle.metabolicSignificance}
            </div>
          </div>

          {/* Plant vs Animal Comparison Matrix Card */}
          {compareMode && (
            <div className="p-5 rounded-2xl bg-[#08121d] border border-emerald-500/20 shadow-xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Cytologic Differentiation Matrix
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Chloroplasts (Photosynthesis)</span>
                  <span className="text-emerald-400 font-bold">Plant Only</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Cellulose Cell Wall (Turgor)</span>
                  <span className="text-emerald-400 font-bold">Plant Only</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Large Central Vacuole (Tonoplast)</span>
                  <span className="text-emerald-400 font-bold">Plant Only</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Lysosomes (Hydrolytic degradation)</span>
                  <span className="text-sky-400 font-bold">Animal Only</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
