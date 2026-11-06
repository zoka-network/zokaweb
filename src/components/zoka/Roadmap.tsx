import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import ParticleFloor from "./ParticleFloor";
import { useReveal } from "./useReveal";
import { useScrollProgress } from "./useScrollProgress";

// The roadmap of the home: what is done, then 2027 and 2028 in order, without
// dates. The only target is the mainnet's, and it waits for the external review.

interface Stage {
  year: string;
  status: string;
  done?: boolean;
  items: string[];
  mainnet?: { name: string; target: string };
}

const stages: Stage[] = [
  {
    year: "2026",
    status: "Done",
    done: true,
    items: [
      "Post-quantum private pool live on Quantic Testnet v2",
      "ZSilent, ZKAPriv and the web wallet",
      "XMRig mining, ZokaScan and a test-coin faucet",
    ],
  },
  {
    year: "2027",
    status: "Next, in order",
    items: [
      "Smaller proofs: tuned FRI, aggregation or recursion",
      "Signed releases and Zoka's own relays",
      "Mining pools: Monero pool software and a pool tab in ZSilent",
      "External review and a testnet bug bounty",
      "A final testnet with frozen formats",
    ],
    mainnet: { name: "Zoka Quantic Mainnet", target: "Target: Q4 2027, once the external review passes" },
  },
  {
    year: "2028",
    status: "After mainnet",
    items: [
      "Shared mining without custody, in the style of P2Pool",
      "Team checkpoints retired as the network grows",
      "Metadata privacy: Dandelion++ relay, fixed transaction shapes, better Tor (always optional)",
      "Payment proofs and a payments API for merchants",
      "A second review: the post-quantum soundness of the proof",
      "An iOS wallet as adoption grows; hardware wallet research",
    ],
  },
];

const Roadmap = () => {
  const [ref, { seen, live }] = useReveal<HTMLElement>(0.05);
  useScrollProgress(ref, live);
  return (
    <section ref={ref} id="roadmap" className="home-panel" data-seen={seen} data-live={live} aria-labelledby="roadmap-title">
      <div className="story-arc" aria-hidden="true" />
      <div className="home-panel-inner">
        <div className="home-panel-head">
          <div className="story-head reveal">
            <span className="story-eyebrow">Roadmap</span>
            <span className="story-rule" aria-hidden="true" />
          </div>
          <h2 id="roadmap-title" className="story-title reveal" style={{ transitionDelay: ".08s" }}>
            <span>The Road to </span>
            <span>Mainnet and Beyond</span>
          </h2>
          <p className="story-body reveal" style={{ transitionDelay: ".16s" }}>
            Testnet v2 already runs the post-quantum private pool. Next come lighter proofs, open mining and an
            external review; the mainnet launches only when that review passes.
          </p>
        </div>

        <div className="road">
          <div className="road-rail" aria-hidden="true">
            <span className="road-rail-fill" />
          </div>
          <ol className="road-stages">
            {stages.map((stage, i) => (
              <li
                key={stage.year}
                className={`road-stage${stage.done ? " road-done" : ""}`}
                style={{ "--d": `${0.15 + i * 0.12}s` } as CSSProperties}
                aria-labelledby={`road-${stage.year}`}
              >
                <span className="road-node" aria-hidden="true" />
                <div className="road-card">
                  <p className="road-status">{stage.status}</p>
                  <h3 id={`road-${stage.year}`} className="road-year">
                    {stage.year}
                  </h3>
                  <ul className="road-items">
                    {stage.items.map((item) => (
                      <li key={item}>
                        {stage.done ? (
                          <Check size={14} strokeWidth={2} aria-hidden="true" />
                        ) : (
                          <span className="road-bullet" aria-hidden="true" />
                        )}
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {stage.mainnet && (
                    <div className="road-mainnet">
                      <strong>{stage.mainnet.name}</strong>
                      <span>{stage.mainnet.target}</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="story-note reveal" style={{ transitionDelay: ".3s" }}>
          <span className="story-dot" aria-hidden="true" />
          Order, not dates: an item moves if the review or the network needs it ·{" "}
          <a href="#tech">How it works →</a>
        </p>
      </div>
      <ParticleFloor seed={5.1} />
    </section>
  );
};

export default Roadmap;
