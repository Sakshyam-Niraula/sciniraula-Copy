import { QuizQuestion } from '../types';

export interface AIRequestContext {
  experimentId: string;
  experimentTitle: string;
  parameters: Record<string, any>;
  measurements: Record<string, any>;
  prompt?: string;
  type?: 'ask' | 'interpret' | 'hint' | 'quiz';
}

export interface AIResponse {
  configured: boolean;
  source: 'gemini' | 'offline';
  reply: string;
  suggestedActions?: string[];
  quiz?: QuizQuestion[];
}

export async function requestAIAssistant(context: AIRequestContext): Promise<AIResponse> {
  try {
    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.configured && data.reply && !data.error) {
        return {
          configured: true,
          source: 'gemini',
          reply: data.reply,
          suggestedActions: generateFollowUpActions(context),
        };
      }
    }
  } catch (e) {
    // Backend unreachable, fallback seamlessly to offline intelligence
  }

  // Fallback to internal scientific knowledge engine
  return generateOfflineResponse(context);
}

function generateFollowUpActions(context: AIRequestContext): string[] {
  switch (context.experimentId) {
    case 'projectile-motion':
      return [
        'Why does doubling velocity quadruple the range?',
        'Compare Earth gravity to the Moon',
        'What happens to flight time at 90° launch?',
      ];
    case 'function-explorer':
      return [
        'What does the derivative f\'(x) represent here?',
        'How does coefficient "a" alter curvature?',
        'Show where the roots (x-intercepts) occur',
      ];
    case 'atomic-structure':
      return [
        'Why do electrons fill the K-shell before L-shell?',
        'What makes this atom an ion?',
        'How does neutron count affect nuclear stability?',
      ];
    case 'cell-explorer':
      return [
        'Why do plant cells require both mitochondria and chloroplasts?',
        'How does the central vacuole maintain turgor pressure?',
        'Trace protein secretion through the endomembrane system',
      ];
    default:
      return ['Explain governing formulas', 'Give an experimental hint', 'Take a quick concept quiz'];
  }
}

