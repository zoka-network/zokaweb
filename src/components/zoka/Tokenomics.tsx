import type { CSSProperties } from "react";
import ParticleFloor from "./ParticleFloor";
import { useReveal } from "./useReveal";
import { useScrollProgress } from "./useScrollProgress";

// Quantic Testnet v2's supply, as the node computes it
// (crates/zoka-pq-pool/src/ledger.rs: `subsidy`, `conventional_fee`):
// block 1 pays the 5M premine, blocks 2..=1,051,201 pay 12 ZKA and the next
// 897,600 blocks pay 6 ZKA; then only fees. 120 s blocks.

const SUPPLY = 23_000_000;

/**
 * One whole in three parts, in the order they are issued. A one-hue ramp
 * (ordinal), validated against the card's surface with the dataviz
 * validator: monotone lightness, visible steps, light end >= 2:1.
 */
const parts = [
  { name: "Team, for development", amount: 5_000_000, when: "Block 1, at genesis · public, spendable from the start", color: "#f4f4f5", ink: "#0a0a0b" },
  { name: "Mining at 12 ZKA per block", amount: 12_614_400, when: "1,051,200 blocks · about 4 years", color: "#a1a1aa", ink: "#0a0a0b" },
  { name: "Mining at 6 ZKA per block", amount: 5_385_600, when: "897,600 blocks · about 3.4 years", color: "#5c5c66", ink: "#fafafa" },
];

const zka = (value: number) => `${value.toLocaleString("en-US")} ZKA`;
const share = (value: number) => `${((value / SUPPLY) * 100).toFixed(1)}%`;

const facts = [
  { value: "120 s", label: "Target block time, kept by ASERT" },
  { value: "0.0001 ZKA", label: "Fee per input or output, at least two; the same for every wallet" },
  { value: "60 blocks", label: "Until a mining reward can be spent, about two hours" },
  { value: "~7.4 years", label: "Until the cap; then miners earn fees, with no tail emission" },
];

const Tokenomics = () => {
  const [ref, { seen, live }] = useReveal<HTMLElement>(0.05);
  useScrollProgress(ref, live);
  return (
    <section ref={ref} id="tokenomics" className="home-panel home-panel-flip" data-seen={seen} data-live={live} aria-labelledby="tokenomics-title">
      <div className="story-arc" aria-hidden="true" />
      <div className="home-panel-inner">
        <div className="home-panel-head">
          <div className="story-head reveal">
            <span className="story-eyebrow">Tokenomics</span>
            <span className="story-rule" aria-hidden="true" />
          </div>
          <h2 id="tokenomics-title" className="story-title reveal" style={{ transitionDelay: ".08s" }}>
            <span>Fixed Supply. </span>
            <span>Mining for Its Users.</span>
          </h2>
          <p className="story-body reveal" style={{ transitionDelay: ".16s" }}>
            Zoka Quantic has a fixed supply of 23,000,000 ZKA. 5,000,000 went to the Zoka team at genesis to fund
            development; the other 18,000,000 can only be mined, block by block, by the people who run the network.
          </p>
        </div>

        <div className="tk-card reveal" style={{ transitionDelay: ".22s" }}>
          <div className="tk-hero">
            <p className="tk-hero-label">Fixed supply</p>
            <p className="tk-hero-value">23,000,000</p>
            <p className="tk-hero-unit">ZKA</p>
          </div>

          <div className="tk-split">
            <div
              className="tk-bar"
              role="group"
              aria-label={`Supply split: ${parts.map((p) => `${p.name}, ${zka(p.amount)}, ${share(p.amount)}`).join("; ")}`}
            >
              {parts.map((part, i) => (
                <div
                  key={part.name}
                  className="tk-seg"
                  role="img"
                  tabIndex={0}
                  aria-label={`${part.name}: ${zka(part.amount)}, ${share(part.amount)}`}
                  style={{ "--w": part.amount / SUPPLY, "--c": part.color, "--ink": part.ink, "--d": `${0.3 + i * 0.18}s` } as CSSProperties}
                >
                  <span className="tk-seg-share" aria-hidden="true">{share(part.amount)}</span>
                  <span className="tk-tip" aria-hidden="true">
                    <strong>{part.name}</strong>
                    {zka(part.amount)} · {share(part.amount)}
                  </span>
                </div>
              ))}
            </div>

            <table className="tk-table">
              <caption className="sr-only">How the 23,000,000 ZKA are issued</caption>
              <thead>
                <tr>
                  <th scope="col">Part</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Share</th>
                  <th scope="col">When</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part) => (
                  <tr key={part.name}>
                    <th scope="row">
                      <span className="tk-swatch" style={{ "--c": part.color } as CSSProperties} aria-hidden="true" />
                      {part.name}
                    </th>
                    <td>{zka(part.amount)}</td>
                    <td>{share(part.amount)}</td>
                    <td>{part.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ul className="tk-facts">
          {facts.map((fact, i) => (
            <li key={fact.value} className="reveal" style={{ transitionDelay: `${0.28 + i * 0.06}s` }}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </li>
          ))}
        </ul>

        <p className="story-note reveal" style={{ transitionDelay: ".4s" }}>
          <span className="story-dot" aria-hidden="true" />
          Testnet v2 rules, test coins of no value · mainnet economics are not final and may follow this model ·{" "}
          <a href="#tech">How it works →</a>
        </p>
      </div>
      <ParticleFloor seed={6.3} />
    </section>
  );
};

export default Tokenomics;
