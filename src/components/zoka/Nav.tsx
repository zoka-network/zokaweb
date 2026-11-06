import { ArrowUpRight, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { WEB_WALLET_URL } from "./links";

export type SectionKey = "about" | "tech" | "download" | "explorer" | "docs" | "github";

// Windows (Tech, Download, Docs) and places on the home (Roadmap, Tokenomics).
type NavLink = { key: SectionKey; label: string; href?: never } | { href: `#${string}`; label: string; key?: never };
const links: NavLink[] = [
  { key: "tech", label: "Tech" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#tokenomics", label: "Tokenomics" },
  { key: "download", label: "Download" },
  { key: "docs", label: "Docs" },
];

interface NavProps {
  active: SectionKey | null;
  onSelect: (key: SectionKey) => void;
  onHome: () => void;
}

const Nav = ({ active, onSelect, onHome }: NavProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggle = useRef<HTMLButtonElement>(null);

  const handleHome = () => {
    onHome();
    setMobileOpen(false);
  };

  const handleSelect = (key: SectionKey) => {
    if (mobileOpen) mobileToggle.current?.focus();
    onSelect(key);
    setMobileOpen(false);
  };

  return (
    <header className="quantic-header">
      <nav className="quantic-nav" aria-label="Main navigation">
        <button
          onClick={handleHome}
          className="quantic-brand"
          aria-label="Zoka Quantic home"
        >
          ZOKA QUANTIC
        </button>

        <div className="hidden sm:flex items-center gap-9 lg:gap-10 xl:gap-12 font-mono text-xs tracking-[0.12em]">
          {links.map((l) =>
            l.href ? (
              // Two more words do not fit the menu below 1024 px; the site map keeps them.
              <a key={l.href} href={l.href} className="hidden lg:inline text-muted-foreground transition-colors duration-500 hover:text-foreground">
                {l.label}
              </a>
            ) : (
              <button
                key={l.key}
                onClick={() => handleSelect(l.key)}
                className={`transition-colors duration-500 ${
                  active === l.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ),
          )}
          <div className="nav-wallet">
            <a href={WEB_WALLET_URL} target="_blank" rel="noopener noreferrer" className="nav-wallet-main">
              Web wallet <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a href="#docs/faucet" className="nav-wallet-faucet">
              Faucet
            </a>
          </div>
        </div>

        <div className="flex items-center sm:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            ref={mobileToggle}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        hidden={!mobileOpen}
        className={`sm:hidden overflow-hidden border-t border-border/40 bg-background/95 shadow-lg transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col px-6 py-4 font-mono text-xs uppercase tracking-[0.22em]">
          {links.map((l) =>
            l.href ? (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-12 items-center justify-between border-b border-border/30 text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                <span>{l.label}</span>
              </a>
            ) : (
              <button
                key={l.key}
                onClick={() => handleSelect(l.key)}
                className={`flex min-h-12 items-center justify-between border-b border-border/30 text-left transition-colors duration-300 last:border-b-0 ${
                  active === l.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{l.label}</span>
                {active === l.key && <span className="h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden="true" />}
              </button>
            ),
          )}
          <div className="nav-wallet nav-wallet-mobile">
            <a href={WEB_WALLET_URL} target="_blank" rel="noopener noreferrer" className="nav-wallet-main">
              <span>Web wallet</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#docs/faucet" className="nav-wallet-faucet" onClick={() => setMobileOpen(false)}>
              Faucet
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
