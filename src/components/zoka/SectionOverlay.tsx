import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X, Monitor, Github, Gitlab, FileText, BookOpen, Plus, Minus, Terminal,
  Download, Cpu, Server, Boxes, Lock, Eye, EyeOff, ScanLine, Smartphone, Hash, KeyRound,
} from "lucide-react";
import type { SectionKey } from "./Nav";

// ─────────────────────────────────────────────────────────────────────────────
//  Constants — update these in one place when releases / URLs change.
// ─────────────────────────────────────────────────────────────────────────────
const REPO_BASE = "https://github.com/zoka-network";
const NETWORK_REPO = `${REPO_BASE}/zokanetwork`;
const WALLET_REPO = `${REPO_BASE}/zsilent-core`;
const MOBILE_REPO = `${REPO_BASE}/zkapriv`;
const EXPLORER_REPO = `${REPO_BASE}/zokaexplorer`;
const WEB_REPO = `${REPO_BASE}/zokaweb`;
const MAINNET_NAME = "Zoka Quantic";
// The network running today. It keeps its chain and becomes the testnet where
// every Zoka Quantic component is tried before genesis.
const TESTNET_NAME = "Zoka testnet (Zenith)";
const ZSILENT_VERSION = "v2.0.2";
// Releases with binaries live on GitLab. The GitHub account was recreated in
// October 2026 without its old releases, so downloads point at GitLab: a broken
// download link is the most expensive kind of broken link.
const WALLET_RELEASES = `https://gitlab.com/zokanetwork/zsilent-core/-/releases`;
const WALLET_RELEASE = `${WALLET_RELEASES}/${ZSILENT_VERSION}`;
const MOBILE_BUILD_GUIDE = `${MOBILE_REPO}#readme`;
const EXPLORER_URL = "https://www.zokascan.cc";
const DOCS_URL = "https://zokanetwork.gitbook.io/";
const DISCORD_URL = "https://discord.gg/uZRPcNb3m7";
// Espejo en GitLab, con los binarios publicados.
const GITLAB_BASE = "https://gitlab.com/zokanetwork";
const GITLAB_NETWORK = `${GITLAB_BASE}/zokanetwork`;

// ─────────────────────────────────────────────────────────────────────────────
//  Tech section — 6 consolidated blocks + comparison + roadmap + honest limits
// ─────────────────────────────────────────────────────────────────────────────
interface TechBlock {
  id: string;
  title: string;
  content: React.ReactNode;
}

