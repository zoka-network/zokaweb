import QuantumField from "./QuantumField";

interface HeroProps {
  onCta: () => void;
}

const Hero = ({ onCta }: HeroProps) => (
  <section className="relative h-screen flex flex-col justify-center overflow-hidden">
    {/* monochrome quantum animation */}
    <QuantumField />

    {/* subtle grid — kept very faint so the privacy field stays dominant */}
    <div className="absolute inset-0 grid-bg opacity-20" />

    {/* readability scrim behind the headline */}
    <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent pointer-events-none" />

    {/* Top-left headline cluster — leaves the central nodes visible */}
    <div className="absolute top-24 md:top-28 left-6 md:left-10 z-10 max-w-md animate-fade-in">
      {/* Local scrim. The page-wide gradient fades out well before the right
          edge of this text, which left the copy sitting directly on the moving
          field and effectively unreadable. This panel travels with the text, so
          legibility no longer depends on where the animation happens to be. */}
      <div
        aria-hidden
        className="absolute -inset-x-8 -inset-y-10 bg-gradient-to-br from-background via-background/85 to-transparent blur-2xl pointer-events-none"
      />

      <div className="relative">
        {/* Kicker. "Post-quantum privacy" and not "quantum-proof": validity is
            still classical, and the tech section and whitepaper say so. The
            other two are structural facts about the network. */}
        <p className="mb-4 font-mono text-[10px] tracking-[0.32em] uppercase text-foreground/50">
          Post-quantum privacy · No servers · No open ports
        </p>

        {/* `zk-melt` animates letter-spacing up to 0.4em on an endless loop.
            That widens the text enough to wrap onto a second line, which grows
            the heading and shoves everything below it down on every cycle.
            `whitespace-nowrap` keeps each line on one line, so the block's
            height is constant and nothing under it moves. */}
        <h1 className="text-[clamp(1.5rem,3.2vw,2.75rem)] font-extralight leading-[1.05] tracking-[-0.03em]">
          <span className="zk-melt inline-block whitespace-nowrap">ZOKA Network</span>
          <br />
          <span className="zk-melt inline-block whitespace-nowrap text-gradient font-light mt-2 text-[clamp(1rem,2vw,1.6rem)] tracking-[0.1em] uppercase font-mono" style={{ animationDelay: "1.2s" }}>
            Zoka Quantic
          </span>
        </h1>

        {/* Zoka Quantic is the next mainnet and it is not live yet; the line
            under the pitch says so, so nobody reads the headline as a launch. */}
        <div className="mt-6 flex gap-3 animate-fade-up" style={{ animationDelay: "0.9s", animationFillMode: "backwards" }}>
          <span aria-hidden className="mt-1.5 w-px shrink-0 self-stretch bg-gradient-to-b from-foreground/40 to-transparent" />
          <div>
            <p className="max-w-sm text-sm font-light leading-relaxed text-foreground/80">
              The next ZOKA mainnet, with privacy designed to survive a quantum computer.
              No central servers, no public RPC, no ports to open — every node reaches the
              network through its own Tor onion service.
            </p>
            <p className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-foreground/60">
              <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-foreground/70 animate-pulse" />
              In development · Zenith is now the testnet
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom-left CTA — drives users to the downloads section */}
    <div className="absolute bottom-16 md:bottom-20 left-6 md:left-10 z-10 animate-fade-in">
      <button
        onClick={onCta}
        className="group inline-flex items-center gap-3 px-6 py-3 border border-foreground/80 hover:bg-foreground hover:text-background transition-colors font-mono text-[10px] tracking-[0.3em] uppercase text-foreground"
        aria-label="Download ZOKA testnet wallets"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
        Testnet wallets · Downloads
        <span className="opacity-70 group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  </section>
);
export default Hero;
