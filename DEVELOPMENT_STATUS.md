# SciNiraula — Development Status

**Product:** SciNiraula — AI-Enhanced Virtual STEM Laboratory  
**Official Category:** AI-Enhanced Virtual STEM Laboratory  
**Tagline:** Explore. Experiment. Understand.  
**Version:** 1.0.0 Production Ready  
**Last Updated:** Phase 1-4 Complete  

---

## 1. Product Architectural Compliance
- **Core Principle:** SciNiraula is a **virtual STEM laboratory with AI integrated into it**, NOT a chatbot with laboratory features.
- The laboratory occupies 100% of the primary visual and interactive focus.
- Virtual laboratories and physical simulations remain **fully functional offline** without requiring an AI key or network connection.
- Scientific accuracy verified: Kinematic vector decomposition, Cartesian calculus, Bohr quantum shell capacities ($2n^2$), and cytologic organelle compartmentalization.

---

## 2. Completed Features by Phase

### Phase 1 — Product Foundation
- [x] Modern scientific design system: Deep navy (`#070b14`), electric blue (`#0ea5e9`), cyan (`#06b6d4`), and violet (`#8b5cf6`).
- [x] Custom vector SVG brand identity for SciNiraula (quantum orbitals + optics + laboratory motif).
- [x] Landing Page with animated interactive 60 FPS physics canvas hero, featured experiments, multidisciplinary subject previews, and "How SciNiraula Works" scientific methodology.
- [x] Laboratory Workspace Dashboard with subject cards, genuine progress tracker, search, filters by difficulty, recent experiments, and saved bookmarks.
- [x] Dedicated Subject Laboratory Hubs for all 4 scientific disciplines:
  1. Physics Laboratory
  2. Mathematics Laboratory
  3. Chemistry Laboratory
  4. Biology Laboratory

### Phase 2 — Core Virtual Laboratory Experiences
- [x] **Experiment 1 (Physics): Projectile Motion Laboratory**
  - Real-time kinematic simulation canvas with 60 FPS `requestAnimationFrame`.
  - Adjustable initial velocity ($v_0$: 5–80 m/s), launch angle ($\theta$: 0°–90°), platform elevation ($y_0$: 0–40 m).
  - Gravity presets: Earth ($9.81\,\text{m/s}^2$), Moon ($1.62\,\text{m/s}^2$), Mars ($3.71\,\text{m/s}^2$), Jupiter ($24.79\,\text{m/s}^2$).
  - Vector decomposition arrows ($v_x$, $v_y$, resultant $v$).
  - Live HUD telemetry ($x$, $y$, instantaneous speed $v$).
  - Analytic graphs using Recharts ($y$ vs $x$ kinematic trajectory parabola).
  - Play, pause, scrub timeline, and speed multiplier (0.5x, 1x, 2x).
- [x] **Experiment 2 (Mathematics): Interactive Function Laboratory**
  - Interactive Cartesian coordinate plane with grid lines, axes, origin, and coordinate hover probe.
  - Function families: Quadratic ($ax^2 + bx + c$), Cubic ($ax^3 + bx^2 + cx + d$), Sine ($A\sin(Bx + C) + D$), Rational ($a/(x-b) + c$), Exponential ($ae^{bx} + c$).
  - Real-time analytical computation of roots/x-intercepts, y-intercepts, parabolic vertex extrema, and range.
  - Live first derivative $f'(x)$ tangent line visualization at hover coordinate.
- [x] **Experiment 3 (Chemistry): Atomic Structure Laboratory**
  - Interactive Bohr-Sommerfeld atomic model with revolving quantized electrons along concentric shells ($K=2, L=8, M=8, N=2$).
  - Quick-select periodic table strip for elements 1 to 20 (Hydrogen to Calcium).
  - Custom subatomic particle tuner: protons ($Z$), neutrons ($N$), electrons ($e^-$).
  - Net electrical charge calculation (neutral, cation, anion).
  - Mass number ($A = Z + N$) and nuclear stability / beta-decay prediction.
- [x] **Experiment 4 (Biology): Interactive Cell Laboratory**
  - Vector SVG cytologic cross-sections of eukaryotic Animal and Plant cells.
  - Interactive organelle nodes with dynamic highlight animations.
  - Dissection dossier for Nucleus, Nucleolus, Mitochondria, Chloroplast, Rough ER, Smooth ER, Golgi Apparatus, Central Vacuole, Lysosomes, and Cell Wall.
  - Plant vs. Animal cytologic comparison matrix.
  - Biochemical equations for aerobic cellular respiration and photosynthesis.

### Phase 3 — AI-Enhanced Laboratory Intelligence
- [x] Secure backend endpoint `/api/assistant` via Vite plugin / Express server:
  - Consumes live telemetry, active parameters, and measurements.
  - Never leaks API keys to client bundles.
  - Supports Gemini 2.5 Flash when `GEMINI_API_KEY` is provided in `.env`.
- [x] Resilient offline fallback engine:
  - Deep scientific knowledge base providing Socratic answers tailored to dialed measurements.
  - "Interpret My Results" tool generating physical breakdowns.
  - Step-by-step experimental hints.
  - Dynamic 3-question interactive concept quizzes with immediate answer feedback and explanations.

### Phase 4 — Product Refinement & Infrastructure
- [x] Local storage persistence for bookmarks, completed experiments, and recently explored history.
- [x] Quick search palette modal (hotkey: `⌘K` / `Ctrl+K`).
- [x] Bookmarks side drawer with direct experiment launching.
- [x] Fully responsive layout tested for desktop and mobile viewports.
- [x] Zero TypeScript errors, clean production build verified (`tsc -b && vite build`).
- [x] Dev server tested and verified with HTTP 200 OK.

---

## 3. Verification & Acceptance Criteria
1. **SciNiraula looks and behaves like a virtual STEM laboratory:** Verified. Deep scientific instrumentation styling with real-time simulations.
2. **All four subject laboratories accessible:** Verified (`physics`, `mathematics`, `chemistry`, `biology`).
3. **Four initial experiments work properly:** Verified (Projectile Motion, Function Explorer, Atomic Structure, Cell Explorer).
4. **Users can change parameters and observe meaningful results:** Verified with real-time visual and numerical updates.
5. **Scientific calculations are correct within stated model assumptions:** Verified against kinematic formulas, Cartesian calculus, Bohr quantum levels, and cytologic pathways.
6. **AI assistant understands current experiment context:** Verified; receives active parameters and measurements.
7. **AI failures/absence do not break laboratory functionality:** Verified; offline mode operates seamlessly.
8. **Navigation works:** Verified across all routes, modals, and drawers.
9. **Build passes:** Verified (`npm run build` succeeds in 2.23s).
