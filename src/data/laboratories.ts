import { Laboratory, Experiment } from '../types';

export const LABORATORIES: Laboratory[] = [
  {
    id: 'physics',
    name: 'Physics Laboratory',
    tagline: 'Mechanics, Electromagnetism & Wave Dynamics',
    description: 'Explore the fundamental laws of motion, gravitation, energy, and wave behavior with real-time kinematic solvers and dynamic vector fields.',
    iconName: 'Atom',
    accentColor: '#0ea5e9',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    gradient: 'from-sky-500/20 via-blue-900/30 to-slate-900',
    activeCount: 1,
    upcomingCount: 3,
  },
  {
    id: 'mathematics',
    name: 'Mathematics Laboratory',
    tagline: 'Functions, Calculus & Geometric Modeling',
    description: 'Visualize continuous mathematical phenomena on interactive Cartesian coordinates, inspect derivatives, analyze polynomial transformations, and study limits.',
    iconName: 'Sigma',
    accentColor: '#8b5cf6',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    gradient: 'from-violet-500/20 via-indigo-900/30 to-slate-900',
    activeCount: 1,
    upcomingCount: 3,
  },
  {
    id: 'chemistry',
    name: 'Chemistry Laboratory',
    tagline: 'Atomic Physics, Electronic Shells & Stoichiometry',
    description: 'Investigate atomic structure, electron configurations, isotopic stability, and nuclear charges across the elements of the periodic table.',
    iconName: 'FlaskConical',
    accentColor: '#06b6d4',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    gradient: 'from-cyan-500/20 via-teal-900/30 to-slate-900',
    activeCount: 1,
    upcomingCount: 3,
  },
  {
    id: 'biology',
    name: 'Biology Laboratory',
    tagline: 'Cytology, Cellular Metabolism & Organelle Dynamics',
    description: 'Dissect the microscopic machinery of life. Compare animal and plant cell ultrastructures, examine organelle metabolic duties, and understand cellular respiration.',
    iconName: 'Dna',
    accentColor: '#10b981',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    gradient: 'from-emerald-500/20 via-emerald-900/30 to-slate-900',
    activeCount: 1,
    upcomingCount: 3,
  },
];

