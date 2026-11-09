export interface ChemicalElement {
  z: number; // Atomic Number
  symbol: string;
  name: string;
  standardNeutrons: number;
  standardElectrons: number;
  atomicMass: number;
  period: number;
  group: number;
  category: 'Nonmetal' | 'Noble Gas' | 'Alkali Metal' | 'Alkaline Earth' | 'Metalloid' | 'Halogen' | 'Post-transition Metal';
  shells: number[]; // [K, L, M, N]
  color: string;
  summary: string;
}

export const PERIODIC_ELEMENTS: ChemicalElement[] = [
  { z: 1, symbol: 'H', name: 'Hydrogen', standardNeutrons: 0, standardElectrons: 1, atomicMass: 1.008, period: 1, group: 1, category: 'Nonmetal', shells: [1], color: '#38bdf8', summary: 'The lightest and most abundant chemical element in the universe.' },
  { z: 2, symbol: 'He', name: 'Helium', standardNeutrons: 2, standardElectrons: 2, atomicMass: 4.0026, period: 1, group: 18, category: 'Noble Gas', shells: [2], color: '#c084fc', summary: 'Colorless, odorless noble gas with a completely filled 1s orbital.' },
  { z: 3, symbol: 'Li', name: 'Lithium', standardNeutrons: 4, standardElectrons: 3, atomicMass: 6.94, period: 2, group: 1, category: 'Alkali Metal', shells: [2, 1], color: '#f87171', summary: 'Soft, highly reactive alkali metal with a single valence electron.' },
  { z: 4, symbol: 'Be', name: 'Beryllium', standardNeutrons: 5, standardElectrons: 4, atomicMass: 9.0122, period: 2, group: 2, category: 'Alkaline Earth', shells: [2, 2], color: '#fb923c', summary: 'Steel-gray, strong, lightweight alkaline earth metal.' },
  { z: 5, symbol: 'B', name: 'Boron', standardNeutrons: 6, standardElectrons: 5, atomicMass: 10.81, period: 2, group: 13, category: 'Metalloid', shells: [2, 3], color: '#facc15', summary: 'Semiconductor metalloid vital in semiconductor doping and glassmaking.' },
  { z: 6, symbol: 'C', name: 'Carbon', standardNeutrons: 6, standardElectrons: 6, atomicMass: 12.011, period: 2, group: 14, category: 'Nonmetal', shells: [2, 4], color: '#a3e635', summary: 'The chemical backbone of organic chemistry and all terrestrial life.' },
  { z: 7, symbol: 'N', name: 'Nitrogen', standardNeutrons: 7, standardElectrons: 7, atomicMass: 14.007, period: 2, group: 15, category: 'Nonmetal', shells: [2, 5], color: '#4ade80', summary: 'Diatomic gas constituting 78% of Earth\'s atmosphere with a triple covalent bond.' },
  { z: 8, symbol: 'O', name: 'Oxygen', standardNeutrons: 8, standardElectrons: 8, atomicMass: 15.999, period: 2, group: 16, category: 'Nonmetal', shells: [2, 6], color: '#34d399', summary: 'Highly electronegative reactive gas driving aerobic cellular respiration and combustion.' },
  { z: 9, symbol: 'F', name: 'Fluorine', standardNeutrons: 10, standardElectrons: 9, atomicMass: 18.998, period: 2, group: 17, category: 'Halogen', shells: [2, 7], color: '#2dd4bf', summary: 'The most electronegative and chemically reactive of all elements.' },
  { z: 10, symbol: 'Ne', name: 'Neon', standardNeutrons: 10, standardElectrons: 10, atomicMass: 20.180, period: 2, group: 18, category: 'Noble Gas', shells: [2, 8], color: '#818cf8', summary: 'Chemically inert noble gas with a complete valence octet glowing reddish-orange in discharge tubes.' },
  { z: 11, symbol: 'Na', name: 'Sodium', standardNeutrons: 12, standardElectrons: 11, atomicMass: 22.990, period: 3, group: 1, category: 'Alkali Metal', shells: [2, 8, 1], color: '#f87171', summary: 'Readily loses one electron to form stable Na⁺ cations essential for neurobiology.' },
  { z: 12, symbol: 'Mg', name: 'Magnesium', standardNeutrons: 12, standardElectrons: 12, atomicMass: 24.305, period: 3, group: 2, category: 'Alkaline Earth', shells: [2, 8, 2], color: '#fb923c', summary: 'Key cofactor for ATP synthesis and central coordinating ion in chlorophyll molecules.' },
  { z: 13, symbol: 'Al', name: 'Aluminium', standardNeutrons: 14, standardElectrons: 13, atomicMass: 26.982, period: 3, group: 13, category: 'Post-transition Metal', shells: [2, 8, 3], color: '#94a3b8', summary: 'Low-density, corrosion-resistant metallic element used broadly in aerospace.' },
  { z: 14, symbol: 'Si', name: 'Silicon', standardNeutrons: 14, standardElectrons: 14, atomicMass: 28.085, period: 3, group: 14, category: 'Metalloid', shells: [2, 8, 4], color: '#facc15', summary: 'The cornerstone tetravalent semiconductor of modern microelectronics and computation.' },
  { z: 15, symbol: 'P', name: 'Phosphorus', standardNeutrons: 16, standardElectrons: 15, atomicMass: 30.974, period: 3, group: 15, category: 'Nonmetal', shells: [2, 8, 5], color: '#fbbf24', summary: 'Essential element in the sugar-phosphate backbone of DNA/RNA and ATP energy transfer.' },
  { z: 16, symbol: 'S', name: 'Sulfur', standardNeutrons: 16, standardElectrons: 16, atomicMass: 32.06, period: 3, group: 16, category: 'Nonmetal', shells: [2, 8, 6], color: '#eab308', summary: 'Forms disulfide bridges stabilizing tertiary 3D protein folding in biology.' },
  { z: 17, symbol: 'Cl', name: 'Chlorine', standardNeutrons: 18, standardElectrons: 17, atomicMass: 35.45, period: 3, group: 17, category: 'Halogen', shells: [2, 8, 7], color: '#2dd4bf', summary: 'Yellow-green halogen gas forming chloride ions crucial for osmotic cell homeostasis.' },
  { z: 18, symbol: 'Ar', name: 'Argon', standardNeutrons: 22, standardElectrons: 18, atomicMass: 39.948, period: 3, group: 18, category: 'Noble Gas', shells: [2, 8, 8], color: '#a78bfa', summary: 'Third-most abundant atmospheric gas, chemically inert with a completed 3s²3p⁶ octet.' },
  { z: 19, symbol: 'K', name: 'Potassium', standardNeutrons: 20, standardElectrons: 19, atomicMass: 39.098, period: 4, group: 1, category: 'Alkali Metal', shells: [2, 8, 8, 1], color: '#f87171', summary: 'Vital alkali metal ion governing cellular resting membrane potential and nerve action potentials.' },
  { z: 20, symbol: 'Ca', name: 'Calcium', standardNeutrons: 20, standardElectrons: 20, atomicMass: 40.078, period: 4, group: 2, category: 'Alkaline Earth', shells: [2, 8, 8, 2], color: '#fb923c', summary: 'Mineral constituent of bones/teeth and key intracellular secondary messenger for muscle contraction.' },
];