const techBlocks: TechBlock[] = [
  {
    id: "01",
    title: "Cryptography stack",
    content: (
      <div className="space-y-0">
        {[
          { id: "i", name: "X-Wing note encryption · ML-KEM-768", desc: "Implemented for Quantic. Every payment is encrypted to its recipient with X-Wing, which combines X25519 with ML-KEM-768 (NIST FIPS 203), so a future quantum computer should not find or read payments even knowing the address. Addresses carry the key: about 1,730 characters. External review pending." },
          { id: "ii", name: "Ironwood spend proofs · Halo 2", desc: "Implemented for Quantic. Zcash's corrected Orchard circuit, used without modification: a spend proves note membership, ownership and its nullifier without publishing the note. No rings, no key images and no trusted setup." },
          { id: "iii", name: "Groth16 zk-SNARKs · BLS12-381", desc: "Live on Zenith, the testnet. A proof hides its witness, but transaction fields and metadata remain public. In particular, Zenith publishes its spent notes. Proof validity relies on classical cryptography and a single-operator trusted setup." },
          { id: "iv", name: "Value commitments", desc: "Amounts hide behind commitments that add up homomorphically, so the network checks that inputs equal outputs plus the fee without ever seeing a number. Zenith uses Pedersen commitments with 64-bit Bulletproofs; Quantic checks every value inside the Halo 2 proof." },
          { id: "v", name: "Nullifiers", desc: "A single-use tag prevents double spending. On Quantic it is derived with a key that never appears in the address, and the proof shows it belongs to the spent note without revealing which one." },
          { id: "vi", name: "Recoverable notes", desc: "Quantic notes use the quantum-recoverable format proposed in ZIP 2005, so funds keep a path to move once validity has to change to post-quantum proofs. That migration is not designed yet." },
          { id: "vii", name: "Hybrid signatures · ML-DSA-65", desc: "Implemented. Bootstrap snapshots and the team's chain checkpoints carry Ed25519 and ML-DSA-65 (NIST FIPS 204) signatures; a node accepts one only if both verify. Inactive until the post-quantum keys are created." },
        ].map((l) => (
          <div key={l.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
            <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">{l.id}</div>
            <div className="col-span-10 md:col-span-4 text-base font-light">{l.name}</div>
            <div className="col-span-12 md:col-span-7 text-sm text-muted-foreground font-light">{l.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "02",
    title: "Consensus & mining",
    content: (
      <div className="space-y-0">
        {[
          { id: "i", name: "RandomX-compatible PoW", desc: "ZOKA's PoW backend (`zoka-randomx-v1`) is built around RandomX semantics: random program execution that favors general-purpose CPUs over ASICs and GPUs." },
          { id: "ii", name: "Key-rotating epochs", desc: "Mining keys rotate every 2,048 blocks (~2.8 days at 120 s blocks). Each epoch resets the RandomX cache and keeps the network friendly to fresh participants." },
          { id: "iii", name: "120 s target · 60-block coinbase maturity", desc: "The target is 120 seconds; actual intervals vary. On Quantic, ASERT difficulty follows the network's real speed and the chain with the most accumulated work wins. Proof-of-work finality is probabilistic: confirmations reduce reorganization risk, but no fixed count guarantees irreversibility." },
          { id: "iv", name: "Private coinbase", desc: "Miner rewards are paid to private outputs. The subsidy amount is public so anyone can audit emission; the recipient is not." },
          { id: "v", name: "Team premine at genesis", desc: "Quantic allocates 5,000,000 of the 23,000,000 ZKA cap (21.7%) to the team: a public output of the genesis block that anyone can check against the published address, spendable from the next block without a lock. Zenith had no premine." },
          { id: "vi", name: "Team checkpoints", desc: "The team's node signs checkpoints of the canonical chain, and nodes do not follow a branch that contradicts them. They prevent forks; the key cannot make an invalid block valid, create coins or spend anyone's funds. It is declared trust in the team." },
        ].map((l) => (
          <div key={l.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
            <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">{l.id}</div>
            <div className="col-span-10 md:col-span-4 text-base font-light">{l.name}</div>
            <div className="col-span-12 md:col-span-7 text-sm text-muted-foreground font-light">{l.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "03",
    title: "What is hidden, what is not",
    content: (
      <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <EyeOff className="w-4 h-4 text-foreground/80" />
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">Hidden</span>
          </div>
          <ul className="space-y-2 text-sm font-light text-muted-foreground">
            <li>· Receiver (X-Wing note encryption)</li>
            <li>· Amount (value commitment)</li>
            <li>· Memo (encrypted with the note)</li>
            <li>· Which note each transaction spends</li>
            <li>· Sender (no address or key of theirs is published)</li>
          </ul>
        </div>
        <div className="p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-foreground/80" />
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">Public</span>
          </div>
          <ul className="space-y-2 text-sm font-light text-muted-foreground">
            <li>· Block height & timestamp</li>
            <li>· Transaction hash</li>
            <li>· Existence (a tx happened)</li>
            <li>· Nullifiers (anti-double-spend tags)</li>
            <li>· Note-commitment tree root</li>
            <li>· Fee (fixed per action)</li>
            <li>· Block subsidy and the genesis allocation</li>
            <li>· PoW difficulty & block size</li>
          </ul>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
        This is the Zoka Quantic design, implemented and pending external review. On today's
        network (Zenith, now the testnet) every private transaction also publishes the note it
        spends, so the transaction graph is visible to anyone. Amounts and recipients are
        protected by classical cryptography. Quantic's spend proof removes this link;
        Zenith's history stays as it is.
      </p>
      </div>
    ),
  },
  {
    id: "04",
    title: "Token economics — ZKA",
    content: (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px] mb-6">
          {[
            ["Symbol", "ZKA"],
            ["Decimals", "6"],
            ["Max supply", "23,000,000"],
            ["Team premine", "5,000,000 at genesis"],
            ["Mined supply", "18,000,000"],
            ["Initial reward", "12 ZKA"],
            ["Halving", "1,051,200 blocks (~4 y)"],
            ["Target block time", "120 s"],
            ["Coinbase maturity", "60 blocks"],
            ["Tail emission", "None"],
          ].map(([k, v]) => (
            <div key={k} className="border border-border p-3">
              <div className="text-muted-foreground tracking-[0.2em] uppercase text-[9px]">{k}</div>
              <div className="text-foreground mt-1">{v}</div>
            </div>
          ))}
        </div>
        <div className="space-y-0">
          {[
            { id: "G", name: "Genesis · team premine", desc: "5,000,000 ZKA as a public output anyone can verify, spendable from the next block without a lock · initial allocation 5,000,000 ZKA" },
            { id: "E0", name: "Era 0 · 12 ZKA", desc: "1,051,200 reward-bearing blocks · 12,614,400 mined · total 17,614,400 ZKA" },
            { id: "E1", name: "Era 1 · 6 ZKA", desc: "897,600 further reward-bearing blocks · 5,385,600 mined · total 23,000,000 ZKA. About 7.4 years of emission at the 120-second target." },
          ].map((l) => (
            <div key={l.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
              <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">{l.id}</div>
              <div className="col-span-10 md:col-span-4 text-base font-light">{l.name}</div>
              <div className="col-span-12 md:col-span-7 text-sm text-muted-foreground font-light">{l.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/80 mt-6 font-light">
          These are Zoka Quantic's parameters, implemented in its consensus rules. Its genesis
          must pay the allocation as a public output to the published address, so anyone can
          verify the supply at any height. Zenith's genesis had no allocation. Mining continues with transaction fees after the subsidy ends.
          1 ZKA = 1,000,000 atoms (the chain's smallest accounting unit).
        </p>
      </div>
    ),
  },
  {
    id: "05",
    title: "Fees & transaction ordering",
    content: (
      <div className="space-y-0">
        {[
          { id: "i", name: "Fees", desc: "On Zoka Quantic fees are public and conventional: 0.0001 ZKA per action, with a minimum of two actions, so a fee reveals nothing beyond the size of its transaction. On Zenith they are Pedersen-committed with a range proof, and wallets pick low / normal / high." },
          { id: "ii", name: "Visible mempool metadata", desc: "Hidden amounts and recipients limit direct inspection, but timing, transaction size, fees and other public fields remain visible. Zenith also exposes the spent notes." },
          { id: "iii", name: "Ordering remains a miner decision", desc: "Privacy may limit some information used for front-running. It does not guarantee protection against transaction reordering, censorship or every form of MEV." },
          { id: "iv", name: "No protocol-level taxes", desc: "There is no on-chain whitelist, blacklist, or skim on holding / sending / receiving." },
        ].map((l) => (
          <div key={l.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
            <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">{l.id}</div>
            <div className="col-span-10 md:col-span-4 text-base font-light">{l.name}</div>
            <div className="col-span-12 md:col-span-7 text-sm text-muted-foreground font-light">{l.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "06",
    title: "Network & nodes",
    content: (
      <div className="space-y-0">
        {[
          { id: "i", name: "Peer-to-peer operation", desc: "Nodes validate their own local chain and exchange data with peers. Public seed nodes are planned to help discovery, alongside Tor; hosting and availability are not guaranteed." },
          { id: "ii", name: "Reachable without open ports", desc: "Each node runs a Tor v3 onion service, so it is reachable from behind NAT with nothing forwarded on the router. Tor is the primary transport, not an option bolted on top." },
          { id: "iii", name: "libp2p transport", desc: "Nodes speak the protocol over libp2p. Gossipsub propagates blocks and transactions; identify, ping and Kademlia handle peer health and discovery." },
          { id: "iv", name: "Snapshot sync over iroh", desc: "Nodes can pull chain snapshots from peers over iroh (QUIC with relay-assisted hole punching) and validate the imported blocks. Sync time depends on chain size, peers and the connection. QUIC connectivity is separate from Tor and may reveal an IP address to a peer or relay." },
          { id: "v", name: "Peers serve each other", desc: "A node that falls far behind asks its peers what chain they hold, picks the one with the most accumulated work and pulls it directly from whoever is furthest ahead. No privileged seed has to be online for the network to heal." },
          { id: "vi", name: "Two binaries", desc: "`zoka` is the CLI for wallet ops; `zokahd` is the full-node daemon. Both ship cross-platform; ZSilent Core bundles them and supervises the node from a desktop UI." },
          { id: "vii", name: "Trusted setup", desc: "Zenith's Groth16 parameters came from a single operator; their digests can be checked against the published files. Zoka Quantic needs no trusted setup: Halo 2 has none." },
        ].map((l) => (
          <div key={l.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
            <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">{l.id}</div>
            <div className="col-span-10 md:col-span-4 text-base font-light">{l.name}</div>
            <div className="col-span-12 md:col-span-7 text-sm text-muted-foreground font-light">{l.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "07",
    title: "What you can do with it",
    content: (
      <div className="space-y-0">
        {[
          { id: "i", name: "Private send and receive", desc: "Amounts and recipients stay hidden. Every payment lands on a one-time stealth address, so the same recipient never appears twice under the same on-chain identifier." },
          { id: "ii", name: "Team mining", desc: "Create or join a team and pool CPU hashrate. Members take turns receiving the block reward, weighted by the work each one actually contributed — no operator holds the payouts, and a backup coordinator takes over if the leader disappears." },
          { id: "iii", name: "Solo CPU mining", desc: "RandomX-style proof of work favours ordinary CPUs over ASICs and GPUs. Mining runs inside the same node that keeps you synced, and rewards arrive as private outputs." },
          { id: "iv", name: "Built-in explorer", desc: "Inspect blocks, heights and network state from inside the wallet, served by your own node — no third-party site needs to know what you are looking at." },
          { id: "v", name: "Manual onion peers", desc: "Paste someone's onion address and your node keeps them as a neighbour, retrying while they are online. It matters most for anyone who cannot open ports on their router, which on this network is most people." },
          { id: "vi", name: "Command line", desc: "Everything the desktop app does with the chain is reachable from `zoka`: wallet operations, node control, team mining, chain inspection, and snapshot import / export." },
        ].map((l) => (
          <div key={l.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
            <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">{l.id}</div>
            <div className="col-span-10 md:col-span-4 text-base font-light">{l.name}</div>
            <div className="col-span-12 md:col-span-7 text-sm text-muted-foreground font-light">{l.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "08",
    title: "Comparison with other chains",
    content: (
      <div className="overflow-x-auto">
        <table className="w-full text-left font-light text-sm border border-border">
          <thead className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            <tr className="border-b border-border">
              <th className="p-3">Feature</th>
              <th className="p-3 text-foreground">Zoka Quantic</th>
              <th className="p-3">BTC</th>
              <th className="p-3">ETH</th>
              <th className="p-3">XMR</th>
              <th className="p-3">ZEC</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Privacy by default", "✓", "—", "—", "✓", "opt"],
              ["Sender hidden", "✓", "—", "—", "✓", "✓"],
              ["Receiver hidden", "✓", "—", "—", "✓", "✓"],
              ["Amount hidden", "✓", "—", "—", "✓", "✓"],
              ["Fee hidden", "—", "—", "—", "—", "part."],
              ["Block time", "120 s", "~600 s", "~12 s", "~120 s", "~75 s"],
              ["ASIC-resistant", "✓", "—", "n/a", "✓", "—"],
              ["No premine", "—", "✓", "—", "✓", "—"],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-border last:border-0">
                <td className="p-3 text-foreground/90">{row[0]}</td>
                <td className="p-3 text-foreground">{row[1]}</td>
                <td className="p-3">{row[2]}</td>
                <td className="p-3">{row[3]}</td>
                <td className="p-3">{row[4]}</td>
                <td className="p-3">{row[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground/70 mt-3 font-light italic">
          The Zoka Quantic column describes properties implemented in source, pending a public
          testnet and external review. Zenith exposes links between spent notes and their
          source transactions; this is not the same as publishing a person's identity.
          Confirmations reduce reorganization risk without guaranteeing finality.
        </p>
      </div>
    ),
  },
  {
    id: "09",
    title: "Roadmap",
    content: (
      <div className="space-y-8">
        {[
          {
            phase: "Shipped",
            phaseNote: "Running today",
            items: [
              { id: "i", name: "Mainnet Zenith → Zoka testnet", desc: "Permissionless mining and private transfers since June 2026. It keeps its chain and becomes the testnet where every Zoka Quantic component is tried first; its coins have no value and do not migrate.", status: "Live" },
              { id: "ii", name: "Peer-to-peer network", desc: "Nodes can advertise Tor onion services without forwarded router ports. Snapshot exchange over iroh is a separate transport with different network privacy properties.", status: "Live" },
              { id: "iii", name: "Snapshot sync and peer recovery", desc: "Nodes exchange snapshots over iroh and recover the chain with the most accumulated work from available peers. Sync speed depends on the connection and chain size.", status: "Live" },
              { id: "iv", name: `ZSilent Core ${ZSILENT_VERSION} · ZKAPriv Android`, desc: "Self-custodial desktop and Android clients. The verified public package is Windows v2.0.2; Linux and Android source builds are linked in Downloads.", status: "Testnet clients" },
              { id: "v", name: "October 2026 security update", desc: "Tor and dependency updates, plus removal of the exchange, are prepared in source. Previously published wallet packages may still contain the older features.", status: "Prepared locally" },
            ],
          },
          {
            phase: "Zoka Quantic",
            phaseNote: "Built and tested on the Zoka testnet first",
            items: [
              { id: "vi", name: "Post-quantum building blocks", desc: "ML-KEM-768, X-Wing and ML-DSA-65, measured on a 32-bit Android phone before parameters were fixed.", status: "Implemented" },
              { id: "vii", name: "X-Wing note encryption", desc: "Classical key agreement combined with ML-KEM-768, so recipients and amounts stay protected against future quantum attacks.", status: "Implemented" },
              { id: "viii", name: "Spend without publishing the note", desc: "Ironwood: membership, ownership and nullifier proven inside Zcash's corrected circuit, with no key images and no trusted setup.", status: "Implemented" },
              { id: "ix", name: "Hybrid signatures", desc: "Ed25519 plus ML-DSA-65 on bootstrap snapshots and team checkpoints.", status: "Implemented" },
              { id: "x", name: "Quantic node", desc: "Blocks, mempool, mining, relay and light-wallet data, run on a three-node local network.", status: "Implemented" },
              { id: "xi", name: "Wallets and public testnet", desc: "The phone engine and its peer-to-peer light-wallet transport are built and tested against a real node; next come the Quantic screens in ZKAPriv and ZSilent Core, then a public testnet with a fixed genesis.", status: "In development" },
              { id: "xii", name: "Public seed servers", desc: "Faster first contact for wallets, in addition to Tor and never instead of it.", status: "Planned" },
            ],
          },
          {
            phase: "Before genesis",
            phaseNote: "Nothing launches until these are done",
            items: [
              { id: "xiii", name: "External review", desc: "Independent review of ZOKA's changes: X-Wing note encryption, addresses, transaction format and consensus rules.", status: "Planned" },
              { id: "xiv", name: "Networking and emission", desc: "Networking stack upgraded to libp2p 0.57 (cargo audit found no known vulnerabilities in the node's dependencies in October 2026); the ASERT difficulty and initial target get reviewed on the public testnet.", status: "In development" },
              { id: "xv", name: "MPC trusted setup ceremony", desc: "No longer needed: Halo 2 has no trusted setup.", status: "Dropped" },
              { id: "xvi", name: "Zoka Quantic genesis", desc: "New chain, every post-quantum component active from block 0.", status: "Planned" },
            ],
          },
          {
            phase: "After that",
            phaseNote: "No dates promised",
            items: [
              { id: "xvii", name: "Post-quantum validity", desc: "Move validity off discrete-log assumptions before quantum computers can break them. Recoverable notes and versioned formats let this be a fork, not another new chain.", status: "Research" },
              { id: "xviii", name: "macOS and iOS clients", desc: "Signed macOS builds and an iOS wallet.", status: "Planned" },
              { id: "xix", name: "I2P transport", desc: "A second anonymous transport next to Tor.", status: "Planned" },
            ],
          },
        ].map((group) => (
          <div key={group.phase}>
            <div className="flex items-baseline justify-between border-b border-border pb-2 mb-2">
              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-foreground">
                {group.phase}
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                {group.phaseNote}
              </div>
            </div>
            <div className="space-y-0">
              {group.items.map((l) => (
                <div key={l.id} className="grid grid-cols-12 gap-4 py-4 border-b border-border last:border-0">
                  <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">{l.id}</div>
                  <div className="col-span-10 md:col-span-4 text-base font-light">{l.name}</div>
                  <div className="col-span-12 md:col-span-5 text-sm text-muted-foreground font-light">{l.desc}</div>
                  <div className="col-span-12 md:col-span-2 font-mono text-[10px] tracking-[0.25em] uppercase text-foreground/80 md:text-right">
                    {l.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground/80 italic">
          Order is intent, not a date. A privacy chain ships when it is safe to ship — not
          before. Any consensus change on a live network announces its activation block in advance.
        </p>
      </div>
    ),
  },
  {
    id: "10",
    title: "Honest limits",
    content: (
      <ul className="space-y-3 text-sm font-light text-muted-foreground">
        {[
          "On today's network (Zenith, now the testnet) private transactions publish the notes they spend, exposing transaction links. Amounts and recipients use classical cryptography and do not have post-quantum protection. Quantic's proposed spend proof must address this before launch; it cannot repair Zenith's history.",
          "Zoka Quantic's validity is classical. Once a large quantum computer exists it could forge proofs, create coins or spend others' outputs. The answer is an upgrade to hash-based proofs before then — a plan, not a shipped feature.",
          "The post-quantum libraries are young and, to our knowledge, not independently audited. An external review is planned before genesis.",
          "The proposed ML-KEM-768 format adds about one kilobyte per output and substantially longer addresses. Exact encodings, QR handling and 32-bit mobile performance are still being evaluated.",
          "The Quantic plan includes a 5,000,000 ZKA team premine within the 23,000,000 cap (21.7%), spendable from block 0 without a lock.",
          "Tor reduces direct IP exposure but cannot eliminate traffic correlation. Direct QUIC connections and relays used by iroh have a different privacy boundary; Tor protection does not automatically cover them.",
          "A compromised spending key has no recovery backdoor. Custody is yours, with everything that implies.",
          "Reusing zka1 receive addresses across distinct off-chain identities can leak associations between them.",
          "The target block time is 120 seconds. Actual times vary and confirmations never guarantee irreversibility on a proof-of-work chain.",
        ].map((x) => (
          <li key={x} className="flex gap-3 border-b border-border pb-3 last:border-0">
            <span className="font-mono text-xs text-muted-foreground/70 mt-1">!</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

const TechAccordion = () => {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-12">
      <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
        Zoka Quantic is the next ZOKA mainnet, in development with post-quantum privacy
        as its goal. The running network is Zenith, now the testnet. Quantic's proposed
        protections need implementation, testnet validation and external review before genesis.
      </p>
      <div className="border-t border-border">
        {techBlocks.map((ch) => {
          const isOpen = open === ch.id;
          return (
            <div
              key={ch.id}
              className="border-b border-border scroll-mt-24"
              ref={(el) => {
                if (el && isOpen) {
                  requestAnimationFrame(() => {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                }
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : ch.id)}
                className="w-full grid grid-cols-12 gap-4 py-6 text-left group items-center"
                aria-expanded={isOpen}
              >
                <div className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">
                  {ch.id}
                </div>
                <div className="col-span-9 md:col-span-10 text-lg md:text-xl font-extralight tracking-[-0.01em] text-foreground group-hover:text-foreground transition-colors">
                  {ch.title}
                </div>
                <div className="col-span-1 flex justify-end text-muted-foreground group-hover:text-foreground transition-colors">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              {isOpen && (
                <div className="pb-8 pl-0 md:pl-[8.333%] animate-fade-in">
                  {ch.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  Download section — 3 real desktop builds + CLI tutorial
// ─────────────────────────────────────────────────────────────────────────────
const cliSteps: { id: string; icon: React.ComponentType<{ className?: string }>; title: string; body: React.ReactNode }[] = [
  {
    id: "01",
    icon: Download,
    title: "Get the code",
    body: (
      <div className="space-y-4">
        <p>
          The whole node lives on GitHub. Clone it and you have everything: the daemon,
          the wallet CLI, the Groth16 trusted setup files and the Zenith network manifest.
        </p>
        <a
          href={NETWORK_REPO}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground"
        >
          <Github className="w-4 h-4" />
          zoka-network/zokanetwork
          <span className="opacity-60">↗</span>
        </a>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div className="text-muted-foreground"># GitHub</div>
          <div>git clone https://github.com/zoka-network/zokanetwork.git</div>
          <div className="text-muted-foreground mt-2"># GitLab mirror</div>
          <div>git clone https://gitlab.com/zokanetwork/zokanetwork.git</div>
          <div className="text-muted-foreground mt-2"># After cloning from either source:</div>
          <div>cd zokanetwork</div>
        </div>
      </div>
    ),
  },
  {
    id: "02",
    icon: Cpu,
    title: "Install Rust",
    body: (
      <div className="space-y-4">
        <p>
          ZOKA is written in Rust. Install the toolchain once — it's official and free.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div className="text-muted-foreground"># macOS / Linux:</div>
          <div>curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh</div>
          <div className="text-muted-foreground mt-3"># Windows: download installer from rustup.rs</div>
          <div className="text-muted-foreground mt-3"># Verify:</div>
          <div>rustc --version</div>
        </div>
      </div>
    ),
  },
  {
    id: "03",
    icon: Server,
    title: "Build & run the node",
    body: (
      <div className="space-y-4">
        <p>
          Build with the <code className="font-mono text-foreground">randomx</code> feature
          for Zenith. Build time depends on your machine. Follow the repository's build
          prerequisites for the native RandomX and database dependencies.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div>cargo build --release --features randomx --bin zoka --bin zokahd</div>
          <div className="text-muted-foreground mt-3"># Join Zenith (legacy CLI name: mainnet), over Tor:</div>
          <div>./target/release/zoka fullnode --network mainnet \</div>
          <div>&nbsp;&nbsp;--network-config docs/mainnet-network.v1.json \</div>
          <div>&nbsp;&nbsp;--tor-proxy 127.0.0.1:9050 --tor-only \</div>
          <div>&nbsp;&nbsp;--external-addr /onion3/&lt;your-onion&gt;:28080 \</div>
          <div>&nbsp;&nbsp;--serve-iroh-snapshot --no-mine \</div>
          <div>&nbsp;&nbsp;--password "&lt;node-pass&gt;"</div>
        </div>
        <p className="text-xs text-muted-foreground/80">
          The network is serverless, so a node needs a way to be reached:{" "}
          <code className="font-mono text-foreground/90">--tor-proxy</code> is how it dials
          out and <code className="font-mono text-foreground/90">--external-addr</code> is the
          onion address it advertises. Note that{" "}
          <code className="font-mono text-foreground/90">--tor-only</code> refuses to start
          without a proxy. Full setup, including the Tor hidden service on Linux and
          Windows, is in{" "}
          <code className="font-mono text-foreground/90">docs/cli-node-over-tor.md</code>.
        </p>
      </div>
    ),
  },
  {
    id: "04",
    icon: Terminal,
    title: "Create a private wallet",
    body: (
      <div className="space-y-4">
        <p>
          Generate a shielded wallet. <span className="text-foreground">Save the seed phrase
          offline.</span> It is your recovery method; nobody can reset it for you.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div>./target/release/zoka create my-wallet --network mainnet --password "&lt;wallet-pass&gt;"</div>
          <div className="text-muted-foreground mt-3"># Show your shielded address (starts with zka1...):</div>
          <div>./target/release/zoka wallets --network mainnet</div>
        </div>
      </div>
    ),
  },
  {
    id: "05",
    icon: Cpu,
    title: "Mine (optional)",
    body: (
      <div className="space-y-4">
        <p>
          Stop the non-mining node from step 3 first. Start it with the same Tor settings,
          replacing <code className="font-mono text-foreground">--no-mine</code> with your
          wallet address and a thread limit. These rewards are testnet coins.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div>./target/release/zoka fullnode --network mainnet \</div>
          <div>&nbsp;&nbsp;--network-config docs/mainnet-network.v1.json \</div>
          <div>&nbsp;&nbsp;--tor-proxy 127.0.0.1:9050 --tor-only \</div>
          <div>&nbsp;&nbsp;--external-addr /onion3/&lt;your-onion&gt;:28080 \</div>
          <div>&nbsp;&nbsp;--serve-iroh-snapshot --min-mine-peers 1 \</div>
          <div>&nbsp;&nbsp;--address zka1yourshieldedaddress... \</div>
          <div>&nbsp;&nbsp;--threads 4 --password "&lt;wallet-pass&gt;"</div>
        </div>
        <p className="text-sm">
          Lower <span className="font-mono text-foreground">--threads</span> if the machine
          runs hot. Stop with <span className="font-mono text-foreground">Ctrl + C</span>.
        </p>
      </div>
    ),
  },
  {
    id: "06",
    icon: Terminal,
    title: "Stuck? Read the README",
    body: (
      <div className="space-y-4">
        <p>
          Every command and edge case lives in the repo's README and{" "}
          <span className="font-mono text-foreground">docs/</span> folder.
          Match errors against troubleshooting first.
        </p>
        <a
          href={`${NETWORK_REPO}#readme`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground"
        >
          Open the README
          <span className="opacity-60">↗</span>
        </a>
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Overlay frame
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  active: SectionKey | null;
  onClose: () => void;
}

const content: Record<SectionKey, { eyebrow: string; title: React.ReactNode; body: React.ReactNode }> = {
  about: {
    eyebrow: "I. ABOUT · A MANIFESTO",
    title: (
      <>
        Privacy is not a feature.<br />
        <span className="text-muted-foreground">It is the precondition of freedom.</span>
      </>
    ),
    body: (
      <div className="space-y-12">
        {/* Author signature */}
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center font-mono text-[11px] tracking-[0.15em] text-foreground">
            NZ
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">
              Written by Natosh Zoka
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              core dev @ ZokaNetwork
            </span>
          </div>
        </div>

        {/* Opening */}
        <div className="space-y-6">
          <p className="text-lg md:text-xl font-extralight leading-relaxed text-foreground">
            I did not build ZOKA to launch a token. I built it because I believe the right to
            transact in private is the last frontier of individual freedom — and that frontier
            is being eroded, block by block, ledger by ledger, in front of our eyes.
          </p>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            What follows is not a pitch. It is a position. If you disagree with it, ZOKA is
            probably not for you. If you read it and feel something settle into place, then
            welcome — you are already part of this.
          </p>
        </div>

        {/* Manifesto chapters */}
        <div className="space-y-0 border-t border-border">
          {[
            {
              id: "01",
              title: "Privacy is the default state of being human",
              body: (
                <>
                  Before currency, before contracts, before institutions — humans whispered.
                  We chose, in private, who to trust with our intentions. Privacy is not a
                  modern legal construct invented by lawyers; it is the default operating
                  mode of every honest social interaction. Anything that turns it into an
                  exception is the anomaly, not the other way around.
                </>
              ),
            },
            {
              id: "02",
              title: "A transparent ledger is a surveillance ledger",
              body: (
                <>
                  Bitcoin was a beautiful idea — but a fully transparent chain is, in
                  practice, a permanent surveillance database that anyone, including states
                  and corporations, can mine forever. Every coffee, every salary, every
                  donation — visible, correlatable, immutable. <span className="text-foreground">"Pseudonymous"</span> is
                  not privacy. It is a thin curtain in a room full of cameras.
                </>
              ),
            },
            {
              id: "03",
              title: "Standing on the shoulders of cypherpunks",
              body: (
                <>
                  ZOKA does not pretend to invent privacy. It inherits it. From{" "}
                  <span className="text-foreground">David Chaum</span> and his blind
                  signatures in 1982, to the <span className="text-foreground">Cypherpunks</span> of
                  the 90s who declared that <span className="italic">"privacy is necessary for an open society
                  in the electronic age"</span>. From <span className="text-foreground">Zcash</span> proving
                  that zk-SNARKs could shield value at scale, to{" "}
                  <span className="text-foreground">Monero</span> defending the principle that
                  privacy must be the default, never an option. From{" "}
                  <span className="text-foreground">Tor</span> and <span className="text-foreground">I2P</span> teaching
                  us how to hide the wire itself. Every line of ZOKA is a thank-you note to
                  those who came before, and refused to compromise.
                </>
              ),
            },
            {
              id: "04",
              title: "Optional privacy is no privacy",
              body: (
                <>
                  Any chain that lets you "turn on" private mode for some transactions has
                  already lost. The moment privacy is optional, using it becomes a signal —
                  a flag for any analyst to follow. ZOKA's wallet payments use private outputs
                  by default. Block subsidies and Quantic's planned genesis allocation remain
                  public for supply checks. Zenith's spent-note links are public too;
                  rebuilding that part of the privacy model is a condition of Quantic's launch.
                </>
              ),
            },
            {
              id: "05",
              title: "I do not ask you to trust me",
              body: (
                <>
                  I am one developer. I will make mistakes. The whole point of building on
                  zero-knowledge cryptography, reviewed constructions and open code is so that
                  you do not have to take my word for anything. Verify the proofs. Audit the
                  circuits. Run a node. If ZOKA only works because you trust Natosh Zoka,
                  then ZOKA has already failed. Zenith used a single-operator trusted setup;
                  Quantic needs none, but it still requires independent review.
                </>
              ),
            },
            {
              id: "06",
              title: "Honest about what we cannot do",
              body: (
                <>
                  ZOKA will not protect you from a global passive adversary that watches
                  every wire on Earth. It will not save you if you reuse addresses across
                  your real identity. Its privacy is being rebuilt to survive a quantum
                  computer; its validity proofs are not post-quantum yet. I will not promise
                  perfection, because perfect privacy is a marketing word, not a
                  cryptographic one. What I promise is the strongest privacy I know how to
                  ship, with the limits written down in plain text — not buried in a
                  footnote.
                </>
              ),
            },
            {
              id: "07",
              title: "No backdoor. The allocation, in the open.",
              body: (
                <>
                  Quantic's plan includes a 5,000,000 ZKA team premine — 21.7% of the
                  23,000,000 cap, spendable from block 0 without a lock. The amount and address
                  must be published in the final genesis. Zenith had none; I would rather state this one plainly
                  than let anyone discover it. What does not change: there is no{" "}
                  <span className="italic">"compliance"</span> view key the protocol can hand
                  over. Only the user who owns the key can reveal what they received or how
                  much. Not me. Not a foundation. Not a regulator.
                </>
              ),
            },
            {
              id: "08",
              title: "Why I am writing this",
              body: (
                <>
                  Most of what I do happens in silence — circuits, consensus, refactors that
                  nobody will ever read. But once, I owe it to whoever is reading this to
                  state the thing out loud: <span className="text-foreground">privacy is not a crime, it is a civic
                  infrastructure.</span> ZOKA is my contribution to that infrastructure.
                  Today, use the testnet to test wallets, run a node and inspect the code.
                  Quantic's payment network remains in development; testnet coins do not
                  become Quantic coins.
                  <br />
                  <br />
                  That is enough for me.
                </>
              ),
            },
          ].map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-12 gap-4 md:gap-6 py-8 border-b border-border last:border-0"
            >
              <div className="col-span-12 md:col-span-1 font-mono text-xs text-muted-foreground">
                {c.id}
              </div>
              <div className="col-span-12 md:col-span-11 space-y-3">
                <h3 className="text-xl md:text-2xl font-extralight tracking-[-0.01em] text-foreground">
                  {c.title}
                </h3>
                <p className="text-base text-muted-foreground font-light leading-relaxed">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Whitepaper / Litepaper CTA — moved here from its own section */}
        <div className="pt-4">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
            Further reading
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                id: "wp", tag: "Technical",
                name: "Whitepaper",
                desc: "Zoka Quantic design: post-quantum privacy, threat model, token economics, honest limits.",
                version: "v2.0 draft",
                href: "/ZOKA_Quantic_Whitepaper_v2.0.pdf",
                cta: "Read whitepaper",
                Icon: FileText,
              },
              {
                id: "lp", tag: "For everyone",
                name: "Litepaper",
                desc: "Zoka Quantic in plain language: what changes, why a new chain, how to use it. No math.",
                version: "v2.0",
                href: "/ZOKA_Quantic_Litepaper_v2.0.pdf",
                cta: "Read litepaper",
                Icon: BookOpen,
              },
            ].map((d) => {
              const Icon = d.Icon;
              return (
                <a
                  key={d.id}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col justify-between p-6 border border-border hover:border-foreground transition-colors min-h-[200px]"
                >
                  <div className="flex items-start justify-between">
                    <Icon className="w-5 h-5 text-foreground/80" />
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                      {d.tag}
                    </span>
                  </div>
                  <div className="mt-6">
                    <div className="text-2xl font-extralight text-foreground">{d.name}</div>
                    <div className="text-sm text-muted-foreground font-light mt-2 leading-relaxed">
                      {d.desc}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-foreground inline-flex items-center gap-2">
                      {d.cta}
                      <span className="opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
                      {d.version}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Closing signature */}
        <div className="pt-6 flex flex-col gap-2">
          <p className="text-base md:text-lg font-light text-foreground italic">
            "Verify what is true. Reveal nothing else."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-foreground">
              — Natosh Zoka
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              core dev @ ZokaNetwork
            </span>
          </div>
        </div>
      </div>
    ),
  },
  tech: {
    eyebrow: "II. TECH · WHAT RUNS, WHAT IS BEING BUILT",
    title: (
      <>
        A blockchain built in Rust,<br />
        <span className="text-muted-foreground">working toward post-quantum privacy.</span>
      </>
    ),
    body: (
      <div className="space-y-12">
        <TechAccordion />
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
            Read the full specification
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                id: "wp", tag: "Technical",
                name: "Whitepaper",
                desc: "Zoka Quantic design draft: Ironwood transactions with X-Wing note encryption, what a quantum computer could and could not do, token economics.",
                version: "v2.0 draft",
                href: "/ZOKA_Quantic_Whitepaper_v2.0.pdf",
                cta: "Read whitepaper",
                Icon: FileText,
              },
              {
                id: "lp", tag: "For everyone",
                name: "Litepaper",
                desc: "Plain-language companion. What Zoka Quantic does, what it does not, and what happens to Zenith. No math required.",
                version: "v2.0",
                href: "/ZOKA_Quantic_Litepaper_v2.0.pdf",
                cta: "Read litepaper",
                Icon: BookOpen,
              },
            ].map((d) => {
              const Icon = d.Icon;
              return (
                <a
                  key={d.id}
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col justify-between p-6 border border-border hover:border-foreground transition-colors min-h-[200px]"
                >
                  <div className="flex items-start justify-between">
                    <Icon className="w-5 h-5 text-foreground/80" />
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                      {d.tag}
                    </span>
                  </div>
                  <div className="mt-6">
                    <div className="text-2xl font-extralight text-foreground">{d.name}</div>
                    <div className="text-sm text-muted-foreground font-light mt-2 leading-relaxed">
                      {d.desc}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-foreground inline-flex items-center gap-2">
                      {d.cta}
                      <span className="opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
                      {d.version}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    ),
  },
  download: {
    eyebrow: "III. DOWNLOAD · TESTNET CLIENTS",
    title: (
      <>
        Your keys,<br />
        <span className="text-gradient">your silence.</span>
      </>
    ),
    body: (
      <div className="space-y-14">
        {/* Status banner */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 p-5 border border-border bg-foreground/[0.02]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(160_84%_55%)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(160_84%_55%)]" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-foreground">
              {TESTNET_NAME} · Testnet clients
            </span>
          </div>
          <span className="hidden md:block h-4 w-px bg-border" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            Permissionless mining · Open peers · No KYC
          </span>
        </div>

        {/* Intro */}
        <div className="space-y-4">
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            <span className="text-foreground">ZSilent Core</span> is the desktop wallet for ZOKA.
            <span className="text-foreground"> ZKAPriv</span> is the Android wallet. Both are
            self-custodial clients for Zenith, now the Zoka testnet. Quantic has not launched
            and has no wallet release yet. Zenith balances are test coins: there is no claim,
            swap or balance migration to Quantic.
          </p>
          <p className="text-sm text-muted-foreground font-light">
            The verified public release is ZSilent Core {ZSILENT_VERSION} for Windows
            (MSI and portable EXE), with SHA-256 checksums on GitLab. Linux and Android
            link to source and build instructions; installer releases were not available
            in the checked GitLab projects on October 11, 2026.
          </p>
        </div>

        {/* OS download cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { id: "win", name: "ZSilent Core for Windows", desc: "Zenith testnet · Windows MSI / portable EXE", badge: `${ZSILENT_VERSION} · Windows`, href: WALLET_RELEASE, cta: "View release & checksums", Icon: Monitor },
            { id: "linux", name: "ZSilent Core for Linux", desc: "Source build · Debian / Ubuntu packaging instructions", badge: "Build from source", href: `${WALLET_REPO}#readme`, cta: "Open build instructions", Icon: Boxes },
            { id: "android", name: "ZKAPriv for Android", desc: "Source build · armeabi-v7a + arm64-v8a", badge: "Build from source", href: MOBILE_BUILD_GUIDE, cta: "Open Android source", Icon: Smartphone },
          ].map((w) => {
            const Icon = w.Icon;
            return (
              <a
                key={w.id}
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between p-5 border border-border hover:border-foreground transition-colors min-h-[180px]"
              >
                <div className="flex items-start justify-between">
                  <Icon className="w-5 h-5 text-foreground/80" />
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                    {w.badge}
                  </span>
                </div>
                <div className="mt-6">
                  <div className="text-xl font-extralight text-foreground">{w.name}</div>
                  <div className="text-xs text-muted-foreground font-light mt-1">{w.desc}</div>
                </div>
                <div className="mt-4 font-mono text-[10px] tracking-[0.25em] uppercase text-foreground inline-flex items-center gap-2">
                  {w.cta}
                  <span className="opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Honest status for unshipped platforms */}
        <div className="space-y-3">
          <div className="p-5 border border-border border-dashed">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">macOS</div>
                <div className="text-sm text-muted-foreground font-light mt-1">
                  jpackage builds run on Apple silicon but need code signing for distribution.
                  Coming in a later release.
                </div>
              </div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/80">
                Planned
              </span>
            </div>
          </div>
          <div className="p-5 border border-border border-dashed">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">iOS</div>
                <div className="text-sm text-muted-foreground font-light mt-1">
                  Android is live through ZKAPriv. iOS is not shipped yet.
                </div>
              </div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground/80">
                Planned
              </span>
            </div>
          </div>
        </div>

        {/* Verify your install */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
            Verify what you downloaded
          </div>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">
            Open the Windows {ZSILENT_VERSION} release on GitLab and compare your file's
            SHA-256 with its SHA256SUMS.txt before installing. The published packages predate
            the Quantic work and may still display “mainnet” for Zenith and older features.
            They do not implement Quantic's proposed post-quantum privacy.
          </p>
          <a
            href={WALLET_RELEASE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground"
          >
            <Gitlab className="w-4 h-4" />
            Open desktop release
            <span className="opacity-60">↗</span>
          </a>
          <a
            href={MOBILE_BUILD_GUIDE}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-0 mt-3 md:ml-3 md:mt-0 inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground"
          >
            <Gitlab className="w-4 h-4" />
            Android build instructions
            <span className="opacity-60">↗</span>
          </a>
        </div>

        {/* Advanced path: CLI tutorial */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Advanced
          </div>
          <h3 className="text-2xl md:text-3xl font-extralight tracking-[-0.01em] text-foreground mb-3">
            Run the node from the terminal.
          </h3>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
            Prefer a headless machine or building from source? Skip the desktop wallet and
            run the Rust node directly over Tor. Same network, same privacy, same binaries
            that ZSilent uses internally. These commands join Zenith, the testnet. Existing
            binaries still select it with <code className="font-mono text-foreground">--network mainnet</code>{" "}
            and <code className="font-mono text-foreground">mainnet-network.v1.json</code>.
            Keep those legacy names: <code className="font-mono text-foreground">--network testnet</code>{" "}
            selects a different old chain, and neither option starts Quantic. Examples use
            a Linux/macOS shell; the Tor guide includes Windows commands.
          </p>

          <div className="space-y-0 border-t border-border">
            {cliSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="grid grid-cols-12 gap-4 md:gap-6 py-8 border-b border-border last:border-0"
                >
                  <div className="col-span-12 md:col-span-1 font-mono text-xs text-muted-foreground">
                    {s.id}
                  </div>
                  <div className="col-span-12 md:col-span-11 space-y-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-foreground/70" />
                      <h3 className="text-xl md:text-2xl font-extralight tracking-[-0.01em] text-foreground">
                        {s.title}
                      </h3>
                    </div>
                    <div className="text-base text-muted-foreground font-light leading-relaxed space-y-3">
                      {s.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
  },
  explorer: {
    eyebrow: "IV. EXPLORER · SEE THE CHAIN",
    title: (
      <>
        Watch blocks land.<br />
        <span className="text-muted-foreground">Explore the testnet.</span>
      </>
    ),
    body: (
      <div className="space-y-12">
        <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
          <span className="text-foreground">zokaexplorer</span> is the public block explorer for ZOKA.
          It currently follows Zenith, the testnet. Look up blocks and transactions and
          check the timestamp of the latest data. Recipients and payment amounts are hidden
          by classical cryptography, but Zenith publishes the notes each transaction spends:
          hiding a field in the explorer does not remove it from the chain.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-foreground/80 hover:bg-foreground hover:text-background transition-colors font-mono text-[11px] tracking-[0.3em] uppercase text-foreground"
          >
            <ScanLine className="w-4 h-4" />
            Open explorer
            <span className="opacity-70 group-hover:translate-x-1 transition-transform">↗</span>
          </a>
          <a
            href={EXPLORER_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.3em] uppercase text-foreground"
          >
            <Github className="w-4 h-4" />
            Source on GitHub
            <span className="opacity-60">↗</span>
          </a>
        </div>

        {/* Search modes */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
            Search modes
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                Icon: Boxes,
                title: "Blocks",
                desc: "Open a block by height or block hash. The explorer shows height, timestamp, hash, difficulty, transaction counts and private transaction hashes when they are anchored.",
              },
              {
                Icon: Hash,
                title: "Transactions",
                desc: "Look up transaction hashes and their confirmation or proof metadata. Zenith's chain still exposes spent-note links, even if the explorer does not display a graph.",
              },
              {
                Icon: Lock,
                title: "Private-safe records",
                desc: "Use prefixed lookups such as commitment:, nullifier:, root:, private-tx: or tx:. The record view reports existence/block context when available, not owners or balances.",
              },
              {
                Icon: EyeOff,
                title: "Wallet addresses",
                desc: "Search a public zka1... receive address to open the privacy-safe address view. The explorer does not reveal address history, balances, senders or receivers.",
              },
              {
                Icon: KeyRound,
                title: "Scan key rewards",
                desc: "A 64-hex scan key can open the mining-reward scanner. That scan runs in the browser, derives the private address locally and compares public coinbase commitments; the key is not sent to the server.",
              },
              {
                Icon: ScanLine,
                title: "Live network state",
                desc: "The home view tracks chain height, recent blocks, recent private activity by hash and public status metrics without turning the explorer into a surveillance surface.",
              },
            ].map((b) => {
              const Icon = b.Icon;
              return (
                <div key={b.title} className="p-5 border border-border">
                  <Icon className="w-5 h-5 text-foreground/80 mb-3" />
                  <div className="text-base text-foreground font-light">{b.title}</div>
                  <div className="text-sm text-muted-foreground font-light mt-2 leading-relaxed">
                    {b.desc}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground/70 mt-4 font-light">
            Full private payment history and spendable balance remain wallet-side. Use ZSilent Core
            or ZKAPriv for full wallet recovery and transaction history.
          </p>
        </div>

        {/* What you'll see */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: Boxes, title: "Blocks", desc: "Height, timestamp, miner address commitment, tx count, difficulty, hash." },
            { Icon: Lock, title: "Transactions", desc: "Tx hash, ring size, nullifier count, proof status — never receiver or amount." },
            { Icon: Eye, title: "Live metrics", desc: "Hashrate, peer count, block-time average, chain height. Read-only — no wallet operations." },
          ].map((b) => {
            const Icon = b.Icon;
            return (
              <div key={b.title} className="p-5 border border-border">
                <Icon className="w-5 h-5 text-foreground/80 mb-3" />
                <div className="text-base text-foreground font-light">{b.title}</div>
                <div className="text-sm text-muted-foreground font-light mt-2 leading-relaxed">
                  {b.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy by absence */}
        <div className="p-6 border border-border bg-foreground/[0.02]">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
            What the explorer cannot show you
          </div>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            The explorer reads the same chain everyone reads. It does not have a privileged
            view key, a back-channel to the RPC, or any out-of-band data. If the explorer
            reads ciphertexts and commitments, rather than cleartext recipient addresses
            or private payment amounts. Zenith nevertheless exposes spent-note links, and
            its recipient encryption is not post-quantum. Quantic is a proposed new design.
          </p>
        </div>
      </div>
    ),
  },
  docs: {
    eyebrow: "V. DOCS · LEARN THE NETWORK",
    title: (
      <>
        Read how it works,<br />
        <span className="text-muted-foreground">straight from the source.</span>
      </>
    ),
    body: (
      <div className="space-y-12">
        <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
          The ZOKA documentation covers the project vision, the{" "}
          <span className="text-foreground">{TESTNET_NAME}</span> that runs today, the privacy
          model, tokenomics, mining, both wallets, the explorer, and the developer
          surfaces. For the proposed Quantic design and the transition from Zenith, start
          with the <a className="text-foreground underline underline-offset-4 hover:text-[#f2abd0]" href="/ZOKA_Quantic_Whitepaper_v2.0.pdf" target="_blank" rel="noopener noreferrer">v2.0 whitepaper</a> and <a className="text-foreground underline underline-offset-4 hover:text-[#f2abd0]" href="/ZOKA_Quantic_Litepaper_v2.0.pdf" target="_blank" rel="noopener noreferrer">litepaper</a>. Older guides may
          still call Zenith “mainnet”; they do not describe a launched Quantic network.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-foreground/80 hover:bg-foreground hover:text-background transition-colors font-mono text-[11px] tracking-[0.3em] uppercase text-foreground"
          >
            <BookOpen className="w-4 h-4" />
            Open documentation
            <span className="opacity-70 group-hover:translate-x-1 transition-transform">↗</span>
          </a>
          <a
            href={NETWORK_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.3em] uppercase text-foreground"
          >
            <Github className="w-4 h-4" />
            Doc sources on GitHub
            <span className="opacity-60">↗</span>
          </a>
        </div>

        {/* What's inside */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
            What's inside
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                Icon: Server,
                title: "Network & consensus",
                desc: `Network overview, RandomX proof-of-work (zoka-randomx-v1), supply and emission (23,000,000 ZKA max, 12 ZKA initial reward, halving every 1,051,200 blocks). ${MAINNET_NAME} adds a 5,000,000 ZKA team allocation at genesis.`,
              },
              {
                Icon: Lock,
                title: "Privacy model",
                desc: "Why privacy matters, what's hidden vs. public on-chain, zero-knowledge proofs, and the threat model behind self-custodial private payments.",
              },
              {
                Icon: Smartphone,
                title: "Wallets",
                desc: "ZKAPriv (Android) and ZSilent Core (desktop): installation, security model, backup and recovery, node and miner control.",
              },
              {
                Icon: Terminal,
                title: "Developers",
                desc: "Repository map, architecture overview, build-from-source instructions and the local node API surface.",
              },
            ].map((b) => {
              const Icon = b.Icon;
              return (
                <div key={b.title} className="p-5 border border-border">
                  <Icon className="w-5 h-5 text-foreground/80 mb-3" />
                  <div className="text-base text-foreground font-light">{b.title}</div>
                  <div className="text-sm text-muted-foreground font-light mt-2 leading-relaxed">
                    {b.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground/70">
          zokanetwork.gitbook.io
        </p>
      </div>
    ),
  },
  github: {
    eyebrow: "VI. GITHUB · OPEN SOURCE",
    title: (
      <>
        Open source,<br />
        <span className="text-muted-foreground">verifiable by anyone.</span>
      </>
    ),
    body: (
      <div className="space-y-12">
        <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
          These repositories contain the node, wallets, explorer and website. Read the code
          and build locally. Published release packages may lag the development branches;
          match a binary to its tagged release and published checksums.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              name: "zoka-network/zokanetwork",
              tag: "Network · Rust",
              desc: "Node, daemon, CLI, cryptography, consensus and P2P. Includes trusted setup files and the legacy Zenith manifest.",
              href: NETWORK_REPO,
              mirror: `${GITLAB_BASE}/zokanetwork`,
            },
            {
              name: "zoka-network/zsilent-core",
              tag: "Wallet · Kotlin Compose Desktop",
              desc: "Desktop wallet source. Bundles zoka + zokahd for onboarding, mining, send and receive. Published Windows downloads are linked in the Download section.",
              href: WALLET_REPO,
              mirror: `${GITLAB_BASE}/zsilent-core`,
            },
            {
              name: "zoka-network/zkapriv",
              tag: "Wallet · Android",
              desc: "Self-custodial Android wallet source for send / receive, seed restore, balance recovery and recent activity. Build instructions are in the repository.",
              href: MOBILE_REPO,
              mirror: `${GITLAB_BASE}/zkapriv`,
            },
            {
              name: "zoka-network/zokaexplorer",
              tag: "Explorer · Vite + React",
              desc: "Public block explorer. Read-only RPC client; never sees secret keys; surfaces only what the chain itself publishes.",
              href: EXPLORER_REPO,
              mirror: `${GITLAB_BASE}/zokaexplorer`,
            },
            {
              name: "zoka-network/zokaweb",
              tag: "Site · Vite + React",
              desc: "This landing page. Static, no analytics, no third-party trackers. Hosts the whitepaper and litepaper PDFs.",
              href: WEB_REPO,
              mirror: `${GITLAB_BASE}/zokaweb`,
            },
          ].map((r) => (
            <a
              key={r.name}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col justify-between p-6 border border-border hover:border-foreground transition-colors min-h-[180px]"
            >
              <div className="flex items-start justify-between">
                <Github className="w-5 h-5 text-foreground/80" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                  {r.tag}
                </span>
              </div>
              <div className="mt-6">
                <div className="font-mono text-sm text-foreground tracking-[0.05em]">{r.name}</div>
                <div className="text-sm text-muted-foreground font-light mt-2 leading-relaxed">
                  {r.desc}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-foreground inline-flex items-center gap-2">
                  Open repo
                  <span className="opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
                </span>
                <span
                  role="link"
                  tabIndex={0}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(r.mirror, "_blank", "noopener,noreferrer"); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); window.open(r.mirror, "_blank", "noopener,noreferrer"); } }}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  GitLab mirror
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground/70">
          <a href={REPO_BASE} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            github.com/zoka-network
          </a>
          <a href={GITLAB_BASE} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            gitlab.com/zokanetwork
          </a>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            discord.gg/uZRPcNb3m7
          </a>
        </div>
      </div>
    ),
  },
};

const SectionOverlay = ({ active, onClose }: Props) => {
  const returnFocus = useRef<HTMLElement | null>(null);

  if (!active) return null;
  const data = content[active];

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl" />
        <Dialog.Content
          className="fixed inset-0 z-[60] animate-fade-in outline-none"
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus();
          }}
        >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(ellipse at 50% 40%, hsl(235 90% 60% / 0.12), transparent 60%)" }}
      />

      <Dialog.Close asChild>
      <button
        className="absolute top-6 right-6 md:top-8 md:right-10 z-10 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      </Dialog.Close>

      <div className="relative h-full overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col justify-start pt-24 pb-24">
          <div className="max-w-5xl mx-auto px-6 md:px-10 w-full">
            <div className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground mb-10 uppercase animate-fade-in">
              {data.eyebrow}
            </div>
            <Dialog.Title className="text-[clamp(2rem,5vw,4.5rem)] font-extralight leading-[1.05] tracking-[-0.03em] mb-12 animate-fade-in">
              {data.title}
            </Dialog.Title>
            <div className="text-base md:text-lg text-muted-foreground font-light leading-relaxed animate-fade-in">
              {data.body}
            </div>
          </div>
        </div>
      </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SectionOverlay;
