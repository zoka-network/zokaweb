import { useId, type CSSProperties } from "react";
import { Check, EyeOff } from "lucide-react";

// The glass objects of the home chapters, drawn here in CSS 3D and SVG.
// They react to the section around them: [data-seen="true"] puts them
// together the first time it is on screen, [data-live="true"] keeps them
// moving only while it is (home.css).

// Made-up details, only to be hidden: what a payment carries and the chain does not show.
const NOTE_FIELDS = [
  { label: "Recipient", value: "zqtest2 9fK3…Qm7x" },
  { label: "Amount", value: "250.00 ZKA" },
  { label: "Memo", value: "Invoice #0042" },
  { label: "Spent note", value: "7c1e…a94f" },
];

/**
 * A glass payment note. As its chapter comes up the screen, a frosted plate
 * slides over the values and blurs them (--cover, from --p); what stays in
 * sight is what every node checks: a valid proof.
 */
export const PrivateNote = () => (
  <div className="glass-private" aria-hidden="true">
    <div className="pnote-tilt">
      <div className="pnote pnote-back" />
      <div className="pnote pnote-front">
        <div className="pnote-head">
          <span>Payment</span>
          <span className="pnote-zk">ZK</span>
        </div>
        <div className="pnote-fields">
          {NOTE_FIELDS.map((field) => (
            <div key={field.label} className="pnote-row">
              <span className="pnote-label">{field.label}</span>
              <span className="pnote-value">{field.value}</span>
            </div>
          ))}
          <div className="pnote-shield">
            <EyeOff size={18} strokeWidth={1.5} />
            <span>Hidden</span>
          </div>
        </div>
        <div className="pnote-foot">
          <span>STARK proof</span>
          <span className="pnote-valid">
            <Check size={13} strokeWidth={2} />
            Valid
          </span>
        </div>
      </div>
    </div>
  </div>
);

const LAYERS = ["STARKs", "Plonky3", "Poseidon2", "FRI"];

/** Four glass slabs stacked in perspective: the layers of the spend proof. */
export const StarkLayers = () => (
  <div className="glass-stark" aria-hidden="true">
    <div className="stark-stack">
      {LAYERS.map((name, i) => (
        <div key={name} className="slab" style={{ "--i": i } as CSSProperties}>
          <div className="slab-float">
            <div className="slab-edge" />
            <div className="slab-face">
              <span className={i === 0 ? "slab-name slab-name-main" : "slab-name"}>{name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** A glass padlock with an orbit: notes sealed with X-Wing. */
export const XWingLock = () => {
  // Unique ids: the lock is drawn twice on the page (its chapter and the card).
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;
  return (
  <div className="glass-lock" aria-hidden="true">
    <svg viewBox="0 0 400 420">
      <defs>
        <linearGradient id={id("lock-body")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".34" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor="#fff" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id={id("lock-edge")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id={id("lock-shackle")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={id("lock-orbit")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".3" stopColor="#fff" stopOpacity=".75" />
          <stop offset=".7" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={id("lock-glow")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g className="lock-orbit-back">
        <ellipse cx="200" cy="280" rx="188" ry="52" transform="rotate(-14 200 280)" fill="none" stroke={url("lock-orbit")} strokeWidth="1.4" opacity=".55" />
      </g>
      <g className="lock-shackle">
        <path d="M128 196 V136 a72 72 0 0 1 144 0 V196" fill="none" stroke={url("lock-shackle")} strokeWidth="30" strokeLinecap="round" opacity=".55" />
        <path d="M128 196 V136 a72 72 0 0 1 144 0 V196" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
        <path d="M118 150 a82 82 0 0 1 66 -78" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="lock-body">
        <rect x="70" y="180" width="260" height="200" rx="46" fill="#0b0b0d" />
        <rect x="70" y="180" width="260" height="200" rx="46" fill={url("lock-body")} stroke={url("lock-edge")} strokeWidth="1.6" />
        <rect x="82" y="192" width="236" height="176" rx="36" fill="none" stroke="#fff" strokeOpacity=".12" />
        <path d="M96 236 a40 40 0 0 1 40 -42 h52" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
        <text x="200" y="296" textAnchor="middle" className="lock-word lock-word-glow" filter={url("lock-glow")}>X-Wing</text>
        <text x="200" y="296" textAnchor="middle" className="lock-word">X-Wing</text>
      </g>
      <g className="lock-orbit-front">
        <path d="M14 316 Q200 384 386 244" fill="none" stroke={url("lock-orbit")} strokeWidth="1.6" transform="rotate(-2 200 280)" />
        <circle className="orbit-spark" cx="300" cy="318" r="3.2" fill="#fff" />
      </g>
    </svg>
  </div>
  );
};

/** Four small glass cubes around a big one, joined by pulsing lines: the nodes. */
const NODES = [
  { x: 16, y: 18 },
  { x: 84, y: 14 },
  { x: 14, y: 84 },
  { x: 86, y: 82 },
];

const Cube = ({ size, className = "" }: { size: number; className?: string }) => (
  <div className={`cube ${className}`.trim()} style={{ "--s": `${size}px` } as CSSProperties}>
    <div className="cube-body">
      <span className="face front" />
      <span className="face back" />
      <span className="face right" />
      <span className="face left" />
      <span className="face top" />
      <span className="face bottom" />
    </div>
  </div>
);

export const NodeCubes = () => (
  <div className="glass-nodes" aria-hidden="true">
    <svg className="node-links" viewBox="0 0 100 100" preserveAspectRatio="none">
      {NODES.map((n, i) => (
        <g key={i}>
          {/* From the big cube's edge, not its centre: the glass would show the line inside. */}
          <line className="node-line" x1={50 + (n.x - 50) * 0.34} y1={50 + (n.y - 50) * 0.34} x2={n.x} y2={n.y} pathLength={100} />
          <line className="node-pulse" x1={50 + (n.x - 50) * 0.34} y1={50 + (n.y - 50) * 0.34} x2={n.x} y2={n.y} pathLength={100} style={{ animationDelay: `${i * 0.45}s` }} />
        </g>
      ))}
    </svg>
    {NODES.map((n, i) => (
      <div
        key={i}
        className="node node-small"
        style={{ "--x": `${n.x}%`, "--y": `${n.y}%`, "--d": `${0.2 + i * 0.1}s` } as CSSProperties}
      >
        <Cube size={54} />
      </div>
    ))}
    <div className="node node-main" style={{ left: "50%", top: "50%" }}>
      <Cube size={132} className="cube-main" />
    </div>
  </div>
);
