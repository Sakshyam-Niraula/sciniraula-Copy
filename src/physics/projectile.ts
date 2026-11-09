export interface ProjectileParams {
  initialVelocity: number; // m/s (1 - 100)
  launchAngle: number;    // degrees (0 - 90)
  gravity: number;        // m/s^2 (1 - 30)
  launchHeight: number;   // m (0 - 50)
}

export interface TrajectoryPoint {
  time: number; // seconds
  x: number;    // meters
  y: number;    // meters
  vx: number;   // m/s
  vy: number;   // m/s
  speed: number;// m/s
}

export interface ProjectileMetrics {
  vx0: number;
  vy0: number;
  timeOfFlight: number;
  maxHeight: number;
  timeAtMaxHeight: number;
  horizontalRange: number;
  impactSpeed: number;
  impactAngle: number; // degrees
  trajectory: TrajectoryPoint[];
}

export const PLANETARY_PRESETS = [
  { name: 'Earth', g: 9.81, label: '9.81 m/s² (Earth standard)' },
  { name: 'Moon', g: 1.62, label: '1.62 m/s² (1/6 Earth gravity)' },
  { name: 'Mars', g: 3.71, label: '3.71 m/s² (38% Earth gravity)' },
  { name: 'Jupiter', g: 24.79, label: '24.79 m/s² (2.5x Earth gravity)' },
];

export function computeProjectileMetrics(params: ProjectileParams): ProjectileMetrics {
  const { initialVelocity, launchAngle, gravity, launchHeight } = params;
  const rad = (launchAngle * Math.PI) / 180;
  const vx0 = initialVelocity * Math.cos(rad);
  const vy0 = initialVelocity * Math.sin(rad);

  // Time of flight solving y(t) = y0 + vy0*t - 0.5*g*t^2 = 0
  // Quadratic formula: 0.5*g*t^2 - vy0*t - y0 = 0
  const discriminant = vy0 * vy0 + 2 * gravity * launchHeight;
  const timeOfFlight = (vy0 + Math.sqrt(Math.max(0, discriminant))) / gravity;

  const timeAtMaxHeight = vy0 > 0 ? vy0 / gravity : 0;
  const maxHeight = launchHeight + (vy0 > 0 ? (vy0 * vy0) / (2 * gravity) : 0);
  const horizontalRange = vx0 * timeOfFlight;

  // Impact values
  const vyImpact = vy0 - gravity * timeOfFlight;
  const impactSpeed = Math.sqrt(vx0 * vx0 + vyImpact * vyImpact);
  const impactAngle = (Math.atan2(Math.abs(vyImpact), Math.abs(vx0)) * 180) / Math.PI;

  // Generate trajectory points for graph / path
  const numPoints = 120;
  const trajectory: TrajectoryPoint[] = [];
  const dt = timeOfFlight / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const t = Math.min(timeOfFlight, i * dt);
    const x = vx0 * t;
    const y = Math.max(0, launchHeight + vy0 * t - 0.5 * gravity * t * t);
    const vx = vx0;
    const vy = vy0 - gravity * t;
    const speed = Math.sqrt(vx * vx + vy * vy);
    trajectory.push({ time: Number(t.toFixed(3)), x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), vx, vy, speed });
  }

  return {
    vx0: Number(vx0.toFixed(2)),
    vy0: Number(vy0.toFixed(2)),
    timeOfFlight: Number(timeOfFlight.toFixed(2)),
    maxHeight: Number(maxHeight.toFixed(2)),
    timeAtMaxHeight: Number(timeAtMaxHeight.toFixed(2)),
    horizontalRange: Number(horizontalRange.toFixed(2)),
    impactSpeed: Number(impactSpeed.toFixed(2)),
    impactAngle: Number(impactAngle.toFixed(1)),
    trajectory,
  };
}

export function getPositionAtTime(params: ProjectileParams, t: number): TrajectoryPoint {
  const { initialVelocity, launchAngle, gravity, launchHeight } = params;
  const rad = (launchAngle * Math.PI) / 180;
  const vx0 = initialVelocity * Math.cos(rad);
  const vy0 = initialVelocity * Math.sin(rad);

  const x = vx0 * t;
  const y = Math.max(0, launchHeight + vy0 * t - 0.5 * gravity * t * t);
  const vx = vx0;
  const vy = vy0 - gravity * t;
  const speed = Math.sqrt(vx * vx + vy * vy);

  return { time: t, x, y, vx, vy, speed };
}
