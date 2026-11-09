import React, { useState, useEffect, useRef } from 'react';
import { FunctionParams, FunctionType, analyzeFunction, evaluateFunction, evaluateDerivative, FunctionAnalysis } from '../../math/functions';
import { Sliders, Sparkles, BookOpen, Calculator, Compass, Move, Info } from 'lucide-react';

interface FunctionExplorerLabProps {
  onUpdateTelemetry: (params: Record<string, any>, measurements: Record<string, any>) => void;
  onOpenAssistant: () => void;
}

export const FunctionExplorerLab: React.FC<FunctionExplorerLabProps> = ({
  onUpdateTelemetry,
  onOpenAssistant,
}) => {
  const [params, setParams] = useState<FunctionParams>({
    type: 'quadratic',
    a: 1,
    b: -2,
    c: -3,
    d: 0,
  });

  const [hoverX, setHoverX] = useState<number | null>(0);
  const [showTangent, setShowTangent] = useState<boolean>(true);
  const [showExtrema, setShowExtrema] = useState<boolean>(true);
  const [showRoots, setShowRoots] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const analysis: FunctionAnalysis = analyzeFunction(params);

  // Update telemetry for AI Assistant
  useEffect(() => {
    onUpdateTelemetry(
      {
        functionType: params.type,
        a: params.a,
        b: params.b,
        c: params.c,
        d: params.d,
        formula: analysis.formulaLatex,
      },
      {
        roots: analysis.roots.join(', ') || 'None in real field',
        yIntercept: analysis.yIntercept !== null ? analysis.yIntercept : 'Undefined',
        extrema: analysis.extrema.map((e) => `${e.type} at (${e.x}, ${e.y})`).join('; ') || 'None',
        derivative: analysis.derivativeLatex,
        range: analysis.rangeDescription,
      }
    );
  }, [params, analysis, onUpdateTelemetry]);

  // Canvas Drawing of Cartesian Plane & Curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const xMin = -8;
    const xMax = 8;
    const yMin = -8;
    const yMax = 8;

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (cx: number) => xMin + (cx / width) * (xMax - xMin);

    // Background
    ctx.fillStyle = '#080d19';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      if (x !== 0) {
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(String(x), cx - 4, toCanvasY(0) + 14);
      }
    }

    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      if (y !== 0) {
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(String(y), toCanvasX(0) + 6, cy + 3);
      }
    }

    // Axes
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(0));
    ctx.lineTo(width, toCanvasY(0));
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 0);
    ctx.lineTo(toCanvasX(0), height);
    ctx.stroke();

    // Plot Function Curve
    ctx.strokeStyle = '#a855f7'; // Violet accent for mathematics
    ctx.lineWidth = 3;
    ctx.beginPath();

    const step = (xMax - xMin) / (width * 1.5);
    let isDrawing = false;

    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(params, x);

      if (y === null || isNaN(y) || y < yMin - 5 || y > yMax + 5) {
        isDrawing = false;
        continue;
      }

      const cx = toCanvasX(x);
      const cy = toCanvasY(y);

      if (!isDrawing) {
        ctx.moveTo(cx, cy);
        isDrawing = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
    ctx.stroke();

    // Draw Roots
    if (showRoots) {
      ctx.fillStyle = '#10b981';
      for (const root of analysis.roots) {
        if (root >= xMin && root <= xMax) {
          const cx = toCanvasX(root);
          const cy = toCanvasY(0);
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#34d399';
          ctx.font = '10px monospace';
          ctx.fillText(`(${root}, 0)`, cx - 18, cy - 8);
          ctx.fillStyle = '#10b981';
        }
      }
    }

    // Draw Extrema
    if (showExtrema) {
      for (const ext of analysis.extrema) {
        if (ext.x >= xMin && ext.x <= xMax && ext.y >= yMin && ext.y <= yMax) {
          const cx = toCanvasX(ext.x);
          const cy = toCanvasY(ext.y);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fbbf24';
          ctx.font = '10px monospace';
          ctx.fillText(`${ext.type} (${ext.x}, ${ext.y})`, cx - 30, ext.type === 'minimum' ? cy + 16 : cy - 8);
        }
      }
    }

    // Tangent Line at hoverX
    if (showTangent && hoverX !== null && hoverX >= xMin && hoverX <= xMax) {
      const yVal = evaluateFunction(params, hoverX);
      const slope = evaluateDerivative(params, hoverX);

      if (yVal !== null && slope !== null) {
        const cx = toCanvasX(hoverX);
        const cy = toCanvasY(yVal);

        // Point on curve
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        // Tangent line segment
        const dx = 2.5;
        const x1 = hoverX - dx;
        const y1 = yVal - slope * dx;
        const x2 = hoverX + dx;
        const y2 = yVal + slope * dx;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
        ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [params, analysis, hoverX, showTangent, showExtrema, showRoots]);

  // Handle canvas mouse move for interactive coordinate inspection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const xMin = -8;
    const xMax = 8;
    const mathX = xMin + (cx / canvas.width) * (xMax - xMin);
    setHoverX(Number(mathX.toFixed(2)));
  };

  const inspectedY = hoverX !== null ? evaluateFunction(params, hoverX) : null;
  const inspectedSlope = hoverX !== null ? evaluateDerivative(params, hoverX) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Graph Area */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-[#080d19] border border-violet-500/20 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-[#0d1424] border-b border-violet-500/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Cartesian Plane Explorer
              </span>
              <span className="text-xs font-mono font-semibold text-violet-300 ml-2">
                {analysis.formulaLatex}
              </span>
            </div>

            {/* Toggle controls */}
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showTangent}
                  onChange={(e) => setShowTangent(e.target.checked)}
                  className="rounded accent-sky-400"
                />
                <span>Tangent f'(x)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showRoots}
                  onChange={(e) => setShowRoots(e.target.checked)}
                  className="rounded accent-emerald-400"
                />
                <span>Roots</span>
              </label>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative w-full h-[400px] sm:h-[430px] bg-[#080d19]">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverX(0)}
              className="w-full h-full block cursor-crosshair"
            />

            {/* Coordinate HUD */}
            {hoverX !== null && inspectedY !== null && (
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-violet-500/30 text-xs font-mono space-y-0.5 text-slate-200">
                <div>
                  <span className="text-slate-400">Position: </span>
                  <span className="text-white font-bold">({hoverX.toFixed(2)}, {inspectedY.toFixed(2)})</span>
                </div>
                <div>
                  <span className="text-slate-400">Slope f'(x): </span>
                  <span className="text-sky-400 font-bold">{inspectedSlope !== null ? inspectedSlope.toFixed(2) : 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="p-4 bg-[#0a101f] border-t border-violet-500/15 flex items-center justify-between">
            <div className="text-xs text-slate-400 flex items-center gap-4">
              <span>Derivative: <code className="text-sky-300">{analysis.derivativeLatex}</code></span>
              <span>Domain: <code className="text-slate-300">{analysis.domainDescription}</code></span>
            </div>

            <button
              onClick={onOpenAssistant}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/40 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              <span>Ask Math Mentor</span>
            </button>
          </div>
        </div>

        {/* Controls & Parameters */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#080d19] border border-violet-500/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Function Family</span>
              <button
                onClick={() => setParams({ type: 'quadratic', a: 1, b: -2, c: -3, d: 0 })}
                className="text-[11px] text-violet-400 hover:text-violet-300 font-mono"
              >
                Reset
              </button>
            </div>

            {/* Function type buttons */}
            <div className="grid grid-cols-3 gap-1.5">
              {(['quadratic', 'cubic', 'sine', 'rational', 'exponential'] as FunctionType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setParams({ ...params, type: f })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs capitalize transition-colors border ${
                    params.type === f
                      ? 'bg-violet-500/20 border-violet-500 text-violet-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Parameter sliders */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Coefficient a (scale/amplitude):</span>
                  <span className="font-mono text-violet-400 font-bold">{params.a}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={params.a}
                  onChange={(e) => setParams({ ...params, a: parseFloat(e.target.value) })}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Coefficient b (frequency/shift):</span>
                  <span className="font-mono text-violet-400 font-bold">{params.b}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={params.b}
                  onChange={(e) => setParams({ ...params, b: parseFloat(e.target.value) })}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Coefficient c (vertical offset / phase):</span>
                  <span className="font-mono text-violet-400 font-bold">{params.c}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.1"
                  value={params.c}
                  onChange={(e) => setParams({ ...params, c: parseFloat(e.target.value) })}
                  className="w-full accent-violet-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Key Characteristics */}
          <div className="p-5 rounded-2xl bg-[#080d19] border border-violet-500/20 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Analytic Characteristics
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">y-Intercept f(0):</span>
                <span className="font-mono text-white font-bold">{analysis.yIntercept ?? 'None'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Roots / x-Intercepts:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {analysis.roots.length > 0 ? analysis.roots.join(', ') : 'None in ℝ'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Range:</span>
                <span className="font-mono text-violet-300 font-bold">{analysis.rangeDescription}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