export function calculateShellDistribution(electrons: number): number[] {
  // Capacities for elements up to Z=20: K=2, L=8, M=8, N=2
  const maxCapacities = [2, 8, 8, 2];
  const shells: number[] = [];
  let remaining = electrons;

  for (const cap of maxCapacities) {
    if (remaining <= 0) break;
    const count = Math.min(remaining, cap);
    shells.push(count);
    remaining -= count;
  }
  return shells;
}

export function calculateCharge(protons: number, electrons: number) {
  const netCharge = protons - electrons;
  let ionType: 'neutral' | 'cation' | 'anion' = 'neutral';
  let label = 'Neutral Atom';

  if (netCharge > 0) {
    ionType = 'cation';
    label = `Cation (${netCharge > 1 ? '+' + netCharge : '+'})`;
  } else if (netCharge < 0) {
    ionType = 'anion';
    label = `Anion (${netCharge < -1 ? netCharge : '-'})`;
  }

  return { netCharge, ionType, label };
}

export function calculateNuclearStability(protons: number, neutrons: number) {
  if (protons === 0) return { isStable: false, ratio: 0, description: 'No protons: unstable nucleon cluster.' };
  const ratio = neutrons / protons;
  // For light elements (Z <= 20), N/Z ratio ~ 1.0 to 1.3 is stable
  const isStable = protons === 1 ? (neutrons <= 1) : (ratio >= 0.8 && ratio <= 1.4);
  let description = 'Stable nuclide within the belt of nuclear stability.';
  if (!isStable) {
    description = ratio > 1.4 ? 'Neutron-rich: prone to beta-minus (β⁻) radioactive decay.' : 'Proton-rich: prone to positron emission (β⁺) or electron capture.';
  }
  return { isStable, ratio: Number(ratio.toFixed(2)), description };
}
