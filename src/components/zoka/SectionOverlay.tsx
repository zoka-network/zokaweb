import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X, Monitor, Github, FileText, BookOpen, Plus, Minus, Terminal,
  Download, Cpu, Server, Boxes, Lock, Eye, EyeOff, ScanLine, Smartphone, Hash, KeyRound,
} from "lucide-react";
import type { SectionKey } from "./Nav";
import { MAINNET_NAME, TESTNET_LIVE, TESTNET_NAME, TESTNET_STATUS } from "./network";

// ─────────────────────────────────────────────────────────────────────────────
//  Constants — update these in one place when releases / URLs change.
// ─────────────────────────────────────────────────────────────────────────────
const REPO_BASE = "https://github.com/zoka-network";
const NETWORK_REPO = `${REPO_BASE}/zokanetwork`;
const WALLET_REPO = `${REPO_BASE}/zsilent-core`;
const MOBILE_REPO = `${REPO_BASE}/zkapriv`;
const WEB_REPO = `${REPO_BASE}/zokaweb`;
const ZSILENT_VERSION = "v3.0.5";
// The node release that the CLI miner ships (zoka-cli-miner-<version>-...).
const NODE_VERSION = "v3.0.4";
// Downloads are GitHub releases: ZSilent in zsilent-core, the CLI miner in
// zokanetwork. Until the testnet is announced the links open the release list,
// never a tag that may not exist yet: a broken download link is the most
// expensive kind of broken link.
const WALLET_RELEASES = `${WALLET_REPO}/releases`;
const WALLET_RELEASE = TESTNET_LIVE ? `${WALLET_RELEASES}/tag/${ZSILENT_VERSION}` : WALLET_RELEASES;
const MINER_RELEASES = `${NETWORK_REPO}/releases`;
const MINER_RELEASE = TESTNET_LIVE ? `${MINER_RELEASES}/tag/${NODE_VERSION}` : MINER_RELEASES;
const MINER_GUIDE = `${NETWORK_REPO}/blob/main/packaging/cli-miner/README.md`;
const MOBILE_BUILD_GUIDE = `${MOBILE_REPO}#readme`;
const DOCS_URL = "https://zokanetwork.gitbook.io/";
const DISCORD_URL = "https://discord.gg/uZRPcNb3m7";
// Espejo en GitLab, con los binarios publicados.
const GITLAB_BASE = "https://gitlab.com/zokanetwork";

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
          { id: "i", name: "X-Wing note encryption · ML-KEM-768", desc: "Implemented for Quantic. Every payment is encrypted to its recipient with X-Wing, which combines X25519 with ML-KEM-768 (NIST FIPS 203), so a future quantum computer should not find or read payments even knowing the address. The key lives in the full address (about 1,730 characters); wallets share a short one instead (below). External review pending." },
          { id: "ii", name: "Ironwood spend proofs · Halo 2", desc: "Implemented for Quantic. Zcash's corrected Orchard circuit, used without modification: a spend proves note membership, ownership and its nullifier without publishing the note. No rings, no key images and no trusted setup." },
          { id: "iii", name: "Value commitments", desc: "Amounts hide behind commitments that add up homomorphically, so the network checks that inputs equal outputs plus the fee without ever seeing a number; every value is checked inside the Halo 2 proof." },
          { id: "iv", name: "Nullifiers", desc: "A single-use tag prevents double spending. It is derived with a key that never appears in the address, and the proof shows it belongs to the spent note without revealing which one." },
          { id: "v", name: "Recoverable notes", desc: "Notes use the quantum-recoverable format proposed in ZIP 2005. Spend authorization and proof validity are still classical; the fully post-quantum pool (hash-based STARK proofs) is being designed and prototyped. The testnet restarts from zero with it, and the mainnet launches only with it." },
          { id: "vi", name: "Hybrid signatures · ML-DSA-65", desc: "Bootstrap snapshots and the team's chain checkpoints carry Ed25519 and ML-DSA-65 (NIST FIPS 204) signatures. A Quantic node accepts a checkpoint only if both verify: the network has no authority without the ML-DSA half." },
          { id: "vii", name: "Hybrid TLS · X25519MLKEM768", desc: "Snapshot connections over iroh negotiate X25519 combined with ML-KEM-768, so recorded traffic stays sealed even against a future quantum computer. A classical peer still connects. The main peer-to-peer transport (libp2p over Noise) and Tor are not post-quantum yet." },
          { id: "viii", name: "Short addresses · 57 characters", desc: "What you share is a 57-character address (zqtest1… on the testnet): a BLAKE2b-256 fingerprint of the full one, so it fits a standard QR code any phone camera reads. The wallet publishes the full address to a directory that every node keeps, with a small proof of work against spam; whoever pays looks it up and checks it against the fingerprint before paying. The full address keeps working." },
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
          { id: "i", name: "RandomX proof of work · rx/0", desc: "Standard RandomX, the algorithm Monero uses: random program execution that favours ordinary CPUs over ASICs and GPUs." },
          { id: "ii", name: "XMRig-compatible · Stratum", desc: "Blocks are mined over a 76-byte work blob laid out like Monero's, so XMRig and other rx/0 miners work unmodified. The node includes a Stratum server: each miner logs in with its own address and receives the whole reward of the blocks it finds. It is solo mining through a node, not a shared pool." },
          { id: "iii", name: "Key-rotating epochs", desc: "The RandomX key rotates every 2,048 blocks (~2.8 days at 120 s blocks), which resets the RandomX cache." },
          { id: "iv", name: "120 s target · 60-block coinbase maturity", desc: "The target is 120 seconds; actual intervals vary. On Quantic, ASERT difficulty follows the network's real speed and the chain with the most accumulated work wins. Proof-of-work finality is probabilistic: confirmations reduce reorganization risk, but no fixed count guarantees irreversibility." },
          { id: "v", name: "Private coinbase", desc: "Miner rewards are paid to private outputs. The subsidy amount is public so anyone can audit emission; the recipient is not." },
          { id: "vi", name: "Team premine at genesis", desc: "Zoka Quantic allocates 5,000,000 of the 23,000,000 ZKA cap (21.7%) to the team: a public output of the genesis block that anyone can check against the published address, spendable from the next block without a lock. The testnet's premine is test coins, like the rest of its supply." },
          { id: "vii", name: "Team checkpoints", desc: "The team's node signs checkpoints of the canonical chain, and nodes do not follow a branch that contradicts them. They prevent forks; the key cannot make an invalid block valid, create coins or spend anyone's funds. It is declared trust in the team." },
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
            <li>· Published address records (an address exists, not who uses it)</li>
          </ul>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">
        This is the Zoka Quantic protocol, implemented and pending external review. Receivers
        and memos are sealed with X-Wing, so they stay private against a future quantum
        computer, and a transaction never reveals which note it spends. That is one of the
        lessons of Zenith, the rehearsal network: there, each private transaction published
        the note it spent. Quantic's spend proof removes that link.
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
          verify the supply at any height. Mining continues with transaction fees after the subsidy ends.
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
          { id: "i", name: "Fees", desc: "Fees are public and conventional: 0.0001 ZKA per action, with a minimum of two actions, so a fee reveals nothing beyond the size of its transaction. The wallet shows the exact fee before you confirm." },
          { id: "ii", name: "Visible mempool metadata", desc: "Hidden amounts and recipients limit direct inspection, but timing, transaction size, fees and other public fields remain visible." },
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
          { id: "i", name: "Peer-to-peer operation", desc: "Nodes validate their own chain and exchange blocks with their peers; there are no servers to depend on. The team's node is the testnet's first seed, and every node that joins can serve the others." },
          { id: "ii", name: "Reachable without open ports", desc: "ZSilent runs a Tor v3 onion service for its node, so it is reachable from behind NAT with nothing forwarded on the router. The CLI miner reaches the network out through Tor. Tor is the primary transport, not an option bolted on top." },
          { id: "iii", name: "libp2p transport", desc: "Nodes speak the protocol over libp2p. Gossipsub propagates blocks and transactions; identify, ping and Kademlia handle peer health and discovery." },
          { id: "iv", name: "Snapshot sync over iroh", desc: "Nodes can pull chain snapshots from peers over iroh (QUIC with relay-assisted hole punching) and validate the imported blocks. Sync time depends on chain size, peers and the connection. QUIC connectivity is separate from Tor and may reveal an IP address to a peer or relay." },
          { id: "v", name: "Peers serve each other", desc: "A node that falls far behind asks its peers what chain they hold, picks the one with the most accumulated work and pulls it directly from whoever is furthest ahead. No privileged seed has to be online for the network to heal." },
          { id: "vi", name: "Two networks, never mixed", desc: "Zoka Quantic Testnet and Zoka Quantic Mainnet each have their own protocol id, gossip topics, ports, peer list and data folder: a node of one cannot join the other." },
          { id: "vii", name: "No trusted setup", desc: "Halo 2 needs no trusted setup: there are no ceremony parameters to trust." },
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
          { id: "i", name: "Private send and receive", desc: "Senders, recipients and amounts stay hidden. Share a 57-character address, or its QR code; it never appears on the chain, and two payments to it cannot be linked by looking at the chain." },
          { id: "ii", name: "Memos only the recipient reads", desc: "Attach up to 512 bytes to a payment. The memo is sealed with the note: nobody but the recipient can read it, not even the miners who include it." },
          { id: "iii", name: "CPU mining", desc: "Mine from ZSilent with one button, from a terminal with the CLI miner, or with XMRig through your node's Stratum server. Rewards arrive as private notes that mature after 60 blocks." },
          { id: "iv", name: "Built-in explorer", desc: "Inspect blocks, heights and network state from inside the wallet, served by your own node — no third-party site needs to know what you are looking at." },
          { id: "v", name: "Manual onion peers", desc: "Paste someone's onion address and your node keeps them as a neighbour, retrying while they are online. It matters most for anyone who cannot open ports on their router, which on this network is most people." },
          { id: "vi", name: "Command line", desc: "Everything the desktop app does is reachable from `zoka`: `zoka quantic-wallet` for wallets, `zoka fullnode` for the node and mining. The CLI miner packages it with Tor and ready-made scripts for Windows and Linux." },
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
          The Zoka Quantic column describes properties implemented in source, pending external
          review. Spend authorization becomes post-quantum with the new pool, before the mainnet
          launches. Confirmations reduce reorganization risk without guaranteeing finality.
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
            phase: "Built",
            phaseNote: "Implemented and tested",
            items: [
              { id: "0", name: "Zenith, the rehearsal", desc: "Our first network. It is where we built and tested the node, the wallets, CPU mining and the Tor transport that Zoka Quantic grew from, and where we learned what had to change. Retired on 21 October 2026: Quantic replaced it with a better chain, started from zero.", status: "Completed" },
              { id: "i", name: "Post-quantum building blocks", desc: "ML-KEM-768, X-Wing and ML-DSA-65, measured on a 32-bit Android phone before parameters were fixed.", status: "Implemented" },
              { id: "ii", name: "X-Wing note encryption", desc: "Classical key agreement combined with ML-KEM-768, so recipients, amounts and memos stay protected against future quantum attacks.", status: "Implemented" },
              { id: "iii", name: "Spend without publishing the note", desc: "Ironwood: membership, ownership and nullifier proven inside Zcash's corrected circuit, with no key images and no trusted setup.", status: "Implemented" },
              { id: "iv", name: "Hybrid signatures and hybrid TLS", desc: "Ed25519 plus ML-DSA-65 on bootstrap snapshots and team checkpoints (required: no ML-DSA half, no authority); X25519MLKEM768 on iroh connections.", status: "Implemented" },
              { id: "v", name: "Quantic node", desc: "Blocks, mempool, ASERT difficulty, mining, relay, light-wallet data and snapshot sync, run on local networks of several nodes.", status: "Implemented" },
              { id: "vi", name: "Short addresses", desc: "57-character addresses resolved through a directory that every node keeps, published by the wallet on its own, with a standard QR code.", status: "Implemented" },
              { id: "vii", name: "XMRig-compatible mining", desc: "A Monero-layout work blob and a Stratum server in the node. XMRig mined its first testnet blocks on 23 October 2026.", status: "Implemented" },
              { id: "viii", name: `ZSilent ${ZSILENT_VERSION}`, desc: "The official desktop wallet: 24-word wallets, exact fees and memos, short addresses with a standard QR code, its own node, one-button mining and a Stratum switch for XMRig.", status: TESTNET_LIVE ? "Released" : "Ready for the testnet" },
              { id: "ix", name: `CLI miner ${NODE_VERSION}`, desc: "The node with Tor and scripts for Windows and Linux: create a wallet, mine, check the balance or serve XMRig, from a terminal.", status: TESTNET_LIVE ? "Released" : "Ready for the testnet" },
            ],
          },
          {
            phase: TESTNET_NAME,
            phaseNote: "From zero, with test coins",
            items: [
              { id: "x", name: "Testnet genesis and first seed", desc: "A new chain started from zero on 23 October 2026, with the team's node as its first seed over Tor.", status: TESTNET_STATUS },
              { id: "xi", name: "ZKAPriv for Zoka Quantic", desc: "The phone engine and its peer-to-peer light-wallet transport are built and tested against a real node; the Android screens come next.", status: "In development" },
              { id: "xii", name: "Pool software support", desc: "The node calls that Monero pool software uses to fetch work and submit blocks, so existing pools can add Zoka.", status: "Planned" },
              { id: "xiii", name: "Restart with the post-quantum pool", desc: "When the fully post-quantum pool is ready the testnet restarts from zero, with new addresses, to try it before the mainnet.", status: "Planned" },
            ],
          },
          {
            phase: "Before the mainnet",
            phaseNote: "The mainnet launches only with all of these",
            items: [
              { id: "xiv", name: "Fully post-quantum pool", desc: "Spend authorization and validity on hash-based STARK proofs (Plonky3 with Poseidon2), so a quantum computer cannot forge spends or create coins. Prototyped and measured; the per-block aggregation is the open problem.", status: "In development" },
              { id: "xv", name: "External review", desc: "Independent review of ZOKA's changes: X-Wing note encryption, addresses, transaction format, the new pool and consensus rules.", status: "Planned" },
              { id: "xvi", name: "Post-quantum peer-to-peer transport", desc: "Hybrid TLS on the libp2p transport, next to Noise, so older peers still connect.", status: "Planned" },
              { id: "xvii", name: "Signed releases", desc: "Code-signed Windows binaries and installers, so the system can tell they are official.", status: "Planned" },
              { id: "xviii", name: `${MAINNET_NAME} genesis`, desc: "New chain, every post-quantum component active from block 0, with its own team wallet and authority key.", status: "Planned" },
            ],
          },
          {
            phase: "After that",
            phaseNote: "No dates promised",
            items: [
              { id: "xix", name: "Shared pool without custody", desc: "A P2Pool-style pool: many small miners share each block's reward in its coinbase, with no operator holding anyone's coins.", status: "Planned" },
              { id: "xx", name: "macOS and iOS clients", desc: "Signed macOS builds and an iOS wallet.", status: "Planned" },
              { id: "xxi", name: "I2P transport", desc: "A second anonymous transport next to Tor.", status: "Planned" },
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
          "On the testnet as it launches, spend authorization and proof validity are classical (RedPallas and Halo 2). A large quantum computer could forge proofs, create coins or spend others' notes there. The fully post-quantum pool fixes this; the testnet restarts with it, and the mainnet launches only with it.",
          "The post-quantum libraries are young and, to our knowledge, not independently audited. An external review is planned before genesis.",
          "ML-KEM-768 adds about one kilobyte per output, and full addresses are about 1,730 characters long. Wallets share a 57-character short address instead, which a payer can resolve only once its record has reached their node; the wallet publishes it on its own, and the full address always works.",
          "Publishing a short address puts on record that the address exists and since when. It reveals no balance or payment.",
          "Mining through the Stratum server is solo mining: each block pays whoever found it. A shared pool that pays small miners often does not exist yet.",
          "The Windows binaries are not code-signed yet, so Windows and antivirus programs may warn about them. Check the published SHA-256 before running anything.",
          "The Quantic plan includes a 5,000,000 ZKA team premine within the 23,000,000 cap (21.7%), spendable from block 0 without a lock.",
          "Tor reduces direct IP exposure but cannot eliminate traffic correlation. Direct QUIC connections and relays used by iroh have a different privacy boundary; Tor protection does not automatically cover them.",
          "A compromised spending key has no recovery backdoor. Custody is yours, with everything that implies.",
          "Giving the same receive address to distinct off-chain identities lets them see they paid the same person.",
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
        Zoka has two networks, both started from zero: {TESTNET_NAME}, with test coins, and{" "}
        {MAINNET_NAME}, which launches only with the fully post-quantum protocol and an
        external review. They grew out of Zenith, our first network: the rehearsal where we
        built and tested the node, the wallets, mining and the Tor transport. Zoka Quantic is
        what we built with that experience, a better chain designed from zero.
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
const MINER_FILE = `zoka-cli-miner-${NODE_VERSION.slice(1)}`;

const cliSteps: { id: string; icon: React.ComponentType<{ className?: string }>; title: string; body: React.ReactNode }[] = [
  {
    id: "01",
    icon: Download,
    title: "Download and verify",
    body: (
      <div className="space-y-4">
        <p>
          Get the CLI miner for Windows (<code className="font-mono text-foreground">.zip</code>)
          or Linux (<code className="font-mono text-foreground">.tar.gz</code>) from its release,
          and compare its SHA-256 with the release's SHA256SUMS.txt before unpacking.
        </p>
        <a href={MINER_RELEASE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">
          <Github className="w-4 h-4" />
          CLI miner release
          <span className="opacity-60">↗</span>
        </a>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div className="text-muted-foreground"># Windows (PowerShell)</div>
          <div>Get-FileHash .\{MINER_FILE}-windows-x64.zip -Algorithm SHA256</div>
          <div className="text-muted-foreground mt-2"># Linux</div>
          <div>sha256sum {MINER_FILE}-linux-x64.tar.gz</div>
        </div>
      </div>
    ),
  },
  {
    id: "02",
    icon: KeyRound,
    title: "Create a wallet",
    body: (
      <div className="space-y-4">
        <p>
          Choose a password, then <span className="text-foreground">write the 24 words down
          on paper.</span> They are shown once, they are the only way to recover the wallet,
          and anyone who has them can spend your coins. You also get your 57-character address:
          the one you share to get paid.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div className="text-muted-foreground"># Windows: double-click</div>
          <div>1-create-wallet.cmd</div>
          <div className="text-muted-foreground mt-2"># Linux (Tor first: sudo apt install tor)</div>
          <div>./zoka-miner.sh create-wallet</div>
        </div>
        <p className="text-sm">
          Already have a wallet? <span className="font-mono text-foreground">restore-wallet</span>{" "}
          brings it in from its 24 words.
        </p>
      </div>
    ),
  },
  {
    id: "03",
    icon: Cpu,
    title: "Mine",
    body: (
      <div className="space-y-4">
        <p>
          The script starts Tor and the node. The node syncs, waits until it is connected to
          another node so that your blocks reach the network, and mines with all CPU threads
          but one. Each block pays 12 ZKA, spendable after 60 blocks. These are test coins.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div className="text-muted-foreground"># Windows: double-click</div>
          <div>2-start-mining.cmd</div>
          <div className="text-muted-foreground mt-2"># Linux</div>
          <div>./zoka-miner.sh mine --threads 4</div>
        </div>
        <p className="text-sm">
          Stop with <span className="font-mono text-foreground">Ctrl + C</span>. Everything it
          writes stays in a <span className="font-mono text-foreground">data</span> folder next
          to the scripts.
        </p>
      </div>
    ),
  },
  {
    id: "04",
    icon: Hash,
    title: "Balance and address",
    body: (
      <div className="space-y-4">
        <p>
          With the miner running, check your balance from another window. Your address is
          published to the network automatically, so anyone can pay it.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div className="text-muted-foreground"># Windows: double-click</div>
          <div>check-balance.cmd · show-address.cmd · status.cmd</div>
          <div className="text-muted-foreground mt-2"># Linux</div>
          <div>./zoka-miner.sh balance · address · status</div>
        </div>
      </div>
    ),
  },
  {
    id: "05",
    icon: Server,
    title: "Mine with XMRig (optional)",
    body: (
      <div className="space-y-4">
        <p>
          Run the node with its Stratum server instead (port 3333; the node does not mine by
          itself) and point XMRig at it with your address. Each miner keeps the whole reward
          of the blocks it finds. XMRig is a separate download, and antivirus programs flag
          it as a miner.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div className="text-muted-foreground"># Windows: start-node-for-xmrig.cmd · Linux:</div>
          <div>./zoka-miner.sh xmrig-node</div>
          <div className="text-muted-foreground mt-2"># Then, on this machine or one on your local network:</div>
          <div>xmrig -o 127.0.0.1:3333 -u &lt;your address&gt; -p x -a rx/0</div>
        </div>
      </div>
    ),
  },
  {
    id: "06",
    icon: Terminal,
    title: "Build from source",
    body: (
      <div className="space-y-4">
        <p>
          The node is open source. With Rust installed (rustup.rs), build the same binary the
          release ships. The full guide, in English and Spanish, lives next to the scripts.
        </p>
        <div className="font-mono text-xs bg-foreground/[0.03] border border-border p-4 text-foreground/90 overflow-x-auto">
          <div>git clone https://github.com/zoka-network/zokanetwork.git</div>
          <div>cd zokanetwork</div>
          <div>cargo build --release --features randomx,quantic --bins</div>
        </div>
        <a href={MINER_GUIDE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">
          Open the CLI miner guide
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
                  a flag for any analyst to follow. Every ZOKA payment is private: there is
                  no transparent mode to opt out into. Only block subsidies and the genesis
                  allocation are public, so anyone can check the supply.
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
                  then ZOKA has already failed. Zoka Quantic needs no trusted setup, but it
                  still requires independent review.
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
                  Zoka Quantic includes a 5,000,000 ZKA team premine — 21.7% of the
                  23,000,000 cap, spendable from block 0 without a lock. The amount and the
                  address are published in each network's genesis. I would rather state this
                  plainly than let anyone discover it. What does not change: there is no{" "}
                  <span className="italic">"compliance"</span> view key the protocol can hand
                  over. Only the user who owns the key can reveal what they received or how
                  much. Not me. Not a foundation. Not a regulator.
                </>
              ),
            },
            {
              id: "08",
              title: "Zenith was the rehearsal",
              body: (
                <>
                  Before Zoka Quantic there was Zenith, our first network. It was the
                  rehearsal: where I built the node, the wallets, mining and the Tor transport,
                  where real people mined and sent payments, and where I learned what had to
                  change. Its private transactions still revealed which note they spent, and
                  its encryption would not survive a quantum computer. Instead of patching it,
                  I took everything it taught me and started a better chain from zero.{" "}
                  <span className="text-foreground">Zoka Quantic is that evolution.</span>{" "}
                  Zenith is retired, and nothing from it carries over.
                </>
              ),
            },
            {
              id: "09",
              title: "Why I am writing this",
              body: (
                <>
                  Most of what I do happens in silence — circuits, consensus, refactors that
                  nobody will ever read. But once, I owe it to whoever is reading this to
                  state the thing out loud: <span className="text-foreground">privacy is not a crime, it is a civic
                  infrastructure.</span> ZOKA is my contribution to that infrastructure.
                  Today, use {TESTNET_NAME} to test wallets, run a node and inspect the code.
                  Its coins are for testing: they never become mainnet coins.
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
                version: "v2.2 draft",
                href: "/ZOKA_Quantic_Whitepaper_v2.0.pdf",
                cta: "Read whitepaper",
                Icon: FileText,
              },
              {
                id: "lp", tag: "For everyone",
                name: "Litepaper",
                desc: "Zoka Quantic in plain language: what changes, why a new chain, how to use it. No math.",
                version: "v2.2",
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
                version: "v2.2 draft",
                href: "/ZOKA_Quantic_Whitepaper_v2.0.pdf",
                cta: "Read whitepaper",
                Icon: FileText,
              },
              {
                id: "lp", tag: "For everyone",
                name: "Litepaper",
                desc: "Plain-language companion. What Zoka Quantic does, what it does not, and why both of its networks start from zero. No math required.",
                version: "v2.2",
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
              {TESTNET_NAME} · {TESTNET_STATUS}
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
            <span className="text-foreground">ZSilent {ZSILENT_VERSION}</span> is the official
            wallet for {TESTNET_NAME}: self-custodial, with its own node and one-button mining.
            Prefer a terminal? The <span className="text-foreground">CLI miner</span> runs the
            same node with Tor and ready-made scripts, on Windows and Linux.{" "}
            <span className="text-foreground">ZKAPriv</span>, the Android wallet, is in
            development.
          </p>
          <p className="text-sm text-muted-foreground font-light">
            {TESTNET_LIVE
              ? `Both are published on GitHub with SHA-256 checksums.`
              : `ZSilent ${ZSILENT_VERSION} and the CLI miner ${NODE_VERSION} are published on GitHub, with SHA-256 checksums, when the testnet is announced.`}{" "}
            ZSilent releases before 3.0 are for Zenith, the rehearsal network that led to Zoka
            Quantic; they cannot join it.
          </p>
        </div>

        {/* Download cards: the official wallet, the CLI miner, the Android wallet */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { id: "wallet", name: "ZSilent", desc: "Official wallet · Windows 10 / 11 · MSI installer", badge: `${ZSILENT_VERSION} · Windows`, href: WALLET_RELEASE, cta: "Download ZSilent", Icon: Monitor },
            { id: "miner", name: "CLI miner", desc: "Node, Tor and scripts · Windows .zip · Linux .tar.gz", badge: `${NODE_VERSION} · Windows · Linux`, href: MINER_RELEASE, cta: "Download the CLI miner", Icon: Terminal },
            { id: "android", name: "ZKAPriv for Android", desc: "Mobile wallet · Zoka Quantic screens in development", badge: "In development", href: MOBILE_BUILD_GUIDE, cta: "Open Android source", Icon: Smartphone },
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
        <p className="text-xs text-muted-foreground/80 font-light">
          On Linux, mine with the CLI miner today; the ZSilent desktop app builds from source
          (<a href={`${WALLET_REPO}#readme`} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:underline">instructions</a>).
        </p>

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
                  Android comes first, through ZKAPriv. iOS is not shipped yet.
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
            Every release lists SHA-256 checksums in SHA256SUMS.txt. Compare your file's checksum
            before installing or unpacking. The binaries are not code-signed yet, so Windows may
            warn about them: a matching checksum is how you know the file is the official one.
          </p>
          <a href={WALLET_RELEASE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">
            <Github className="w-4 h-4" />
            ZSilent release
            <span className="opacity-60">↗</span>
          </a>
          <a href={MINER_RELEASE} target="_blank" rel="noopener noreferrer" className="ml-0 mt-3 md:ml-3 md:mt-0 inline-flex items-center gap-3 px-5 py-3 border border-border hover:border-foreground transition-colors font-mono text-[11px] tracking-[0.25em] uppercase text-foreground">
            <Github className="w-4 h-4" />
            CLI miner release
            <span className="opacity-60">↗</span>
          </a>
        </div>

        {/* Advanced path: CLI miner */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            Advanced
          </div>
          <h3 className="text-2xl md:text-3xl font-extralight tracking-[-0.01em] text-foreground mb-3">
            Mine from the terminal.
          </h3>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
            The CLI miner is the node ZSilent runs inside, packaged with Tor and scripts that
            create a wallet, mine and show your balance. It joins {TESTNET_NAME} and uses its own
            ports, so it can live next to ZSilent on the same computer (mine with one at a time:
            they share the CPU).
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
        <span className="text-muted-foreground">From your own node.</span>
      </>
    ),
    body: (
      <div className="space-y-12">
        <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
          The explorer lives inside <span className="text-foreground">ZSilent</span> and reads
          the chain from the node running on your machine. Nobody else learns which blocks you
          look at. There is no public web explorer for {TESTNET_NAME}: the one we ran for
          Zenith, the rehearsal network, was retired with it.
        </p>

        {/* What it shows */}
        <div>
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-5">
            What it shows
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                Icon: Boxes,
                title: "Blocks",
                desc: "Open a block by height or hash: its time, difficulty, size and how many transactions it carries.",
              },
              {
                Icon: Hash,
                title: "Transactions",
                desc: "On the chain a transaction is its hash, nullifiers, note commitments, sealed notes and fee. Never a sender, a recipient or an amount in the clear: there is nothing of the kind to show.",
              },
              {
                Icon: ScanLine,
                title: "Live network state",
                desc: "Chain height, peers, sync state and the network's difficulty, as your node sees them.",
              },
              {
                Icon: KeyRound,
                title: "Your own payments",
                desc: "Received and sent payments, with their amounts, are in your wallet's history: only your keys can open them.",
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

        {/* Privacy by absence */}
        <div className="p-6 border border-border bg-foreground/[0.02]">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
            What no explorer can show you
          </div>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            An explorer reads the same chain everyone reads: ciphertexts, commitments and
            nullifiers. It has no view key and no back-channel. A Zoka Quantic address never
            appears on the chain, so there is nothing to look up for it; two payments to the
            same address cannot be linked from the chain.
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
          For Zoka Quantic, start with the{" "}
          <a className="text-foreground underline underline-offset-4 hover:text-[#f2abd0]" href="/ZOKA_Quantic_Whitepaper_v2.0.pdf" target="_blank" rel="noopener noreferrer">whitepaper</a>{" "}
          and the{" "}
          <a className="text-foreground underline underline-offset-4 hover:text-[#f2abd0]" href="/ZOKA_Quantic_Litepaper_v2.0.pdf" target="_blank" rel="noopener noreferrer">litepaper</a>,
          and the guides in the repository: the CLI miner, running a node over Tor, short
          addresses, mining with XMRig and what is and is not post-quantum. The GitBook guides
          describe Zenith, the rehearsal network that led to Zoka Quantic, and are being
          rewritten for {TESTNET_NAME}; until then, the repository is the reference.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={MINER_GUIDE}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-foreground/80 hover:bg-foreground hover:text-background transition-colors font-mono text-[11px] tracking-[0.3em] uppercase text-foreground"
          >
            <BookOpen className="w-4 h-4" />
            CLI miner guide
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
                desc: `RandomX proof of work (rx/0, XMRig-compatible), ASERT difficulty with a 120-second target, supply and emission (23,000,000 ZKA max, 12 ZKA initial reward, halving after 1,051,200 blocks). Each Zoka Quantic network pays a 5,000,000 ZKA team allocation at genesis (test coins on the testnet).`,
              },
              {
                Icon: Lock,
                title: "Privacy model",
                desc: "What is hidden and what is public on the chain, X-Wing note encryption, Halo 2 spend proofs, short addresses and the threat model behind self-custodial private payments.",
              },
              {
                Icon: Smartphone,
                title: "Wallets",
                desc: "ZSilent, the official desktop wallet, and the CLI miner for Windows and Linux: installation, the 24-word backup, node, mining and XMRig. ZKAPriv (Android) when its Zoka Quantic screens ship.",
              },
              {
                Icon: Terminal,
                title: "Developers",
                desc: "Repository map, building from source, the node's local API and its Stratum server for rx/0 miners.",
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
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            zokanetwork.gitbook.io
          </a>{" "}
          · being rewritten for {TESTNET_NAME}
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
              desc: "Node, CLI and CLI miner, cryptography, consensus, P2P and Stratum of Zoka Quantic, with the manifests of both networks. CLI miner downloads are on its releases page.",
              href: NETWORK_REPO,
              mirror: `${GITLAB_BASE}/zokanetwork`,
            },
            {
              name: "zoka-network/zsilent-core",
              tag: "Wallet · Kotlin Compose Desktop",
              desc: "The official desktop wallet, Zoka Quantic only from 3.0. Bundles the node for onboarding, mining, send and receive. Windows downloads are on its releases page.",
              href: WALLET_REPO,
              mirror: `${GITLAB_BASE}/zsilent-core`,
            },
            {
              name: "zoka-network/zkapriv",
              tag: "Wallet · Android",
              desc: "Self-custodial Android wallet source. The Zoka Quantic engine and its peer-to-peer transport are built; the screens are in development.",
              href: MOBILE_REPO,
              mirror: `${GITLAB_BASE}/zkapriv`,
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
