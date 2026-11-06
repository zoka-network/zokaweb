import { Check } from "lucide-react";

// The roadmap page of Docs (#docs/roadmap): what is done, then 2027 and 2028
// in order, without dates. The only target is the mainnet's, and it waits for
// the external review.

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

const Roadmap = () => (
  <>
    <p>
      Testnet v2 already runs the post-quantum private pool. Next come lighter proofs, open mining and an external
      review; the mainnet launches only when that review passes.
    </p>
    <ol className="road" aria-label="Roadmap">
      {stages.map((stage) => (
        <li key={stage.year} className={`road-stage${stage.done ? " road-done" : ""}`} aria-labelledby={`road-${stage.year}`}>
          <span className="road-node" aria-hidden="true" />
          <div className="road-card">
            <div className="road-head">
              <h4 id={`road-${stage.year}`} className="road-year">
                {stage.year}
              </h4>
              <span className="road-status">{stage.status}</span>
            </div>
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
    <p className="road-note">Order, not dates: an item moves if the review or the network needs it.</p>
  </>
);

export default Roadmap;
