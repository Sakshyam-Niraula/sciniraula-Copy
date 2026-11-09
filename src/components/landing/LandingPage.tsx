import React, { useEffect, useRef } from 'react';
import { LABORATORIES, EXPERIMENTS } from '../../data/laboratories';
import { SubjectId } from '../../types';
import { ArrowRight, Play, Atom, Sigma, FlaskConical, Dna, CheckCircle2, Sliders, LineChart, Sparkles, BookOpen, Layers } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string, subParam?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated background scientific simulation canvas in Hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic orbital / particle simulation
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; history: { x: number; y: number }[] }[] = [];
    const colors = ['#38bdf8', '#818cf8', '#06b6d4', '#10b981'];

    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2 + 1.5,
        color: colors[i % colors.length],
        history: [],
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(7, 11, 20, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw faint coordinate grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particles and connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 110)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const featuredExperiments = EXPERIMENTS.filter((e) => e.status === 'active');

  const getSubjectIcon = (sub: SubjectId) => {
    switch (sub) {
      case 'physics': return Atom;
      case 'mathematics': return Sigma;
      case 'chemistry': return FlaskConical;
      case 'biology': return Dna;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-sky-500/10">
        <div className="absolute inset-0 z-0 opacity-60">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AI-Enhanced Virtual STEM Laboratory
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.12]">
            Don't Just Study Science.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
              Experience It.
            </span>
          </h1>

          {/* Supporting Message */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Explore scientific concepts through interactive virtual laboratories, real-time kinematic simulations, and AI-assisted experimentation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
            >
              <CompassIcon className="w-4 h-4 text-slate-950" />
              <span>Explore Laboratories</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => onNavigate('experiment', 'projectile-motion')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 border border-sky-500/30 text-white transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-sky-400" />
              <span>Launch Projectile Simulator</span>
            </button>
          </div>

          {/* Live Quick Metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-left">
              <div className="text-xl font-mono-num font-bold text-sky-400">4 Labs</div>
              <div className="text-xs text-slate-400">Physics, Math, Chem, Bio</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-left">
              <div className="text-xl font-mono-num font-bold text-cyan-400">Real-Time</div>
              <div className="text-xs text-slate-400">Kinematics & Calculations</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-left">
              <div className="text-xl font-mono-num font-bold text-indigo-400">100% Offline</div>
              <div className="text-xs text-slate-400">Usable Without API Keys</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-left">
              <div className="text-xl font-mono-num font-bold text-emerald-400">SI Units</div>
              <div className="text-xs text-slate-400">Scientifically Grounded</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 SUBJECT LABORATORIES PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            Multidisciplinary Virtual Campus
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Four Dedicated Subject Laboratories
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Each laboratory features tailored scientific instruments, dynamic mathematical solvers, and contextual Socratic AI guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LABORATORIES.map((lab) => {
            const Icon = getSubjectIcon(lab.id);
            return (
              <div
                key={lab.id}
                onClick={() => onNavigate('subject', lab.id)}
                className="lab-card lab-card-hover p-6 rounded-2xl cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-slate-800/80 border border-slate-700/60 group-hover:border-sky-500/40 transition-colors">
                    <Icon className="w-6 h-6" style={{ color: lab.accentColor }} />
                  </div>
                  <div className="text-xs font-mono font-medium text-slate-400 mb-1">
                    {lab.activeCount} Active • {lab.upcomingCount} Expansion
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {lab.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {lab.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400">
                  <span>Enter Laboratory</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED INTERACTIVE EXPERIMENTS */}
      <section className="py-20 bg-slate-950/70 border-y border-sky-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Core Interactive Experiences
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Featured Virtual Experiments
              </h2>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="mt-4 md:mt-0 text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>View full experiment catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredExperiments.map((exp) => (
              <div
                key={exp.id}
                className="p-6 rounded-2xl bg-[#0b1222] border border-slate-800/90 hover:border-sky-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/25 uppercase tracking-wide">
                      {exp.subjectId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ~{exp.estimatedMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Real-time Interactive Model</span>
                  </div>
                  <button
                    onClick={() => onNavigate('experiment', exp.id)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center gap-1.5"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW SCINIRAULA WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            The Scientific Method in Action
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">
            How SciNiraula Powers Discovery
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            A continuous loop of hypothesis testing, parameter adjustment, real-time observation, and AI-assisted comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Adjust Parameters</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alter initial velocity, launch angles, gravity, polynomial coefficients, or nuclear charges using tactile sliders and precise numeric inputs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Simulation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Witness kinematic trajectories, Cartesian plots, quantized electron orbitals, and cellular structures animate at smooth 60 FPS.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <LineChart className="w-4 h-4 text-violet-400" />
              <span>Inspect Measurements</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track exact analytical metrics with SI units: flight duration, peak apogee, impact speed, derivative gradients, and isotopic charges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Contextual AI Guidance</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask questions about your specific dialed measurements. Request hints, verify governing equations, and take on-demand concept quizzes.
            </p>
          </div>
        </div>
      </section>

      {/* 5. AI INTEGRATION EXPLANATION (VIRTUAL LAB PRINCIPLE) */}
      <section className="py-20 bg-slate-950/80 border-t border-sky-500/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1528] to-slate-950 border border-sky-500/20 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  SciNiraula AI — Laboratory Assistant
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  An Intelligent Laboratory Mentor, Not a Chatbot
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike conventional chatbots, SciNiraula’s AI assistant directly consumes the dynamic telemetry of your simulation. It knows your exact velocity, launch angle, and calculated range—acting as an interactive laboratory professor guiding your discovery.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3 rounded-xl font-semibold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-slate-950" />
                  <span>Start Experimenting</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function CompassIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
