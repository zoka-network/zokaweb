import { ArrowUpRight } from "lucide-react";
import QuantumField from "./QuantumField";

interface HeroProps {
  onCta: () => void;
}

const Hero = ({ onCta }: HeroProps) => (
  <section className="quantic-hero" aria-labelledby="quantic-title">
    <div className="quantic-copy">
      <h1 id="quantic-title" className="quantic-title">
        <span>ZOKA</span>{" "}
        <span className="quantic-pink">QUANTIC</span>
      </h1>
      <p className="quantic-tagline">Private by design.</p>
      <button onClick={onCta} className="quantic-cta">
        <span>Explore the network</span>
        <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <p className="quantic-status">
        <span aria-hidden="true" />
        Mainnet in development
      </p>
    </div>
    <div className="quantic-visual" aria-hidden="true">
      <QuantumField />
    </div>
  </section>
);

export default Hero;
