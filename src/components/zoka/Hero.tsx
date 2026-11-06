import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import HeroVideo from "./HeroVideo";
import ParticleFloor from "./ParticleFloor";
import { TESTNET_LIVE } from "./network";
import { EXPLORER_URL, WALLET_DOWNLOAD } from "./links";
import { useReveal } from "./useReveal";
import { useScrollProgress } from "./useScrollProgress";

interface HeroProps {
  active: boolean;
}

/** The first screen, in the style of the chapters below: black, glass and a floor of dots. */
const Hero = ({ active }: HeroProps) => {
  const [ref, { live }] = useReveal<HTMLDivElement>(0.05);
  useScrollProgress(ref, live);
  return (
    <div ref={ref} className="hero-stage">
      <section className="quantic-hero" aria-labelledby="quantic-title">
        <div className="quantic-copy">
          <p className="quantic-status">
            <span aria-hidden="true" />
            {TESTNET_LIVE ? "Quantic Testnet live" : "Quantic Testnet launching"} · Mainnet coming soon
            <span className="story-rule" aria-hidden="true" />
          </p>
          <h1 id="quantic-title" className="quantic-title">
            <span>ZOKA</span>{" "}
            <span className="quantic-pink">QUANTIC</span>
          </h1>
          <p className="quantic-tagline">Zero knowledge by default.</p>
          <p className="quantic-description">A private blockchain with post-quantum encryption.<br />Your keys. Your payments. Your business.</p>
          <div className="quantic-actions">
            <a href={WALLET_DOWNLOAD} className="quantic-cta quantic-cta-primary">
              <span>Download wallet</span>
              <Download size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" className="quantic-cta" aria-describedby="explorer-status">
              <span>Explore the network</span>
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
          <p className="quantic-wallet-note">ZSilent · Windows · <a href="#download">All downloads</a></p>
          <p className="quantic-wallet-note" id="explorer-status">ZokaScan: blocks, network charts and your own balance by view key.</p>
        </div>
        <div className="quantic-visual">
          <div className="hero-halo" aria-hidden="true" />
          <HeroVideo active={active} />
        </div>
        <button
          type="button"
          className="hero-scroll"
          onClick={() => document.getElementById("technology")?.scrollIntoView({ behavior: "smooth" })}
        >
          The technology <ArrowDown size={13} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </section>
      <ParticleFloor seed={0.6} className="hero-floor" />
    </div>
  );
};

export default Hero;
