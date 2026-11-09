import React, { useState, useEffect, useRef } from 'react';
import { ProjectileParams, ProjectileMetrics, computeProjectileMetrics, PLANETARY_PRESETS, getPositionAtTime } from '../../physics/projectile';
import { Play, Pause, RotateCcw, FastForward, Sparkles, Sliders, LineChart, BookOpen, Layers } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ProjectileMotionLabProps {
  onUpdateTelemetry: (params: Record<string, any>, measurements: Record<string, any>) => void;
  onOpenAssistant: () => void;
}

export const ProjectileMotionLab: React.FC<ProjectileMotionLabProps> = ({
  onUpdateTelemetry,
  onOpenAssistant,
}) => {
  // Parameters
  const [params, setParams] = useState<ProjectileParams>({
    initialVelocity: 30, // m/s
    launchAngle: 45,     // deg
    gravity: 9.81,       // m/s^2 (Earth)
    launchHeight: 0,     // m
  });

  // Simulation playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'canvas' | 'graphs' | 'equations'>('canvas');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Compute metrics
  const metrics: ProjectileMetrics = computeProjectileMetrics(params);

  // Report telemetry to parent / AI assistant
  useEffect(() => {
    onUpdateTelemetry(
      {
        initialVelocity: `${params.initialVelocity} m/s`,
        launchAngle: `${params.launchAngle}°`,
        gravity: `${params.gravity} m/s²`,
        launchHeight: `${params.launchHeight} m`,
      },
      {
        horizontalRange: `${metrics.horizontalRange} m`,
        maxHeight: `${metrics.maxHeight} m`,
        timeOfFlight: `${metrics.timeOfFlight} s`,
        vx0: `${metrics.vx0} m/s`,
        vy0: `${metrics.vy0} m/s`,
        impactSpeed: `${metrics.impactSpeed} m/s`,
      }
    );
  }, [params, metrics, onUpdateTelemetry]);

  // Current projectile coordinates at simTime
  const currentPos = getPositionAtTime(params, Math.min(simTime, metrics.timeOfFlight));

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current !== null) {
        const deltaSeconds = (timestamp - lastTimestampRef.current) / 1000;
        setSimTime((prev) => {
          const next = prev + deltaSeconds * speedMultiplier;
          if (next >= metrics.timeOfFlight) {
            setIsPlaying(false);
            return metrics.timeOfFlight;
          }
          return next;
        });
      }
      lastTimestampRef.current = timestamp;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, metrics.timeOfFlight, speedMultiplier]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    // Coordinate conversion scales
    const maxGraphX = Math.max(metrics.horizontalRange * 1.15, 60);
    const maxGraphY = Math.max(metrics.maxHeight * 1.3, 30);

    const paddingLeft = 50;
    const paddingBottom = 40;
    const paddingTop = 20;
    const paddingRight = 30;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingBottom - paddingTop;

    const toCanvasX = (x: number) => paddingLeft + (x / maxGraphX) * plotWidth;
    const toCanvasY = (y: number) => height - paddingBottom - (y / maxGraphY) * plotHeight;

    // Clear background
    ctx.fillStyle = '#090e1a';
    ctx.fillRect(0, 0, width, height);

    // Draw coordinate grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const yGridStep = Math.max(5, Math.pow(10, Math.floor(Math.log10(maxGraphY))) / 2);
    for (let yVal = 0; yVal <= maxGraphY; yVal += yGridStep) {
      const cy = toCanvasY(yVal);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, cy);
      ctx.lineTo(width - paddingRight, cy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`${Math.round(yVal)}m`, 14, cy + 3);
    }

    // Vertical grid lines
    const xGridStep = Math.max(10, Math.pow(10, Math.floor(Math.log10(maxGraphX))) / 2);
    for (let xVal = 0; xVal <= maxGraphX; xVal += xGridStep) {
      const cx = toCanvasX(xVal);
      ctx.beginPath();
      ctx.moveTo(cx, paddingTop);
      ctx.lineTo(cx, height - paddingBottom);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`${Math.round(xVal)}m`, cx - 10, height - 20);
    }

    // Ground line
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, toCanvasY(0));
    ctx.lineTo(width - paddingRight, toCanvasY(0));
    ctx.stroke();

    // Launch Cannon / Platform
    const launchCanvasX = toCanvasX(0);
    const launchCanvasY = toCanvasY(params.launchHeight);

    if (params.launchHeight > 0) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(launchCanvasX - 10, launchCanvasY, 20, toCanvasY(0) - launchCanvasY);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(launchCanvasX - 10, launchCanvasY, 20, toCanvasY(0) - launchCanvasY);
    }

    // Cannon barrel pointing in launch direction
    const cannonLen = 28;
    const rad = (params.launchAngle * Math.PI) / 180;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(launchCanvasX, launchCanvasY);
    ctx.lineTo(launchCanvasX + cannonLen * Math.cos(rad), launchCanvasY - cannonLen * Math.sin(rad));
    ctx.stroke();

    // Theoretical Trajectory Curve
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i < metrics.trajectory.length; i++) {
      const pt = metrics.trajectory[i];
      const cx = toCanvasX(pt.x);
      const cy = toCanvasY(pt.y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Realized Path traveled so far
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < metrics.trajectory.length; i++) {
      const pt = metrics.trajectory[i];
      if (pt.time <= simTime) {
        const cx = toCanvasX(pt.x);
        const cy = toCanvasY(pt.y);
        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
    }
    ctx.stroke();

    // Apex marker
    const apexX = toCanvasX(metrics.vx0 * metrics.timeAtMaxHeight);
    const apexY = toCanvasY(metrics.maxHeight);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(apexX, apexY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px monospace';
    ctx.fillText(`Hmax: ${metrics.maxHeight}m`, apexX - 25, apexY - 8);

    // Range marker
    const rangeX = toCanvasX(metrics.horizontalRange);
    const rangeY = toCanvasY(0);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(rangeX, rangeY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#34d399';
    ctx.font = '10px monospace';
    ctx.fillText(`Range: ${metrics.horizontalRange}m`, rangeX - 35, rangeY + 16);

    // Active Projectile Ball & Vectors
    const ballCanvasX = toCanvasX(currentPos.x);
    const ballCanvasY = toCanvasY(currentPos.y);

    // Vector arrows
    const vectorScale = 0.8;
    // vx arrow (horizontal, cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ballCanvasX, ballCanvasY);
    ctx.lineTo(ballCanvasX + currentPos.vx * vectorScale, ballCanvasY);
    ctx.stroke();

    // vy arrow (vertical, rose)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ballCanvasX, ballCanvasY);
    ctx.lineTo(ballCanvasX, ballCanvasY - currentPos.vy * vectorScale);
    ctx.stroke();

    // Resultant velocity arrow (yellow)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ballCanvasX, ballCanvasY);
    ctx.lineTo(ballCanvasX + currentPos.vx * vectorScale, ballCanvasY - currentPos.vy * vectorScale);
    ctx.stroke();

    // Glowing projectile body
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ballCanvasX, ballCanvasY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }, [params, metrics, simTime, currentPos]);

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
  };

  const handlePlayToggle = () => {
    if (simTime >= metrics.timeOfFlight) {
      setSimTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. TOP SIMULATION VIEWPORT & CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Canvas Area */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-[#090e1a] border border-sky-500/20 shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-[#0d1627] border-b border-sky-500/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Kinematic Vector Simulation
              </span>
              <span className="text-[11px] font-mono text-sky-400">
                (t = {simTime.toFixed(2)}s / {metrics.timeOfFlight}s)
              </span>
            </div>

            {/* View Switcher: Simulation Canvas vs Analytic Graphs vs Governing Equations */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'canvas' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Canvas
              </button>
              <button
                onClick={() => setActiveTab('graphs')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'graphs' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Graphs
              </button>
              <button
                onClick={() => setActiveTab('equations')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'equations' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Equations
              </button>
            </div>
          </div>

          {/* Canvas or Graphs or Equations container */}
          <div className="relative w-full h-[380px] sm:h-[420px] bg-[#090e1a]">
            {activeTab === 'canvas' && (
              <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
            )}

            {activeTab === 'graphs' && (
              <div className="w-full h-full p-4 flex flex-col justify-between">
                <div className="text-xs font-semibold text-slate-300 mb-2">
                  Altitude y(x) vs Horizontal Displacement x (Kinematic Parabola)
                </div>
                <ResponsiveContainer width="100%" height="85%">
                  <RechartsLine data={metrics.trajectory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Distance x (m)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Height y (m)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#0284c7', fontSize: 12 }}
                      formatter={(val: any) => [`${val} m`, 'Height']}
                      labelFormatter={(label) => `x: ${label} m`}
                    />
                    <Line type="monotone" dataKey="y" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'equations' && (
              <div className="w-full h-full p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-sky-400 mb-1">Horizontal Kinematics (Zero Acceleration)</h4>
                  <p className="font-mono text-white text-sm mb-1">x(t) = v₀ · cos(θ) · t</p>
                  <p className="text-slate-400">Because gravity acts purely downwards (ay = -g), horizontal velocity vx remains constant throughout flight.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-sky-400 mb-1">Vertical Kinematics (Gravitational Deceleration)</h4>
                  <p className="font-mono text-white text-sm mb-1">y(t) = y₀ + v₀ · sin(θ) · t - ½ g t²</p>
                  <p className="text-slate-400">Vertical velocity decreases linearly: vy(t) = v₀ · sin(θ) - g t. At peak altitude, vy = 0.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-sky-400 mb-1">Maximum Range Derivation (Level Ground)</h4>
                  <p className="font-mono text-white text-sm mb-1">R = (v₀² · sin(2θ)) / g</p>
                  <p className="text-slate-400">Range is maximized when sin(2θ) = 1, which strictly requires 2θ = 90° ⇒ θ = 45°.</p>
                </div>
              </div>
            )}

            {/* In-simulation HUD Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-sky-500/20 text-[11px] font-mono flex items-center gap-4 text-slate-300">
              <div>
                <span className="text-slate-400">x: </span>
                <span className="text-white font-bold">{currentPos.x.toFixed(1)}m</span>
              </div>
              <div>
                <span className="text-slate-400">y: </span>
                <span className="text-white font-bold">{currentPos.y.toFixed(1)}m</span>
              </div>
              <div>
                <span className="text-slate-400">Speed: </span>
                <span className="text-cyan-400 font-bold">{currentPos.speed.toFixed(1)}m/s</span>
              </div>
            </div>

            {/* Vector Legend */}
            <div className="hidden sm:flex absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] items-center gap-3">
              <span className="flex items-center gap-1 text-cyan-400 font-mono">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> vx
              </span>
              <span className="flex items-center gap-1 text-rose-400 font-mono">
                <span className="w-2.5 h-0.5 bg-rose-400 inline-block" /> vy
              </span>
              <span className="flex items-center gap-1 text-yellow-400 font-mono">
                <span className="w-2.5 h-0.5 bg-yellow-400 inline-block" /> Resultant v
              </span>
            </div>
          </div>

          {/* Time Scrubber & Playback Controls */}
          <div className="p-4 bg-[#0b1424] border-t border-sky-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayToggle}
                className={`p-2.5 rounded-xl font-bold transition-colors ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
                }`}
                title={isPlaying ? 'Pause simulation' : 'Launch / Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Speed Multiplier */}
              <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1 text-xs">
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSpeedMultiplier(spd)}
                    className={`px-2 py-0.5 rounded font-mono ${
                      speedMultiplier === spd ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slider */}
            <div className="flex-1 w-full sm:max-w-md flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">0s</span>
              <input
                type="range"
                min="0"
                max={metrics.timeOfFlight || 1}
                step="0.01"
                value={simTime}
                onChange={(e) => {
                  setIsPlaying(false);
                  setSimTime(parseFloat(e.target.value));
                }}
                className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">{metrics.timeOfFlight}s</span>
            </div>

            {/* AI Assistant button */}
            <button
              onClick={onOpenAssistant}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500/20 to-blue-600/20 hover:from-sky-500/30 hover:to-blue-600/30 text-sky-300 border border-sky-500/40 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Ask AI Mentor</span>
            </button>
          </div>
        </div>

        {/* Control Panel (Sliders & Parameters) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-sky-500/20 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Control Panel</span>
              </div>
              <button
                onClick={() => setParams({ initialVelocity: 30, launchAngle: 45, gravity: 9.81, launchHeight: 0 })}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-mono"
              >
                Reset Defaults
              </button>
            </div>

            {/* Initial Velocity v0 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Initial Velocity (v₀):</span>
                <span className="font-mono text-sky-400 font-bold">{params.initialVelocity} m/s</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={params.initialVelocity}
                onChange={(e) => {
                  setParams({ ...params, initialVelocity: Number(e.target.value) });
                  setSimTime(0);
                }}
                className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Launch Angle theta */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Launch Angle (θ):</span>
                <span className="font-mono text-sky-400 font-bold">{params.launchAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={params.launchAngle}
                onChange={(e) => {
                  setParams({ ...params, launchAngle: Number(e.target.value) });
                  setSimTime(0);
                }}
                className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Launch Platform Height y0 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Platform Elevation (y₀):</span>
                <span className="font-mono text-sky-400 font-bold">{params.launchHeight} m</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={params.launchHeight}
                onChange={(e) => {
                  setParams({ ...params, launchHeight: Number(e.target.value) });
                  setSimTime(0);
                }}
                className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Planetary Gravity Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Gravitational Field (g):</span>
                <span className="font-mono text-sky-400 font-bold">{params.gravity} m/s²</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PLANETARY_PRESETS.map((planet) => (
                  <button
                    key={planet.name}
                    onClick={() => {
                      setParams({ ...params, gravity: planet.g });
                      setSimTime(0);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left border ${
                      params.gravity === planet.g
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>{planet.name}</div>
                    <div className="text-[10px] text-slate-400">{planet.g} m/s²</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Measurements Panel */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-sky-500/20 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Scientific Measurements (SI)
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Horizontal Range</span>
                <span className="font-mono text-base font-bold text-sky-400">{metrics.horizontalRange} m</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Max Height (Apex)</span>
                <span className="font-mono text-base font-bold text-amber-400">{metrics.maxHeight} m</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Flight Duration</span>
                <span className="font-mono text-base font-bold text-emerald-400">{metrics.timeOfFlight} s</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Impact Velocity</span>
                <span className="font-mono text-base font-bold text-rose-400">{metrics.impactSpeed} m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