function generateOfflineResponse(context: AIRequestContext): AIResponse {
  const { experimentId, parameters, measurements, prompt = '', type } = context;
  const pLower = prompt.toLowerCase();

  // 1. PROJECTILE MOTION
  if (experimentId === 'projectile-motion') {
    const v0 = parameters.initialVelocity || 25;
    const theta = parameters.launchAngle || 45;
    const g = parameters.gravity || 9.81;
    const range = measurements.horizontalRange || 0;
    const maxH = measurements.maxHeight || 0;
    const tFlight = measurements.timeOfFlight || 0;

    if (type === 'quiz') {
      return {
        configured: false,
        source: 'offline',
        reply: 'Here is a quick concept quiz generated for your current projectile settings:',
        quiz: [
          {
            id: 'q1',
            question: `With launch angle θ = ${theta}°, if you double the initial launch speed from ${v0} m/s to ${v0 * 2} m/s, what happens to the horizontal range?`,
            options: ['It doubles (2x)', 'It quadruples (4x)', 'It remains unchanged', 'It increases by √2'],
            correctIndex: 1,
            explanation: 'The kinematic range formula is R = (v₀² · sin(2θ)) / g. Because R is proportional to the square of velocity (v₀²), doubling velocity multiplies range by 2² = 4.',
          },
          {
            id: 'q2',
            question: 'At the apex of the projectile trajectory, what is true about the instantaneous vertical velocity vy?',
            options: ['vy is equal to initial velocity v0', 'vy is equal to zero (vy = 0)', 'vy is at its negative maximum', 'vy depends on the mass'],
            correctIndex: 1,
            explanation: 'At the maximum altitude (apogee), the vertical motion momentarily ceases before downward acceleration reverses the direction: vy(t_apex) = 0.',
          },
          {
            id: 'q3',
            question: `Your current gravitational acceleration is g = ${g} m/s². If you launched this projectile on the Moon (g = 1.62 m/s²), the flight time would:`,
            options: ['Decrease significantly', 'Increase by about 6 times', 'Stay exactly identical', 'Become negative'],
            correctIndex: 1,
            explanation: 'Flight time is inversely proportional to gravity: t = (2 v₀ sin θ) / g. Weaker gravity provides slower vertical deceleration, greatly extending the flight duration.',
          }
        ]
      };
    }

    if (type === 'hint') {
      return {
        configured: false,
        source: 'offline',
        reply: `💡 **Socratic Hint**: Notice that horizontal velocity $v_x = v_0 \\cos(\\theta)$ never changes during flight because there is no horizontal acceleration ($a_x = 0$). Only the vertical component $v_y$ experiences gravitational deceleration ($a_y = -${g}\\,\\text{m/s}^2$). Try comparing a launch at ${theta}° with a launch at ${90 - theta}°: what do you observe about the landing range?`,
        suggestedActions: generateFollowUpActions(context),
      };
    }

    if (type === 'interpret' || pLower.includes('interpret') || pLower.includes('result')) {
      return {
        configured: false,
        source: 'offline',
        reply: `### Scientific Interpretation of Your Results

- **Launch Configuration:** $v_0 = ${v0}\\,\\text{m/s}$ at $\\theta = ${theta}^\\circ$ under $g = ${g}\\,\\text{m/s}^2$.
- **Observed Range:** $R = ${range}\\,\\text{m}$
- **Observed Apogee:** $H_{\\max} = ${maxH}\\,\\text{m}$
- **Flight Duration:** $t = ${tFlight}\\,\\text{s}$

**Key Physical Insights:**
1. **Kinematic Decomposition:** The initial velocity splits into $v_{0x} = ${(v0 * Math.cos(theta * Math.PI / 180)).toFixed(2)}\\,\\text{m/s}$ and $v_{0y} = ${(v0 * Math.sin(theta * Math.PI / 180)).toFixed(2)}\\,\\text{m/s}$.
2. **Parabolic Path:** Because $x(t) \\propto t$ and $y(t) \\propto -t^2$, eliminating time yields a downward parabola $y(x) = x\\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}$.
3. **Range Optimization:** On level ground, range is maximized when $\\sin(2\\theta)$ reaches its theoretical maximum of $1.0$, which occurs when $2\\theta = 90^\\circ \\implies \\theta = 45^\\circ$.`,
        suggestedActions: generateFollowUpActions(context),
      };
    }

    return {
      configured: false,
      source: 'offline',
      reply: `In this simulation, the projectile travels under ideal Newtonian mechanics. With your settings ($v_0 = ${v0}\\,\\text{m/s}$, $\\theta = ${theta}^\\circ$, $g = ${g}\\,\\text{m/s}^2$), gravity constantly pulls downward at $a_y = -${g}\\,\\text{m/s}^2$ while $v_x$ remains fixed at ${(v0 * Math.cos(theta * Math.PI / 180)).toFixed(2)}\\,\\text{m/s}$. That produces an apex of ${maxH}\\,\\text{m}$ and a horizontal displacement of ${range}\\,\\text{m}$.`,
      suggestedActions: generateFollowUpActions(context),
    };
  }

  // 2. FUNCTION EXPLORER
  if (experimentId === 'function-explorer') {
    const fType = parameters.type || 'quadratic';
    const a = parameters.a ?? 1;
    const b = parameters.b ?? 0;
    const c = parameters.c ?? 0;

    if (type === 'quiz') {
      return {
        configured: false,
        source: 'offline',
        reply: 'Concept Quiz: Mathematical Functions & Derivatives',
        quiz: [
          {
            id: 'm1',
            question: `For the quadratic function f(x) = ax² + bx + c, what is the x-coordinate of the parabolic vertex?`,
            options: ['x = -b / (2a)', 'x = b / (2a)', 'x = -c / a', 'x = √(b² - 4ac)'],
            correctIndex: 0,
            explanation: 'Setting the derivative f\'(x) = 2ax + b = 0 yields the critical point x = -b / (2a).',
          },
          {
            id: 'm2',
            question: 'What does the first derivative f\'(x) represent geometrically on a Cartesian graph?',
            options: ['The area under the curve', 'The instantaneous slope of the tangent line', 'The distance from the origin', 'The average value of f(x)'],
            correctIndex: 1,
            explanation: 'f\'(x) is the limit of the secant slopes, defining the exact rate of change and tangent gradient at that point.',
          }
        ]
      };
    }

    return {
      configured: false,
      source: 'offline',
      reply: `### Function Analysis: ${fType.toUpperCase()}
- **Parameters:** $a = ${a}, b = ${b}, c = ${c}$
- **Derivative Meaning:** The rate of change tells you where the function is increasing ($f'(x) > 0$), decreasing ($f'(x) < 0$), or stationary ($f'(x) = 0$).
- **Geometric Behavior:** Changing $a$ controls vertical stretching or compression and orientation; parameter $b$ shifts the symmetry axis; and $c$ applies a direct vertical translation.`,
      suggestedActions: generateFollowUpActions(context),
    };
  }

  // 3. ATOMIC STRUCTURE
  if (experimentId === 'atomic-structure') {
    const protons = parameters.protons ?? 6;
    const neutrons = parameters.neutrons ?? 6;
    const electrons = parameters.electrons ?? 6;
    const symbol = parameters.symbol || 'C';
    const name = parameters.name || 'Carbon';

    if (type === 'quiz') {
      return {
        configured: false,
        source: 'offline',
        reply: 'Concept Quiz: Atomic Structure & Electron Configurations',
        quiz: [
          {
            id: 'c1',
            question: `What fundamental subatomic particle strictly defines the elemental identity of an atom?`,
            options: ['Protons (Atomic Number Z)', 'Neutrons (N)', 'Electrons (e⁻)', 'Valence Photons'],
            correctIndex: 0,
            explanation: 'The atomic number Z (number of nuclear protons) uniquely defines which element the atom belongs to on the periodic table.',
          },
          {
            id: 'c2',
            question: 'According to the Bohr model, what is the maximum electron capacity of the K shell (principal quantum number n = 1)?',
            options: ['2 electrons', '8 electrons', '18 electrons', '32 electrons'],
            correctIndex: 0,
            explanation: 'Using the shell capacity formula N = 2n², for n = 1 we have 2(1)² = 2 electrons.',
          }
        ]
      };
    }

    const netCharge = protons - electrons;
    const massNumber = protons + neutrons;

    return {
      configured: false,
      source: 'offline',
      reply: `### Atomic Structure Analysis: ${name} (${symbol})
- **Protons (Z):** ${protons} — dictates positive nuclear pull and chemical identity.
- **Neutrons (N):** ${neutrons} — mass number $A = ${massNumber}$.
- **Electrons (e⁻):** ${electrons} — net charge is ${netCharge > 0 ? '+' + netCharge : netCharge < 0 ? netCharge : '0 (Neutral)'}.
- **Shell Occupancy:** Electrons fill the innermost quantized energy levels first ($K=2$, $L=8$, $M=8$) to minimize total electrostatic potential energy (Aufbau principle).`,
      suggestedActions: generateFollowUpActions(context),
    };
  }

  // 4. CELL EXPLORER
  if (experimentId === 'cell-explorer') {
    const organelle = parameters.selectedOrganelleName || 'Nucleus';
    const cellType = parameters.cellType || 'animal';

    if (type === 'quiz') {
      return {
        configured: false,
        source: 'offline',
        reply: 'Concept Quiz: Cytology & Cellular Bioenergetics',
        quiz: [
          {
            id: 'b1',
            question: 'Which of the following organelles is found exclusively in plant cells and NOT in typical animal cells?',
            options: ['Chloroplasts and Cell Wall', 'Mitochondria and Golgi apparatus', 'Ribosomes and Lysosomes', 'Smooth Endoplasmic Reticulum'],
            correctIndex: 0,
            explanation: 'Plant cells uniquely possess cellulose cell walls, photosynthetic chloroplasts, and a large central vacuole.',
          },
          {
            id: 'b2',
            question: 'What is the primary metabolic role of the mitochondria?',
            options: ['Generating ATP via oxidative phosphorylation', 'Synthesizing ribosomal RNA', 'Fixing atmospheric carbon dioxide', 'Degrading lipid vesicles with acidic hydrolases'],
            correctIndex: 0,
            explanation: 'Mitochondria are the powerhouses of eukaryotic cells, coupling electron transport to proton gradient phosphorylation to synthesize ATP.',
          }
        ]
      };
    }

    return {
      configured: false,
      source: 'offline',
      reply: `### Cytological Analysis: ${organelle} (${cellType === 'plant' ? 'Plant Cell' : 'Animal Cell'})
- **Structural Role:** In eukaryotic cytology, the ${organelle} contributes to cellular compartmentalization, ensuring specialized biochemical reactions proceed at optimal local pH and substrate concentrations without interference.
- **Evolutionary Significance:** Eukaryotic organelles like mitochondria and chloroplasts originated via endosymbiosis, retaining circular DNA and double membranes.`,
      suggestedActions: generateFollowUpActions(context),
    };
  }

  // Generic fallback
  return {
    configured: false,
    source: 'offline',
    reply: `Welcome to the SciNiraula Virtual STEM Laboratory. You are currently exploring **${context.experimentTitle}**. Adjust parameters in the control panel to see real-time updates in the simulation and numerical measurements.`,
    suggestedActions: ['Explain governing formulas', 'Give a hint', 'Generate a quiz'],
  };
}
