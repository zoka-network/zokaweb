import { ArrowUpRight, Check, ChevronDown, LockKeyhole, Radio, ShieldCheck } from "lucide-react";
import { NETWORK_REPO } from "./links";
import { MAINNET_NAME, TESTNET_NAME } from "./network";

const layers = [
  { name: "zk-SNARKs, Ironwood & Halo 2", role: "Prove a payment without exposing it.", body: "Zero-knowledge proofs let every node verify that a sender owns a valid note, has not spent it already, and creates no extra money. Quantic uses the unmodified Ironwood action circuit through the Orchard crate, with Halo 2 proofs. The input note and its path in the commitment tree stay inside the proof. A nullifier prevents double spending without publishing which note was spent. There are no rings, key images or trusted-setup ceremony in this construction.", status: "Running on testnet", source: "crates/zoka-quantic", detail: "Halo 2's proof soundness and spend authorization still rely on classical elliptic-curve cryptography. They are not post-quantum today." },
  { name: "X-Wing · X25519 + ML-KEM-768", role: "Encrypt each note for its recipient.", body: "The wallet wraps each note with X-Wing, combining X25519 and the NIST-standardized ML-KEM-768. The recipient uses their secret key to recognize and decrypt the payment and memo. The hybrid design aims to protect archived payments against a future quantum adversary, including one who knows the public receiving address. Amounts are checked in the zero-knowledge proof and hidden on the chain.", status: "Running on testnet", source: "crates/zoka-quantic", detail: "External review of Zoka's integration is still pending. Encryption does not hide the fact that a transaction happened, its timing or its size." },
  { name: "Short addresses & private wallets", role: "Share 57 characters. Keep the keys yourself.", body: "A Quantic Testnet address starts with zqtest1 and fits a standard QR code. It is a BLAKE2b-256 fingerprint of the full address that carries the receiving keys. Wallets publish the full record to a distributed node directory with an Argon2id proof of work against spam. A payer resolves the short address and verifies its fingerprint before encrypting a payment. The 24-word recovery phrase restores the wallet's keys.", status: "Running on testnet", source: "docs/QUANTIC-DIRECCIONES-CORTAS.md", detail: "The published directory record is public. It reveals that an address exists, not its transaction history; sharing it across identities can still link those identities off-chain." },
  { name: "libp2p · Gossipsub · Kademlia", role: "Find peers and move verified data.", body: "libp2p is the node's networking framework. Gossipsub propagates blocks, transactions and address announcements. Kademlia contributes peer discovery, while identify and ping exchange node information and check connections. Each node validates what it receives. Testnet and mainnet have separate protocol IDs, topics, peer lists, ports and data directories.", status: "Implemented in the node", source: "src/network", detail: "Discovery and transport are not consensus. The node still checks proofs, signatures, nullifiers, emission and accumulated work. The Noise transport uses classical X25519." },
  { name: "Tor v3 onion services", role: "Connect without opening router ports.", body: "ZSilent runs Tor and an onion service alongside its node. Other nodes can reach it behind NAT, while outgoing onion connections use Tor's SOCKS proxy. The CLI package also connects through Tor. Manual onion peers let participants connect directly when initial discovery is unavailable. Tor protects the network path; the wallet's cryptography protects payment contents.", status: "Integrated in desktop & CLI", source: "src/network", detail: "Tor is not post-quantum and cannot eliminate traffic correlation by a sufficiently capable observer. It does not automatically protect separate direct transports." },
  { name: "iroh · QUIC · hybrid TLS", role: "Catch up with snapshots from peers.", body: "iroh supplies a separate snapshot transport with QUIC, relay-assisted connectivity and hole punching. Nodes can request chain data from peers and validate the imported blocks. Quantic enables X25519MLKEM768 for hybrid TLS when both sides support it; classical peers can still connect. This layer accelerates synchronization without replacing block validation.", status: "Implemented in the node", source: "src/network/pq_tls.rs", detail: "Direct QUIC and relay use can reveal your IP address to the peer or relay. Hybrid encryption protects traffic contents, not that network metadata." },
  { name: "RandomX · ASERT · Stratum", role: "Secure the chain with CPU work.", body: "Zoka uses standard RandomX rx/0 and a 76-byte work blob compatible with XMRig. ASERT adjusts difficulty around a 120-second target, and nodes select the valid chain with the most accumulated work subject to signed checkpoints. The built-in Stratum server lets each miner use its own address; each block pays the miner that found it. Rewards are private notes and mature after 60 blocks.", status: "Running on testnet", source: "docs/QUANTIC-POOL-DE-MINERIA.md", detail: "Stratum currently provides solo mining through a node. Shared pool rewards and a Zoka-specific P2Pool are future work. Proof-of-work confirmations are probabilistic." },
  { name: "Hybrid checkpoints · Ed25519 + ML-DSA-65", role: "Authenticate the team's chain checkpoints.", body: "Snapshots and authoritative checkpoints carry Ed25519 and ML-DSA-65 signatures. Quantic verifies both. The checkpoint fixes a canonical block at a height and prevents following a conflicting branch below it; it cannot make an invalid block valid, create extra coins or spend a user's wallet. Each network has its own authority keys.", status: "Required by Quantic", source: "src/quantic", detail: "This is declared trust in the team for chain selection. Signatures do not make that authority decentralized or replace independent validation." },
];

