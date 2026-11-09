import React, { useState, useEffect, useRef } from 'react';
import { PERIODIC_ELEMENTS, ChemicalElement, calculateShellDistribution, calculateCharge, calculateNuclearStability } from '../../chemistry/elements';
import { Sparkles, Sliders, Plus, Minus, Atom, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface AtomicStructureLabProps {
  onUpdateTelemetry: (params: Record<string, any>, measurements: Record<string, any>) => void;
  onOpenAssistant: () => void;
}

export const AtomicStructureLab: React.FC<AtomicStructureLabProps> = ({
  onUpdateTelemetry,
  onOpenAssistant,
}) => {
  // Current element selection
  const [selectedElement, setSelectedElement] = useState<ChemicalElement>(PERIODIC_ELEMENTS[5]); // Carbon (Z=6)
  const [protons, setProtons] = useState<number>(6);
  const [neutrons, setNeutrons] = useState<number>(6);
  const [electrons, setElectrons] = useState<number>(6);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state when element is selected from periodic table strip
  const handleSelectElement = (elem: ChemicalElement) => {
    setSelectedElement(elem);
    setProtons(elem.z);
    setNeutrons(elem.standardNeutrons);
    setElectrons(elem.standardElectrons);
  };

  // Calculations
  const shells = calculateShellDistribution(electrons);
  const { netCharge, ionType, label: chargeLabel } = calculateCharge(protons, electrons);
  const stability = calculateNuclearStability(protons, neutrons);
  const massNumber = protons + neutrons;

  // Report telemetry to AI Assistant
  useEffect(() => {
    onUpdateTelemetry(
      {
        element: selectedElement.name,
        symbol: selectedElement.symbol,
        protons,
        neutrons,
        electrons,
        shells: shells.join(', '),
      },
      {
        atomicNumber: protons,
        massNumber,
        netCharge: netCharge > 0 ? `+${netCharge}` : String(netCharge),
        ionState: chargeLabel,
        nuclearStability: stability.description,
        valenceElectrons: shells[shells.length - 1] || 0,
      }
    );
  }, [protons, neutrons, electrons, selectedElement, shells, netCharge, massNumber, stability, chargeLabel, onUpdateTelemetry]);

  // Animated Bohr Atom Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, width, height);

      // Draw faint background grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 1. Draw Central Nucleus
      const nucleusRadius = Math.min(22 + protons * 0.4, 45);

      // Nucleus glow
      const nucleusGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, nucleusRadius * 1.5);
      nucleusGrad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
      nucleusGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.3)');
      nucleusGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nucleusGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Nucleons (Protons red, Neutrons slate/cyan)
      const totalNucleons = Math.min(protons + neutrons, 45);
      for (let i = 0; i < totalNucleons; i++) {
        const isProton = i < protons;
        const seedAngle = (i * 137.5 * Math.PI) / 180;
        const dist = Math.sqrt(i / totalNucleons) * (nucleusRadius - 6);
        const nx = centerX + dist * Math.cos(seedAngle);
        const ny = centerY + dist * Math.sin(seedAngle);

        ctx.fillStyle = isProton ? '#ef4444' : '#64748b';
        ctx.beginPath();
        ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. Draw Concentric Bohr Quantum Shells
      const shellRadii = [65, 105, 145, 185];
      const shellLabels = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)'];

      shells.forEach((electronCount, sIdx) => {
        const radius = shellRadii[sIdx];
        if (!radius) return;

        // Shell orbit line
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Shell label
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(shellLabels[sIdx], centerX + radius - 24, centerY - 6);

        // Revolving Electrons along this shell
        const shellSpeed = 0.02 / (sIdx + 1);
        const shellAngleOffset = angle * (sIdx % 2 === 0 ? 1 : -1) * shellSpeed;

        for (let e = 0; e < electronCount; e++) {
          const eAngle = shellAngleOffset + (e * 2 * Math.PI) / electronCount;
          const ex = centerX + radius * Math.cos(eAngle);
          const ey = centerY + radius * Math.sin(eAngle);

          // Electron glow
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      angle += 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [protons, neutrons, shells]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. PERIODIC TABLE STRIP (First 20 Elements) */}
      <div className="p-4 rounded-2xl bg-[#090f1d] border border-cyan-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold uppercase tracking-wider text-white">Periodic Table Quick Select (Z = 1 to 20)</span>
          <span className="text-slate-400 font-mono">Bohr-Sommerfeld Model</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PERIODIC_ELEMENTS.map((el) => {
            const isSelected = selectedElement.z === el.z && protons === el.z;
            return (
              <button
                key={el.z}
                onClick={() => handleSelectElement(el)}
                className={`min-w-[48px] p-1.5 rounded-lg text-center transition-all border flex flex-col items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold scale-105 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-[9px] font-mono text-slate-400">{el.z}</span>
                <span className="text-sm font-bold">{el.symbol}</span>
                <span className="text-[8px] text-slate-400 truncate max-w-[42px]">{el.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN SIMULATION VIEWPORT & CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Display */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-[#080d1a] border border-cyan-500/20 shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#0d1627] border-b border-cyan-500/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Quantized Bohr Orbital Visualization
              </span>
              <span className="text-xs font-mono text-cyan-300 ml-2">
                {selectedElement.name} ({selectedElement.symbol})
              </span>
            </div>

            {/* In-view legend */}
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Proton ({protons})
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> Neutron ({neutrons})
              </span>
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" /> Electron ({electrons})
              </span>
            </div>
          </div>

          <div className="relative w-full h-[400px] sm:h-[430px] bg-[#080d1a]">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Isotope & Charge HUD */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-cyan-500/30 text-xs font-mono space-y-1 text-slate-200">
              <div className="flex items-baseline gap-1 text-base font-bold text-white">
                <span className="text-xs align-super text-cyan-400">{massNumber}</span>
                <span>{selectedElement.symbol}</span>
                {netCharge !== 0 && (
                  <span className="text-xs align-super text-amber-400">
                    {netCharge > 0 ? `+${netCharge}` : netCharge}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">Mass No. A = {massNumber}</div>
              <div className="text-[11px] text-cyan-300">Net: {chargeLabel}</div>
            </div>
          </div>

          {/* Bottom Shell breakdown */}
          <div className="p-4 bg-[#0a1122] border-t border-cyan-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="text-slate-400">Shells:</span>
              {['K', 'L', 'M', 'N'].map((name, i) => (
                <span key={name} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                  {name}: {shells[i] || 0}
                </span>
              ))}
            </div>

            <button
              onClick={onOpenAssistant}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Ask Chemistry Mentor</span>
            </button>
          </div>
        </div>

        {/* Nucleon & Electron Builder Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#090f1d] border border-cyan-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Subatomic Controls</span>
              <button
                onClick={() => handleSelectElement(selectedElement)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono"
              >
                Reset Standard
              </button>
            </div>

            {/* Protons Z */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Protons (Atomic Number Z):</span>
                <span className="font-mono text-rose-400 font-bold">{protons}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = Math.max(1, protons - 1);
                    setProtons(next);
                    const matched = PERIODIC_ELEMENTS.find((e) => e.z === next);
                    if (matched) setSelectedElement(matched);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={protons}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setProtons(next);
                    const matched = PERIODIC_ELEMENTS.find((el) => el.z === next);
                    if (matched) setSelectedElement(matched);
                  }}
                  className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => {
                    const next = Math.min(20, protons + 1);
                    setProtons(next);
                    const matched = PERIODIC_ELEMENTS.find((e) => e.z === next);
                    if (matched) setSelectedElement(matched);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Neutrons N */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Neutrons (Isotope Tuning N):</span>
                <span className="font-mono text-slate-300 font-bold">{neutrons}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNeutrons(Math.max(0, neutrons - 1))}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={neutrons}
                  onChange={(e) => setNeutrons(Number(e.target.value))}
                  className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => setNeutrons(Math.min(25, neutrons + 1))}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Electrons e- */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Electrons (Ion Tuning e⁻):</span>
                <span className="font-mono text-sky-400 font-bold">{electrons}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setElectrons(Math.max(1, electrons - 1))}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={electrons}
                  onChange={(e) => setElectrons(Number(e.target.value))}
                  className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <button
                  onClick={() => setElectrons(Math.min(20, electrons + 1))}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Nuclear & Chemical Analysis Card */}
          <div className="p-5 rounded-2xl bg-[#090f1d] border border-cyan-500/20 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Nuclear & Electronic Telemetry
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Net Electrical Charge:</span>
                <span className={`font-mono font-bold ${netCharge === 0 ? 'text-slate-200' : netCharge > 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {netCharge > 0 ? `+${netCharge} (Cation)` : netCharge < 0 ? `${netCharge} (Anion)` : '0 (Neutral)'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Valence Electrons:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {shells[shells.length - 1] || 0} / 8
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nuclear Stability:</span>
                  <span className={`font-mono font-bold ${stability.isStable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stability.isStable ? 'Stable' : 'Radioactive'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{stability.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
