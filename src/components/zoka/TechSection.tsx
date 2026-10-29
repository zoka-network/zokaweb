import { ArrowUpRight, Check, ChevronDown, LockKeyhole, Radio, ShieldCheck } from "lucide-react";
import { NETWORK_REPO } from "./links";
import { MAINNET_NAME, TESTNET_NAME } from "./network";

const layers = [
  { name: "STARK proofs · Plonky3 & Poseidon2", role: "Prove a payment without exposing it.", body: "Zero-knowledge proofs let every node verify that a sender owns a valid note, has not spent it already, and creates no extra money. Testnet v2 proves each spend with a STARK built with Plonky3 over the Poseidon2 hash. The proof checks the spending key, the balance and the note's path in the commitment tree, and those stay inside it. A nullifier prevents double spending without publishing which note was spent. STARKs rest on hash functions instead of elliptic curves and need no trusted setup.", status: "Running on testnet", source: "crates/zoka-pq-pool", detail: "STARK proofs are large: about 2 MB for a simple payment. The construction and Zoka's code still await external review." },
  { name: "X-Wing · X25519 + ML-KEM-768", role: "Encrypt each note for its recipient.", body: "The wallet wraps each note with X-Wing, combining X25519 and the NIST-standardized ML-KEM-768. The recipient uses their secret key to recognize and decrypt the payment and memo. The hybrid design aims to protect archived payments against a future quantum adversary, including one who knows the public receiving address. Amounts are checked in the zero-knowledge proof and hidden on the chain.", status: "Running on testnet", source: "crates/zoka-quantic", detail: "External review of Zoka's integration is still pending. Encryption does not hide the fact that a transaction happened, its timing or its size." },
  { name: "Short addresses & private wallets", role: "Share 57 characters. Keep the keys yourself.", body: "A Quantic Testnet v2 address starts with zqtest2 and fits a standard QR code. It is a BLAKE2b-256 fingerprint of the full address that carries the receiving keys. Wallets publish the full record to a distributed node directory with an Argon2id proof of work against spam. A payer resolves the short address and verifies its fingerprint before encrypting a payment. The 24-word recovery phrase restores the wallet's keys.", status: "Running on testnet", source: "docs/QUANTIC-DIRECCIONES-CORTAS.md", detail: "The published directory record is public. It reveals that an address exists, not its transaction history; sharing it across identities can still link those identities off-chain." },
  { name: "iroh · QUIC · hybrid TLS · ML-DSA", role: "Find peers without opening router ports.", body: "Nodes talk over QUIC with iroh. Every connection negotiates hybrid X25519MLKEM768 TLS and carries the server's ML-DSA-65 signature, bound to that connection. n0's relays and address lookup let nodes behind NAT reach each other and punch direct paths, so nobody opens a router port and no Tor is needed. Seeds are pinned by their endpoint id and the fingerprint of their ML-DSA key; peers learned from other nodes are dialed and authenticated before they are shared. Each node validates every block it receives, whoever serves it.", status: "Running on testnet", source: "src/quantic/stark_net.rs", detail: "Relays and direct QUIC connections can reveal your IP address to the peer or relay. Hybrid encryption protects traffic contents, not that network metadata." },
  { name: "RandomX · ASERT · Stratum", role: "Secure the chain with CPU work.", body: "Zoka uses standard RandomX rx/0 and a 76-byte work blob compatible with XMRig. ASERT adjusts difficulty around a 120-second target, and nodes select the valid chain with the most accumulated work subject to signed checkpoints. On testnet v2 the node does not mine by itself: XMRig mines through the node's Stratum server, and each block pays the miner that found it. Rewards are private notes and mature after 60 blocks.", status: "Running on testnet", source: "docs/QUANTIC-POOL-DE-MINERIA.md", detail: "Stratum currently provides solo mining through a node. Shared pool rewards and a Zoka-specific P2Pool are future work. Proof-of-work confirmations are probabilistic." },
  { name: "Hybrid checkpoints · Ed25519 + ML-DSA-65", role: "Authenticate the team's chain checkpoints.", body: "Authoritative checkpoints carry Ed25519 and ML-DSA-65 signatures. Quantic verifies both. The checkpoint fixes a canonical block at a height and prevents following a conflicting branch below it; it cannot make an invalid block valid, create extra coins or spend a user's wallet. Each network has its own authority keys.", status: "Required by Quantic", source: "src/quantic", detail: "This is declared trust in the team for chain selection. Signatures do not make that authority decentralized or replace independent validation." },
];

const TechSection = () => <div className="space-y-14">
  <div className="tech-intro">
    <p className="text-xl leading-relaxed text-foreground">Zoka Quantic is a blockchain with zero-knowledge proofs and private payments by default. On Quantic Testnet v2 its private pool is post-quantum from end to end.</p>
    <p>Every payment carries a STARK proof that validates the spend while keeping its private details hidden. X-Wing combines classical and post-quantum encryption to seal each note for its recipient, and nodes and checkpoints sign with ML-DSA. This is the foundation of Zoka Quantic: privacy from end to end, with post-quantum protection built into the protocol.</p>
  </div>

  <section aria-labelledby="journey-title">
    <h3 id="journey-title" className="section-heading">One project. A clear direction.</h3>
    <div className="journey-grid">
      <article><span className="card-label">01 · Our foundation</span><h4>Zenith</h4><p>Our first network built the foundation: the Rust node, wallets, CPU mining and Tor connectivity. It also exposed limits in the original transaction privacy. Those lessons shaped Quantic. Zenith is retired; its balances and addresses do not migrate.</p></article>
      <article className="journey-current"><span className="card-label">02 · Live, with test coins</span><h4>{TESTNET_NAME}</h4><p>Testnet v2, started on 29 October 2026, runs the post-quantum pool: STARK spend proofs, X-Wing note encryption, ML-DSA node identities and hybrid checkpoints. It replaced testnet v1, which used Halo 2 proofs. We test the full user experience in public.</p></article>
      <article><span className="card-label">03 · Coming soon</span><h4>{MAINNET_NAME}</h4><p>The destination: private payments with the complete post-quantum protocol and external review. It has no announced launch date. Testnet coins never turn into mainnet coins.</p></article>
    </div>
  </section>

  <section aria-labelledby="payment-flow-title">
    <h3 id="payment-flow-title" className="section-heading">From your wallet to theirs.</h3>
    <div className="payment-flow">
      {[
        ["01", "Prepare", "Your wallet resolves and checks the recipient's short address."],
        ["02", "Seal & prove", "X-Wing encrypts the note. A STARK proves the spend without revealing the input note."],
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
    <p>Testnet v2 runs the post-quantum pool: hash-based STARK proofs with authorization and balance checks inside the proof, X-Wing for every note and ML-DSA for nodes and checkpoints. Before mainnet it still needs a phone wallet and an external review.</p>
    <ul className="roadmap-list"><li><span>Now</span>Test the post-quantum pool in public: private payments, wallets, XMRig mining, short addresses and peer synchronization.</li><li><span>Next</span>Benchmark the pool on phones, integrate the Android interface, add an interface for mining pools and complete external review.</li><li><span>Then</span>Launch Zoka Quantic Mainnet only with the complete protocol.</li></ul>
    <div className="flex flex-wrap gap-6"><a className="text-link" href="#docs/papers">Read the whitepaper & litepaper →</a><a className="text-link" href="#docs/zsilent">Try the testnet →</a></div>
  </section>
</div>;

export default TechSection;
