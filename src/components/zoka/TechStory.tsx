import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Fingerprint, Network, ShieldCheck } from "lucide-react";
import { NodeCubes, StarkLayers, XWingLock } from "./GlassVisuals";
import ParticleFloor from "./ParticleFloor";
import { useReveal } from "./useReveal";
import { useScrollProgress } from "./useScrollProgress";

/** Tor has no Lucide icon: a small onion in the same strokes. */
const Onion = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.5c0 1.6-.6 2.4-1.2 2.9C7.6 8 5.5 10.8 5.5 14.2c0 3.8 2.9 6.3 6.5 6.3s6.5-2.5 6.5-6.3c0-3.4-2.1-6.2-5.3-7.8-.6-.5-1.2-1.3-1.2-2.9Z" />
    <path d="M12 8.4c-2.1 1.4-3.6 3.4-3.6 5.8 0 2.4 1.6 4.1 3.6 4.1" />
    <path d="M12 11.3c-1 .9-1.6 1.9-1.6 3 0 1.2.7 2 1.6 2" />
  </svg>
);

interface Chapter {
  id: string;
  title: [string, string];
  body: string;
  pills: ReactNode;
  visual: ReactNode;
}

const chapters: Chapter[] = [
  {
    id: "stark",
    title: ["Private Spending", "Without ECDSA"],
    body: "Zoka Quantic authorizes private transactions using STARKs, replacing the traditional elliptic-curve signatures vulnerable to quantum attacks.",
    pills: (
      <div className="story-pill">
        <ShieldCheck size={24} strokeWidth={1.4} aria-hidden="true" />
        <ul aria-label="Proof system">
          <li>STARKs</li>
          <li>Plonky3</li>
          <li>Poseidon2</li>
          <li>FRI</li>
        </ul>
      </div>
    ),
    visual: <StarkLayers />,
  },
  {
    id: "xwing",
    title: ["Post-Quantum Encryption", "for Transactions"],
    body: "Transaction notes are encrypted with X-Wing, a hybrid scheme that combines ML-KEM-768 (post-quantum) and X25519 (classical) to protect your privacy even in a quantum future.",
    pills: (
      <ul className="story-pair" aria-label="X-Wing combines">
        <li className="story-pill story-pill-tall">
          <strong>ML-KEM-768</strong>
          <span>Post-Quantum</span>
        </li>
        <li className="story-plus" aria-hidden="true">+</li>
        <li className="story-pill story-pill-tall">
          <strong>X25519</strong>
          <span>Classical</span>
        </li>
      </ul>
    ),
    visual: <XWingLock />,
  },
  {
    id: "network",
    title: ["Secure Network", "and Node Identity"],
    body: "Nodes are authenticated with ML-DSA-65 (Dilithium), a post-quantum digital signature, and communicate through a hybrid channel (X25519MLKEM768) over QUIC/iroh, with optional Tor for added privacy.",
    pills: (
      <ul className="story-pill story-pill-split" aria-label="Network layers">
        <li>
          <Fingerprint size={24} strokeWidth={1.4} aria-hidden="true" />
          <span>
            <strong>ML-DSA-65</strong>
            <small>Node Identity</small>
          </span>
        </li>
        <li>
          <Network size={24} strokeWidth={1.4} aria-hidden="true" />
          <span>
            <strong>QUIC / iroh</strong>
            <small>X25519MLKEM768</small>
          </span>
        </li>
        <li>
          <Onion />
          <span>
            <strong>Tor</strong>
            <small>Optional</small>
          </span>
        </li>
      </ul>
    ),
    visual: <NodeCubes />,
  },
];

const ChapterSection = ({ chapter, index }: { chapter: Chapter; index: number }) => {
  const [ref, { seen, live }] = useReveal<HTMLElement>(0.05);
  // The objects follow the scroll while the chapter is on screen (--p).
  useScrollProgress(ref, live);
  const titleId = `story-${chapter.id}`;
  return (
    <section
      ref={ref}
      className={`story-chapter${index % 2 === 1 ? " story-flip" : ""}`}
      data-seen={seen}
      data-live={live}
      aria-labelledby={titleId}
    >
      <div className="story-arc" aria-hidden="true" />
      <div className="story-inner">
        <div className="story-text">
          <div className="story-head reveal" style={{ transitionDelay: "0s" }}>
            <span className="story-eyebrow">Post-quantum technology</span>
            <span className="story-rule" aria-hidden="true" />
            <span className="story-count">
              <ChevronLeft size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>
                {index + 1} / {chapters.length}
              </span>
              <ChevronRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </div>
          <h2 id={titleId} className="story-title reveal" style={{ transitionDelay: ".08s" }}>
            <span>{chapter.title[0]} </span>
            <span>{chapter.title[1]}</span>
          </h2>
          <p className="story-body reveal" style={{ transitionDelay: ".16s" }}>
            {chapter.body}
          </p>
          <div className="reveal" style={{ transitionDelay: ".24s" }}>
            {chapter.pills}
          </div>
          <p className="story-note reveal" style={{ transitionDelay: ".32s" }}>
            <span className="story-dot" aria-hidden="true" />
            Running on Quantic Testnet v2 · external review pending ·{" "}
            <a href="#tech">How it works →</a>
          </p>
        </div>
        <div className="story-visual">{chapter.visual}</div>
      </div>
      <ParticleFloor seed={index * 1.7} />
    </section>
  );
};

const TechStory = () => (
  <div id="technology" className="tech-story">
    {chapters.map((chapter, index) => (
      <ChapterSection key={chapter.id} chapter={chapter} index={index} />
    ))}
  </div>
);

export default TechStory;
