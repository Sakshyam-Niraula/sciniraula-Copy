# SciNiraula — AI-Enhanced Virtual STEM Laboratory

> **Tagline:** Explore. Experiment. Understand.  
> **Official Category:** AI-Enhanced Virtual STEM Laboratory

---

## 🔬 Core Product Principle

**SciNiraula is a VIRTUAL STEM LABORATORY WITH AI INTEGRATED INTO IT. It is NOT an AI chatbot with laboratory features.**

The laboratory is the product. The AI is a supporting scientific intelligence layer.
- Virtual laboratories and physical simulations remain **100% operational offline** without requiring an API key.
- Simulations use mathematically rigorous formulas (kinematics, Cartesian analysis, Bohr quantum shells, and eukaryotic cytology).
- Real-time animations run at 60 FPS on HTML Canvas & SVG.
- Contextual AI Laboratory Assistant consumes live simulation parameters and measurements to provide Socratic guidance, hints, result interpretations, and concept quizzes.

---

## 🧭 Multidisciplinary Laboratories & Experiments

### 1. 🌌 Physics Laboratory
- **Projectile Motion Laboratory** (*Active*): 2D kinematic simulation with real-time vector arrows ($v_x$, $v_y$, resultant $v$), variable launch speed ($v_0$), angle ($\theta$), planetary gravity presets (Earth $9.81\,\text{m/s}^2$, Moon $1.62\,\text{m/s}^2$, Mars $3.71\,\text{m/s}^2$, Jupiter $24.79\,\text{m/s}^2$), platform elevation, time scrubber, apex/range markers, and trajectory graphs.
- *Roadmap*: Simple Harmonic Motion & Pendulums, Wave Interference & Double-Slit, DC Circuit Laboratory.

### 2. 📐 Mathematics Laboratory
- **Interactive Function Laboratory** (*Active*): Interactive Cartesian coordinate plane plotting quadratic, cubic, sine, rational, and exponential functions. Dynamic coefficient sliders ($a, b, c, d$), analytical roots, y-intercepts, parabolic vertex extrema, interactive coordinate inspection, and live tangent line first derivative $f'(x)$.
- *Roadmap*: Calculus & Riemann Integrals, 3D Geometry Explorer, Probability Simulator.

### 3. ⚛️ Chemistry Laboratory
- **Atomic Structure Laboratory** (*Active*): Interactive Bohr-Sommerfeld planetary model with 20 elements (Hydrogen to Calcium). Subatomic particle tuner (protons $Z$, neutrons $N$, electrons $e^-$), quantized electron shells ($K, L, M, N$), net charge / ion classification (neutral, cation, anion), mass number $A$, and nuclear stability / radioactive decay predictors.
- *Roadmap*: Chemical Bonding & Molecular Orbitals, Chemical Reaction Kinetics, Acid-Base Titration.

### 4. 🧬 Biology Laboratory
- **Interactive Cell Laboratory** (*Active*): Eukaryotic Animal and Plant cell cytological diagrams with clickable organelle dissection (Nucleus, Nucleolus, Mitochondria, Chloroplasts, Rough ER, Smooth ER, Golgi apparatus, Central Vacuole, Lysosomes, Cell Wall, Plasma Membrane). Detailed metabolic duties, biochemical pathways, and plant vs. animal comparison matrix.
- *Roadmap*: DNA Transcription & Protein Synthesis, Human Circulatory System, Natural Selection Simulator.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts, Canvas-Confetti
- **Rendering:** HTML Canvas (60 FPS `requestAnimationFrame`), Vector SVG
- **Persistence:** LocalStorage for saved bookmarks, completed labs, and recently visited history
- **Backend / AI Integration:** Vite Server Plugin / Express middleware reading `GEMINI_API_KEY` from environment variables. Fully secure; keys are never exposed in client code.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key if you want live Gemini 2.5 Flash responses:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, SciNiraula automatically uses its built-in offline educational intelligence engine.)*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## 📜 Scientific Accuracy & Pedagogy

1. **Newtonian Mechanics**: Kinematics equations analytically solved:
   $$x(t) = v_{0x} t, \quad y(t) = y_0 + v_{0y} t - \frac{1}{2} g t^2$$
2. **Standard SI Units**: Meters ($\text{m}$), seconds ($\text{s}$), meters per second ($\text{m/s}$), meters per second squared ($\text{m/s}^2$), atomic mass units ($\text{u}$).
3. **Explicit Assumptions**: Every virtual experiment lists governing equations, variable definitions, and model limitations (e.g. neglected air drag, point mass assumptions, or Bohr planetary approximations).