export const EXPERIMENTS: Experiment[] = [
  // 1. PHYSICS
  {
    id: 'projectile-motion',
    title: 'Projectile Motion Laboratory',
    subjectId: 'physics',
    difficulty: 'Intermediate',
    shortDescription: 'Simulate two-dimensional kinematic trajectory with variable initial velocity, launch angle, and planetary gravitational fields.',
    description: 'An interactive two-dimensional kinematic simulator. Analyze how initial launch velocity (v₀), launch angle (θ), and gravitational acceleration (g) dictate flight time, maximum apogee, horizontal range, and instantaneous velocity vectors.',
    learningObjectives: [
      'Decompose initial velocity into independent orthogonal components vx and vy.',
      'Deduce how gravity acts solely on the vertical vector while horizontal velocity remains constant in ideal conditions.',
      'Demonstrate why 45° maximizes horizontal range on flat ground in vacuum.',
      'Compare projectile trajectories across Earth, the Moon, Mars, and Jupiter.'
    ],
    assumptions: [
      'Ideal Newtonian flat-Earth model with uniform gravitational field pointing vertically downward.',
      'Air resistance is neglected in base kinematic mode (negligible aerodynamic drag).',
      'The projectile is treated as a point mass with no rotational Magnus effect or Coriolis acceleration.'
    ],
    equations: [
      {
        name: 'Velocity Components',
        formula: 'v_{0x} = v_0 \\cos(\\theta), \\quad v_{0y} = v_0 \\sin(\\theta)',
        explanation: 'Decomposes initial speed into constant horizontal speed and changing vertical speed.'
      },
      {
        name: 'Time of Flight',
        formula: 't_{\\text{flight}} = \\frac{2 v_0 \\sin(\\theta)}{g}',
        explanation: 'Total duration in the air until the projectile returns to launch altitude (y = 0).'
      },
      {
        name: 'Maximum Apogee (Height)',
        formula: 'H_{\\max} = \\frac{(v_0 \\sin(\\theta))^2}{2g}',
        explanation: 'The peak vertical altitude reached when vertical velocity reaches zero (vy = 0).'
      },
      {
        name: 'Horizontal Range',
        formula: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
        explanation: 'The total horizontal displacement achieved at landing on level ground.'
      }
    ],
    tags: ['Kinematics', 'Newtonian Mechanics', 'Vectors', 'Trajectories'],
    featured: true,
    status: 'active',
    estimatedMinutes: 15,
  },
  {
    id: 'simple-harmonic-motion',
    title: 'Simple Harmonic Motion & Pendulums',
    subjectId: 'physics',
    difficulty: 'Intermediate',
    shortDescription: 'Investigate oscillatory mechanics, restoring forces, and resonance in spring-mass and simple pendulum systems.',
    description: 'Analyze hookes law, angular frequency, restoring forces, and conservation of kinetic and potential energy in oscillating systems.',
    learningObjectives: ['Understand period independence of mass for simple pendulums', 'Observe kinetic and potential energy phase exchanges'],
    assumptions: ['Small-angle approximation sin(θ) ≈ θ', 'Frictionless pivot'],
    equations: [
      { name: 'Pendulum Period', formula: 'T = 2\\pi \\sqrt{\\frac{L}{g}}', explanation: 'Period of a simple gravity pendulum.' }
    ],
    tags: ['Oscillations', 'Energy Conservation', 'Harmonics'],
    featured: false,
    status: 'upcoming',
    estimatedMinutes: 20,
  },
  {
    id: 'wave-interference',
    title: 'Wave Interference & Young Double-Slit',
    subjectId: 'physics',
    difficulty: 'Advanced',
    shortDescription: 'Explore coherent wave superposition, constructive and destructive interference fringes.',
    description: 'Visualize wavefront propagation and diffraction patterns from dual coherent monochromatic sources.',
    learningObjectives: ['Calculate fringe spacing from slit separation and wavelength', 'Explain path length difference criteria'],
    assumptions: ['Monochromatic coherent plane wave', 'Far-field Fraunhofer approximation'],
    equations: [
      { name: 'Bright Fringe Condition', formula: 'd \\sin(\\theta) = m\\lambda', explanation: 'Condition for constructive interference.' }
    ],
    tags: ['Wave Optics', 'Diffraction', 'Superposition'],
    featured: false,
    status: 'upcoming',
    estimatedMinutes: 20,
  },

  // 2. MATHEMATICS
  {
    id: 'function-explorer',
    title: 'Interactive Function Laboratory',
    subjectId: 'mathematics',
    difficulty: 'Beginner',
    shortDescription: 'Plot linear, quadratic, cubic, trigonometric, and rational functions dynamically on an interactive Cartesian coordinate system.',
    description: 'Explore the geometry of real-valued single-variable mathematical functions. Adjust polynomial coefficients, phase shifts, amplitudes, and vertical offsets to directly observe roots, y-intercepts, local extrema, and tangent slope derivatives.',
    learningObjectives: [
      'Understand how coefficients a, b, c, and d transform graph scale, vertex position, and curvature.',
      'Locate x-intercepts (real roots) and y-intercepts algebraically and visually.',
      'Observe the geometric meaning of the first derivative f\'(x) as the instantaneous rate of change.',
      'Explore periodic wave behavior, amplitude, and frequency in trigonometric functions.'
    ],
    assumptions: [
      'Functions are evaluated on the real field ℝ over a bounded domain window [-10, 10].',
      'Asymptotes in rational functions reflect division by zero singularities where f(x) is undefined.'
    ],
    equations: [
      {
        name: 'Quadratic Polynomial',
        formula: 'f(x) = ax^2 + bx + c',
        explanation: 'Parabola with vertex at x = -b/(2a) and roots given by the quadratic formula.'
      },
      {
        name: 'Trigonometric Sine Wave',
        formula: 'f(x) = A \\sin(Bx + C) + D',
        explanation: 'Periodic function with amplitude |A|, period 2π/|B|, phase shift -C/B, and vertical shift D.'
      },
      {
        name: 'Instantaneous Derivative',
        formula: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}',
        explanation: 'The slope of the tangent line to the function at any point x.'
      }
    ],
    tags: ['Algebra', 'Calculus', 'Cartesian Graphing', 'Derivatives'],
    featured: true,
    status: 'active',
    estimatedMinutes: 15,
  },
  {
    id: 'calculus-visualizer',
    title: 'Calculus & Riemann Integrals',
    subjectId: 'mathematics',
    difficulty: 'Advanced',
    shortDescription: 'Visualize Riemann summation, fundamental theorem of calculus, and geometric areas under curves.',
    description: 'Transition from finite rectangles to definite integrals by varying subinterval count n.',
    learningObjectives: ['Visualize lower and upper Darboux sums converging to definite integral', 'Connect accumulation function to derivative'],
    assumptions: ['Continuous piecewise smooth functions'],
    equations: [
      { name: 'Definite Integral', formula: '\\int_a^b f(x)dx = \\lim_{n\\to\\infty} \\sum f(x_i^*)\\Delta x', explanation: 'Riemann limit of sum.' }
    ],
    tags: ['Calculus', 'Integration', 'Riemann Sums'],
    featured: false,
    status: 'upcoming',
    estimatedMinutes: 25,
  },

  // 3. CHEMISTRY
  {
    id: 'atomic-structure',
    title: 'Atomic Structure Laboratory',
    subjectId: 'chemistry',
    difficulty: 'Beginner',
    shortDescription: 'Construct atoms from protons, neutrons, and electrons. Visualize quantized Bohr electron shells and calculate net nuclear charge.',
    description: 'Dive into subatomic physics. Select any element from Hydrogen (Z=1) to Calcium (Z=20) or synthesize custom isotopes. Observe the Aufbau principle, electron shell occupancies (K, L, M, N), net electrical charge, and nuclear mass balance.',
    learningObjectives: [
      'Define atomic number Z as the number of protons determining chemical identity.',
      'Calculate mass number A (protons + neutrons) and understand isotopes.',
      'Analyze net electrical charge (protons minus electrons) to distinguish neutral atoms, cations, and anions.',
      'Visualize quantized electron shells conforming to maximum capacities 2n² (2, 8, 8, 2).'
    ],
    assumptions: [
      'Represented using the Bohr-Sommerfeld planetary model for clear pedagogical visualization of quantum energy levels.',
      'Electrostatic attraction balances nuclear charge; relativistic orbital contractions are omitted.'
    ],
    equations: [
      {
        name: 'Mass Number',
        formula: 'A = Z + N',
        explanation: 'Total nucleons in the nucleus (protons Z plus neutrons N).'
      },
      {
        name: 'Net Electrical Charge',
        formula: 'q_{\\text{net}} = Z - n_e',
        explanation: 'Difference between positive nuclear charge and negative electron cloud.'
      },
      {
        name: 'Bohr Shell Capacity',
        formula: 'N_{\\max} = 2n^2',
        explanation: 'Maximum theoretical electrons in principal quantum shell n (n=1: 2, n=2: 8, n=3: 18).'
      }
    ],
    tags: ['Quantum Mechanics', 'Periodic Table', 'Isotopes', 'Electron Shells'],
    featured: true,
    status: 'active',
    estimatedMinutes: 15,
  },
  {
    id: 'chemical-bonding',
    title: 'Chemical Bonding & Molecular Orbitals',
    subjectId: 'chemistry',
    difficulty: 'Intermediate',
    shortDescription: 'Explore ionic, covalent, and metallic bonds with electronegativity gradient mapping.',
    description: 'Synthesize diatomic and polyatomic compounds while tracking shared valence electron pairs.',
    learningObjectives: ['Determine bond polarity from electronegativity differences', 'Predict molecular geometry via VSEPR'],
    assumptions: ['Gas phase at standard temperature and pressure'],
    equations: [
      { name: 'Electronegativity Difference', formula: '\\Delta EN = |\\chi_A - \\chi_B|', explanation: 'Classifies nonpolar, polar, and ionic bonding.' }
    ],
    tags: ['Bonding', 'Molecules', 'VSEPR', 'Electronegativity'],
    featured: false,
    status: 'upcoming',
    estimatedMinutes: 20,
  },

  // 4. BIOLOGY
  {
    id: 'cell-explorer',
    title: 'Interactive Cell Laboratory',
    subjectId: 'biology',
    difficulty: 'Beginner',
    shortDescription: 'Explore eukaryotic animal and plant cells. Inspect individual organelles, their biochemical duties, and structural differences.',
    description: 'An interactive cytologic workspace. Switch between eukaryotic Animal and Plant cell architectures. Select organelles—such as the Nucleus, Mitochondria, Endoplasmic Reticulum, Golgi Apparatus, and Chloroplasts—to inspect their ultrastructure, membrane organization, and role in cellular metabolism.',
    learningObjectives: [
      'Distinguish eukaryotic cell specializations between plant cells (cell wall, chloroplasts, central vacuole) and animal cells (centrosomes, lysosomes).',
      'Explain how the endomembrane system manufactures, modifies, and transports proteins.',
      'Understand the endosymbiotic origin and ATP-producing bioenergetics of mitochondria and chloroplasts.',
      'Correlate organelle structure with cellular respiration and photosynthetic functions.'
    ],
    assumptions: [
      'Generalized eukaryotic plant and animal cell models synthesizing common cellular features.',
      'Organelle proportions are visually optimized for educational clarity and inspection.'
    ],
    equations: [
      {
        name: 'Aerobic Cellular Respiration (Mitochondria)',
        formula: 'C_6H_{12}O_6 + 6O_2 \\longrightarrow 6CO_2 + 6H_2O + \\sim 32\\, \\text{ATP}',
        explanation: 'Oxidation of glucose in the mitochondrial matrix and cristae to generate chemical energy.'
      },
      {
        name: 'Oxygenic Photosynthesis (Chloroplasts)',
        formula: '6CO_2 + 6H_2O + h\\nu \\longrightarrow C_6H_{12}O_6 + 6O_2',
        explanation: 'Conversion of photon energy into glucose stored chemical bonds in thylakoids and stroma.'
      }
    ],
    tags: ['Cytology', 'Organelles', 'Eukaryotes', 'Metabolism'],
    featured: true,
    status: 'active',
    estimatedMinutes: 15,
  },
  {
    id: 'dna-genetics',
    title: 'DNA Transcription & Protein Synthesis',
    subjectId: 'biology',
    difficulty: 'Advanced',
    shortDescription: 'Model the central dogma of molecular biology: DNA replication, transcription to mRNA, and ribosomal translation.',
    description: 'Simulate genetic codon transcription, codon-anticodon matching, and polypeptide chain elongation.',
    learningObjectives: ['Trace complementary base pairing rules A-T and G-C', 'Decode amino acid sequences with genetic codon table'],
    assumptions: ['Standard genetic code without non-canonical amino acids'],
    equations: [
      { name: 'Base Pair Complementarity', formula: '\\text{A} \\leftrightarrow \\text{T(U)}, \\quad \\text{G} \\leftrightarrow \\text{C}', explanation: 'Hydrogen bond pairing specificity.' }
    ],
    tags: ['Genetics', 'DNA', 'RNA', 'Molecular Biology'],
    featured: false,
    status: 'upcoming',
    estimatedMinutes: 25,
  }
];
