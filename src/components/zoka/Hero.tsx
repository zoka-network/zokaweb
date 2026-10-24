import { ArrowUpRight, Download } from "lucide-react";
import HeroVideo from "./HeroVideo";
import { TESTNET_LIVE } from "./network";
import { EXPLORER_URL, WALLET_DOWNLOAD } from "./links";

interface HeroProps {
  active: boolean;
}

const Hero = ({ active }: HeroProps) => (
  <section className="quantic-hero" aria-labelledby="quantic-title">
    <div className="quantic-copy">
      <h1 id="quantic-title" className="quantic-title">
        <span>ZOKA</span>{" "}
        <span className="quantic-pink">NETWORK</span>
      </h1>
      <p className="quantic-tagline">Privacy. From end to end.</p>
      <p className="quantic-description">Your keys. Your payments. Your business.<br />Private by default, built for what comes next.</p>
      <div className="quantic-actions">
        <a href={WALLET_DOWNLOAD} className="quantic-cta quantic-cta-primary">
          <span>Download wallet</span>
          <Download size={17} strokeWidth={1.5} aria-hidden="true" />
        </a>
        <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer" className="quantic-explore" aria-describedby="explorer-status">
          <span>Explore the network</span>
          <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
        </a>
      </div>
      <p className="quantic-wallet-note">ZSilent · Windows · <a href="#download">All downloads</a></p>
      <p className="quantic-wallet-note" id="explorer-status">ZokaScan is temporarily offline.</p>
      <p className="quantic-status">
        <span aria-hidden="true" />
        {TESTNET_LIVE ? "Quantic Testnet live" : "Quantic Testnet launching"} · Mainnet coming soon
      </p>
    </div>
    <div className="quantic-visual">
      <HeroVideo active={active} />
    </div>
  </section>
);

export default Hero;
