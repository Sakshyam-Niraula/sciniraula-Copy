export type FunctionType = 'quadratic' | 'cubic' | 'sine' | 'rational' | 'exponential';

export interface FunctionParams {
  type: FunctionType;
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface FunctionPoint {
  x: number;
  y: number | null; // null for discontinuities / asymptotes
}

export interface FunctionAnalysis {
  formulaLatex: string;
  derivativeLatex: string;
  yIntercept: number | null;
  roots: number[];
  extrema: { type: 'minimum' | 'maximum' | 'inflection'; x: number; y: number }[];
  domainDescription: string;
  rangeDescription: string;
  asymptotes: { vertical?: number; horizontal?: number };
}

export function evaluateFunction(params: FunctionParams, x: number): number | null {
  const { type, a, b, c, d } = params;
  switch (type) {
    case 'quadratic':
      return a * x * x + b * x + c;
    case 'cubic':
      return a * x * x * x + b * x * x + c * x + d;
    case 'sine':
      return a * Math.sin(b * x + c) + d;
    case 'rational': {
      const denom = x - b;
      if (Math.abs(denom) < 1e-4) return null; // asymptote
      return a / denom + c;
    }
    case 'exponential': {
      const val = a * Math.exp(b * x) + c;
      return Math.abs(val) > 1e4 ? null : val;
    }
    default:
      return 0;
  }
}

export function evaluateDerivative(params: FunctionParams, x: number): number | null {
  const { type, a, b, c } = params;
  switch (type) {
    case 'quadratic':
      return 2 * a * x + b;
    case 'cubic':
      return 3 * a * x * x + 2 * b * x + c;
    case 'sine':
      return a * b * Math.cos(b * x + c);
    case 'rational': {
      const denom = (x - b) * (x - b);
      if (Math.abs(denom) < 1e-6) return null;
      return -a / denom;
    }
    case 'exponential':
      return a * b * Math.exp(b * x);
    default:
      return 0;
  }
}

export function analyzeFunction(params: FunctionParams): FunctionAnalysis {
  const { type, a, b, c, d } = params;

  let formulaLatex = '';
  let derivativeLatex = '';
  let yIntercept: number | null = evaluateFunction(params, 0);
  const roots: number[] = [];
  const extrema: { type: 'minimum' | 'maximum' | 'inflection'; x: number; y: number }[] = [];
  let domainDescription = 'All real numbers x ∈ ℝ';
  let rangeDescription = 'All real numbers y ∈ ℝ';
  const asymptotes: { vertical?: number; horizontal?: number } = {};

  if (type === 'quadratic') {
    const signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    formulaLatex = `f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b !== 0 ? signB + 'x' : ''} ${c !== 0 ? signC : ''}`;
    derivativeLatex = `f'(x) = ${2 * a}x ${b !== 0 ? signB : ''}`;

    // Vertex
    if (a !== 0) {
      const vx = -b / (2 * a);
      const vy = evaluateFunction(params, vx)!;
      extrema.push({
        type: a > 0 ? 'minimum' : 'maximum',
        x: Number(vx.toFixed(3)),
        y: Number(vy.toFixed(3)),
      });
      rangeDescription = a > 0 ? `y ≥ ${vy.toFixed(2)}` : `y ≤ ${vy.toFixed(2)}`;

      // Roots via discriminant
      const disc = b * b - 4 * a * c;
      if (disc > 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        roots.push(Number(r1.toFixed(3)), Number(r2.toFixed(3)));
        roots.sort((p, q) => p - q);
      } else if (Math.abs(disc) < 1e-7) {
        roots.push(Number((-b / (2 * a)).toFixed(3)));
      }
    }
  } else if (type === 'cubic') {
    formulaLatex = `f(x) = ${a}x^3 + ${b}x^2 + ${c}x + ${d}`;
    derivativeLatex = `f'(x) = ${3 * a}x^2 + ${2 * b}x + ${c}`;
    // Stationary points via f'(x) = 0
    if (a !== 0) {
      const da = 3 * a;
      const db = 2 * b;
      const dc = c;
      const disc = db * db - 4 * da * dc;
      if (disc > 0) {
        const x1 = (-db + Math.sqrt(disc)) / (2 * da);
        const x2 = (-db - Math.sqrt(disc)) / (2 * da);
        const y1 = evaluateFunction(params, x1)!;
        const y2 = evaluateFunction(params, x2)!;
        extrema.push({ type: 'maximum', x: Number(x2.toFixed(3)), y: Number(y2.toFixed(3)) });
        extrema.push({ type: 'minimum', x: Number(x1.toFixed(3)), y: Number(y1.toFixed(3)) });
      }
    }
  } else if (type === 'sine') {
    formulaLatex = `f(x) = ${a}\\sin(${b}x + ${c}) + ${d}`;
    derivativeLatex = `f'(x) = ${Number((a * b).toFixed(2))}\\cos(${b}x + ${c})`;
    rangeDescription = `[${(d - Math.abs(a)).toFixed(2)}, ${(d + Math.abs(a)).toFixed(2)}]`;
    // Find roots in window [-10, 10]
    for (let x = -10; x <= 10; x += 0.05) {
      const y1 = evaluateFunction(params, x);
      const y2 = evaluateFunction(params, x + 0.05);
      if (y1 !== null && y2 !== null && y1 * y2 <= 0) {
        roots.push(Number(x.toFixed(2)));
        if (roots.length >= 6) break;
      }
    }
  } else if (type === 'rational') {
    formulaLatex = `f(x) = \\frac{${a}}{x - ${b}} + ${c}`;
    derivativeLatex = `f'(x) = -\\frac{${a}}{(x - ${b})^2}`;
    domainDescription = `x ∈ ℝ, x ≠ ${b}`;
    rangeDescription = `y ∈ ℝ, y ≠ ${c}`;
    asymptotes.vertical = b;
    asymptotes.horizontal = c;
    if (c !== 0) {
      const rootX = b - a / c;
      roots.push(Number(rootX.toFixed(3)));
    }
  } else if (type === 'exponential') {
    formulaLatex = `f(x) = ${a}e^{${b}x} + ${c}`;
    derivativeLatex = `f'(x) = ${Number((a * b).toFixed(2))}e^{${b}x}`;
    asymptotes.horizontal = c;
    rangeDescription = a > 0 ? `y > ${c}` : `y < ${c}`;
    if (a !== 0 && -c / a > 0 && b !== 0) {
      const rootX = Math.log(-c / a) / b;
      roots.push(Number(rootX.toFixed(3)));
    }
  }

  return {
    formulaLatex,
    derivativeLatex,
    yIntercept: yIntercept !== null ? Number(yIntercept.toFixed(3)) : null,
    roots,
    extrema,
    domainDescription,
    rangeDescription,
    asymptotes,
  };
}
