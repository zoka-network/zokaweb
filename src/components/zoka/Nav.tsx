import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";

export type SectionKey = "about" | "tech" | "download" | "explorer" | "docs" | "github";

const links: { key: SectionKey; label: string }[] = [
  { key: "tech", label: "Tech" },
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

        <div className="hidden sm:flex items-center gap-9 lg:gap-12 font-mono text-xs tracking-[0.12em]">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => handleSelect(l.key)}
              className={`transition-colors duration-500 ${
                active === l.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
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
          {links.map((l) => (
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
          ))}
        </div>
      </div>
    </header>
  );
};

export default Nav;
