import { useRef } from "react";
import TechSection from "./TechSection";
import DocsSection from "./DocsSection";
import DownloadSection from "./DownloadSection";
import { EXPLORER_URL, REPO_BASE, NETWORK_REPO, WALLET_REPO, MOBILE_REPO } from "./links";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Github, Boxes, ScanLine, Hash, KeyRound } from "lucide-react";
import type { SectionKey } from "./Nav";
import { TESTNET_NAME } from "./network";

const WEB_REPO = `${REPO_BASE}/zokaweb`;
const DISCORD_URL = "https://discord.gg/uZRPcNb3m7";
const GITLAB_BASE = "https://gitlab.com/zokanetwork";

interface Props {
  active: SectionKey | null;
  onClose: () => void;
  topic?: string;
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
              core dev @ Zoka Quantic
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
                  23,000,000 cap, spendable from the first block after genesis without a lock. The amount and the
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
              title: "Zenith is our foundation",
              body: (
                <>
                  Before Zoka Quantic there was Zenith, our first network. It laid the
                  foundation: where I built the node, the wallets, mining and the Tor transport,
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

        <a href="#docs/papers" className="text-link">Read the whitepaper and litepaper →</a>

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
              core dev @ Zoka Quantic
            </span>
          </div>
        </div>
      </div>
    ),
  },
  tech: {
    eyebrow: "II. TECH · PRIVACY FROM END TO END",
    title: "Private by default. Built to evolve.",
    body: <TechSection />,
  },
  download: {
    eyebrow: "III. DOWNLOAD · TESTNET CLIENTS",
    title: "Your keys. Your silence.",
    body: <DownloadSection />,
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
          look at. <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" className="text-link">ZokaScan</a>,
          our public explorer, shows the same chain on the web, with network charts and a
          read-only API; with your wallet's view key it also shows your balance, opened
          inside your browser.{" "}
          <a href="#docs/explorer" className="text-link">Read the explorer guide →</a>
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
            same address cannot be linked from the chain. Only a view key you paste yourself
            opens a wallet, and ZokaScan opens it inside your browser: the key never reaches
            a server.
          </p>
        </div>
      </div>
    ),
  },
  docs: {
    eyebrow: "V. DOCS · GUIDES & PAPERS",
    title: "Make the network your own.",
    body: <DocsSection />,
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

const SectionOverlay = ({ active, topic, onClose }: Props) => {
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

      <div key={active} className="relative h-full overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col justify-start pt-24 pb-24">
          <div className="max-w-6xl mx-auto px-6 md:px-10 w-full">
            <nav className="section-navigation" aria-label="Section navigation">
              <a href="#tech" aria-current={active === "tech" ? "page" : undefined}>Tech</a>
              <a href="#download" aria-current={active === "download" ? "page" : undefined}>Download</a>
              <a href="#docs" aria-current={active === "docs" ? "page" : undefined}>Docs</a>
            </nav>
            <div className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground mb-10 uppercase animate-fade-in">
              {data.eyebrow}
            </div>
            <Dialog.Title className="text-[clamp(2rem,5vw,4.5rem)] font-extralight leading-[1.05] tracking-[-0.03em] mb-12 animate-fade-in">
              {data.title}
            </Dialog.Title>
            <div className="text-base md:text-lg text-muted-foreground font-light leading-relaxed animate-fade-in">
              {active === "docs" ? <DocsSection topic={topic} /> : data.body}
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