const TechSection = () => <div className="space-y-14">
  <div className="tech-intro">
    <p className="text-xl leading-relaxed text-foreground">Zoka Network exists for private payments. Post-quantum research extends that mission: protecting what you send today from what computers may be able to read tomorrow.</p>
    <p>Privacy is the default payment path, from the wallet that creates a note to the wallet that opens it. Proofs let the network validate a payment while its contents stay encrypted. The network layer addresses a different problem: how nodes find each other and communicate.</p>
  </div>

  <section aria-labelledby="journey-title">
    <h3 id="journey-title" className="section-heading">One project. A clear direction.</h3>
    <div className="journey-grid">
      <article><span className="card-label">01 · Our foundation</span><h4>Zenith</h4><p>Our first network built the foundation: the Rust node, wallets, CPU mining and Tor connectivity. It also exposed limits in the original transaction privacy. Those lessons shaped Quantic. Zenith is retired; its balances and addresses do not migrate.</p></article>
      <article className="journey-current"><span className="card-label">02 · Live, with test coins</span><h4>{TESTNET_NAME}</h4><p>A new chain running private Ironwood transactions, Halo 2 proofs, X-Wing note encryption and hybrid checkpoints. We test the full user experience in public. The testnet will restart when the fully post-quantum pool is ready.</p></article>
      <article><span className="card-label">03 · Coming soon</span><h4>{MAINNET_NAME}</h4><p>The destination: private payments with the complete post-quantum protocol and external review. It has no announced launch date. Testnet coins never turn into mainnet coins.</p></article>
    </div>
  </section>

  <section aria-labelledby="payment-flow-title">
    <h3 id="payment-flow-title" className="section-heading">From your wallet to theirs.</h3>
    <div className="payment-flow">
      {[
        ["01", "Prepare", "Your wallet resolves and checks the recipient's short address."],
        ["02", "Seal & prove", "X-Wing encrypts the note. Halo 2 proves the spend without revealing the input note."],
        ["03", "Relay & validate", "Peers relay the transaction. Nodes verify the proof, signatures, nullifiers and fee."],
        ["04", "Receive", "The recipient's wallet scans and decrypts its note locally. Its keys stay on the device."],
      ].map(([number, title, description]) => <article key={number}><span>{number}</span><h4>{title}</h4><p>{description}</p></article>)}
    </div>
  </section>

  <section aria-labelledby="stack-title">
    <h3 id="stack-title" className="section-heading">What each layer does.</h3>
    <p className="mb-6">Open a layer to see how we use it, what is implemented, and where its protection ends.</p>
    <div className="tech-layers">{layers.map((layer, index) => <details key={layer.name}>
      <summary><span className="layer-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{layer.name}</strong><span className="layer-role">{layer.role}</span></span><ChevronDown size={18} aria-hidden="true" /></summary>
      <div className="layer-body"><span className="implementation-status"><Check size={14} aria-hidden="true" />{layer.status}</span><p>{layer.body}</p><p className="layer-limit">{layer.detail}</p><a href={`${NETWORK_REPO}/${layer.source.includes(".") ? "blob" : "tree"}/main/${layer.source}`} target="_blank" rel="noopener noreferrer" className="text-link">Read the implementation <ArrowUpRight size={14} aria-hidden="true" /></a></div>
    </details>)}</div>
  </section>

  <section aria-labelledby="privacy-title">
    <h3 id="privacy-title" className="section-heading">Private payments. Verifiable rules.</h3>
    <div className="privacy-grid">
      <article><LockKeyhole size={22} aria-hidden="true" /><h4>Protected payment details</h4><ul><li>Recipient and payment amount</li><li>The note consumed by a spend</li><li>Encrypted memo, up to 512 bytes</li><li>Wallet secrets and recovery phrase</li></ul></article>
      <article><Radio size={22} aria-hidden="true" /><h4>Public chain information</h4><ul><li>Heights, times and transaction hashes</li><li>Fees, nullifiers and commitments</li><li>Block subsidy and genesis allocation</li><li>Transaction size and timing</li></ul></article>
    </div>
    <p className="mt-5 text-sm">Privacy by default is a protocol choice, not a promise of perfect anonymity. Device compromise, shared identities, network observation and implementation flaws still matter. Independent review is pending.</p>
  </section>

  <section aria-labelledby="economics-title">
    <h3 id="economics-title" className="section-heading">ZKA · The same rules for every node.</h3>
    <div className="economics-grid">{[["23M", "Maximum supply"], ["5M", "Public team allocation at genesis"], ["18M", "Issued through mining"], ["120s", "Target block time"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <p className="mt-5">The team allocation is 21.7% of the cap, with no lock, spendable from the first block after genesis. Mining issues 12 ZKA for 1,051,200 reward-bearing blocks, then 6 ZKA for 897,600 blocks. The cap is reached after roughly 7.4 years at the target pace; mining continues for fees, with no tail emission.</p>
    <p className="mt-3 text-sm">Mining rewards mature after 60 blocks. Wallets use a conventional fee of 0.0001 ZKA per action, with at least two actions. These are test coins on the testnet.</p>
  </section>

  <section className="roadmap-panel" aria-labelledby="next-title">
    <ShieldCheck size={25} aria-hidden="true" /><h3 id="next-title" className="section-heading">Privacy first. Post-quantum all the way.</h3>
    <p>Today's testnet uses hybrid note encryption, but Halo 2 proof validity and spend authorization remain classical. The next private pool is being designed around hash-based STARK proofs, with authorization and balance checks inside the proof. That work is a prototype, not the live consensus.</p>
    <ul className="roadmap-list"><li><span>Now</span>Test private payments, wallets, CPU mining, short addresses and peer synchronization.</li><li><span>Next</span>Finish the new pool, benchmark it on phones, integrate the Android interface and complete external review.</li><li><span>Then</span>Restart Quantic Testnet with the new pool. Launch Zoka Mainnet only with the complete protocol.</li></ul>
    <div className="flex flex-wrap gap-6"><a className="text-link" href="#docs/papers">Read the whitepaper & litepaper →</a><a className="text-link" href="#docs/zsilent">Try the testnet →</a></div>
  </section>
</div>;

export default TechSection;
