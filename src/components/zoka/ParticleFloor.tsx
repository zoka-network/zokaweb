import { useMemo } from "react";

/**
 * A floor of dots in perspective, rising in soft waves, like the bottom of the
 * Quantic cards. One path per row: a few dozen SVG elements, not thousands.
 */
const ROWS = 22;
const COLS = 96;
const WIDTH = 1600;
const HEIGHT = 320;

function rows(seed: number) {
  const out: { d: string; opacity: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    const t = r / (ROWS - 1); // 0 far, 1 near
    const spread = 0.55 + 1.15 * t;
    const base = 36 + Math.pow(t, 1.7) * (HEIGHT - 70);
    const size = 0.9 + 1.9 * t;
    let d = "";
    for (let c = 0; c < COLS; c++) {
      const u = c / (COLS - 1) - 0.5;
      const x = WIDTH / 2 + u * WIDTH * spread;
      const wave = Math.sin(u * 9 + t * 4.2 + seed) * 22 + Math.sin(u * 23 - t * 2.6 + seed * 2) * 7;
      const y = base - wave * (0.35 + 0.65 * t);
      if (x < -10 || x > WIDTH + 10) continue;
      d += `M${x.toFixed(1)} ${y.toFixed(1)}h${size.toFixed(2)}v${size.toFixed(2)}h-${size.toFixed(2)}z`;
    }
    out.push({ d, opacity: 0.12 + 0.62 * Math.pow(t, 1.3) });
  }
  return out;
}

const ParticleFloor = ({ seed = 0, className = "" }: { seed?: number; className?: string }) => {
  const paths = useMemo(() => rows(seed), [seed]);
  return (
    <div className={`particle-floor ${className}`.trim()} aria-hidden="true">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMax slice">
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill="#fff" opacity={p.opacity} />
        ))}
      </svg>
    </div>
  );
};

export default ParticleFloor;
