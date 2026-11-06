import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { NodeCubes, StarkLayers, XWingLock } from "./GlassVisuals";
import ParticleFloor from "./ParticleFloor";
import { WALLET_DOWNLOAD, WEB_WALLET_URL } from "./links";
import { useReveal } from "./useReveal";
import { useScrollProgress } from "./useScrollProgress";

/** The big card at the end of the home: where to start, with the three objects. */
const ClosingCard = () => {
  const [ref, { seen, live }] = useReveal<HTMLElement>(0.05);
  useScrollProgress(ref, live);
  return (
    <section ref={ref} className="closing" data-seen={seen} data-live={live} aria-labelledby="closing-title">
      <div className="closing-card">
        <div className="closing-arc" aria-hidden="true" />
        <div className="closing-copy">
          <p className="closing-brand">ZOKA QUANTIC</p>
          <h2 id="closing-title" className="closing-title">
            <span>Start with </span>
            <span>
              Zoka <span className="quantic-pink">Quantic.</span>
            </span>
          </h2>
          <p className="closing-text">
            Private payments, post-quantum from end to end. The testnet is live: try it with test coins, on your
            computer, your phone or in the browser.
          </p>
          <div className="closing-actions">
            <a href={WALLET_DOWNLOAD} className="closing-btn closing-btn-primary">
              <span>Download ZSilent</span>
              <Download size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href={WEB_WALLET_URL} target="_blank" rel="noopener noreferrer" className="closing-btn">
              <span>Web wallet</span>
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href="#docs" className="closing-btn closing-btn-ghost">
              <span>Read the docs</span>
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="closing-visuals" aria-hidden="true">
          <div className="mini mini-stark">
            <div className="mini-inner">
              <StarkLayers />
            </div>
          </div>
          <div className="mini mini-lock">
            <div className="mini-inner">
              <XWingLock />
            </div>
          </div>
          <div className="mini mini-nodes">
            <div className="mini-inner">
              <NodeCubes />
            </div>
          </div>
        </div>
        <ParticleFloor seed={4.2} className="closing-floor" />
      </div>
    </section>
  );
};

export default ClosingCard;
