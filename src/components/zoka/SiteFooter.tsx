import { Github, MessageCircle } from "lucide-react";
import type { SectionKey } from "./Nav";
import { TESTNET_NAME, TESTNET_STATUS } from "./network";

const SiteFooter = ({ onSelect }: { onSelect: (key: SectionKey) => void }) => (
  <footer className="quantic-footer">
    <button onClick={() => onSelect("about")} aria-label="About Zoka Network" className="hover:text-foreground transition-colors">
      © {new Date().getFullYear()} Zoka Network
    </button>
    <button onClick={() => onSelect("download")} className="quantic-testnet-link">
      {TESTNET_NAME} · {TESTNET_STATUS} <span aria-hidden="true">↗</span>
    </button>
    <div className="flex items-center gap-5">
      <a href="https://github.com/zoka-network" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="quantic-social">
        <Github size={18} strokeWidth={1.5} />
      </a>
      <a href="https://x.com/zokanetwork" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="quantic-social">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 3h4.5L20 21h-4.5L4 3Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="m20 3-7 8M4 21l7-8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </a>
      <a href="https://discord.gg/uZRPcNb3m7" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="quantic-social">
        <MessageCircle size={18} strokeWidth={1.5} />
      </a>
    </div>
  </footer>
);

export default SiteFooter;
