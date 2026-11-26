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
      "Post-quantum private pool live on Quantic Testnet v3",
      "ZSilent, ZKAPriv and the web wallet",
      "XMRig mining, ZokaScan and a test-coin faucet",
      "Network upgrades instead of restarts: proof v4, 3 to 10 times smaller, from block 10,000",
      "Signed releases: Ed25519 + ML-DSA-65, checkable with OpenSSL",
    ],
  },
  {
    year: "2027",
    status: "Next, in order",
    items: [
      "Zoka's own relays",
      "Mining pools: Monero pool software and a pool tab in ZSilent",
      "External review and a testnet bug bounty",
      "Formats frozen on the testnet, reached by upgrades, not restarts",
    ],
    mainnet: { name: "Zoka Quantic Mainnet", target: "Target: Q4 2027, once the external review passes" },
  },
  {
    year: "2028",
    status: "After mainnet",
    items: [
      "Shared mining without custody, in the style of P2Pool",
      "Team checkpoints retired as the network grows",
      "Metadata privacy: Dandelion++ relay and better Tor (always optional)",
      "Payment proofs and a payments API for merchants",
      "A second review: the post-quantum soundness of the proof",
      "Proof aggregation as a network upgrade, once recursion is practical on an ordinary PC",
      "An iOS wallet as adoption grows; hardware wallet research",
    ],
  },
];

const Roadmap = () => (
  <>
    <p>
      Testnet v3 already runs the post-quantum private pool, and it changes through network upgrades without restarting
      the chain. Next come signed releases, open mining and an external review; the mainnet launches only when that
      review passes, and it never restarts.
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
