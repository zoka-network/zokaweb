import { EXPLORER_URL, GITLAB_URL, MINER_RELEASE, NETWORK_REPO, PUBLIC_API_URL, NETWORK_STATUS_URL, REPO_BASE, WEB_WALLET_URL, papers } from "./links";
import { TESTNET_LIVE } from "./network";

// The footer's map of the site, in columns like the footers of Aleo and Aptos.
// Hash links open the same windows as the menu (Tech, Download, Docs guides).

export interface MapLink {
  label: string;
  href: string;
  external?: boolean;
}

const whitepaper = papers.find((p) => p.name === "Whitepaper")?.href ?? "/ZOKA_Quantic_Whitepaper.pdf";
const litepaper = papers.find((p) => p.name === "Litepaper")?.href ?? "/ZOKA_Quantic_Litepaper.pdf";

export const siteMap: { title: string; links: MapLink[] }[] = [
  {
    title: "Get started",
    links: [
      { label: "Download ZSilent", href: "#download" },
      { label: "Web wallet", href: WEB_WALLET_URL, external: true },
      { label: "ZKAPriv for Android", href: "#docs/android" },
      { label: "CLI miner", href: "#docs/cli-miner" },
      { label: "Get test ZKA", href: "#docs/faucet" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "ZokaScan", href: EXPLORER_URL, external: true },
      { label: "Network status", href: NETWORK_STATUS_URL, external: true },
      { label: "Run a node", href: "#docs/node" },
      { label: "Mine with XMRig", href: "#docs/stratum" },
      { label: "Verify downloads", href: "#docs/verify" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Technology", href: "#tech" },
      { label: "Documentation", href: "#docs" },
      { label: "Whitepaper", href: whitepaper, external: true },
      { label: "Litepaper", href: litepaper, external: true },
      { label: "About · Manifesto", href: "#about" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Build & develop", href: "#docs/developers" },
      { label: "Source on GitHub", href: REPO_BASE, external: true },
      { label: "GitLab mirror", href: GITLAB_URL, external: true },
      { label: "Public API", href: PUBLIC_API_URL, external: true },
      { label: "Releases", href: MINER_RELEASE.replace(/\/tag\/.*$/, ""), external: true },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "X", href: "https://x.com/zokanetwork", external: true },
      { label: "GitHub", href: REPO_BASE, external: true },
      { label: "Discord", href: "https://discord.gg/uZRPcNb3m7", external: true },
      { label: "Repositories", href: "#github" },
    ],
  },
];

const SiteMap = () => (
  <div className="site-map">
    <div className="site-map-brand">
      <p className="site-map-name">ZOKA QUANTIC</p>
      <p className="site-map-tag">Zero knowledge by default.</p>
      <p className="site-map-status">
        <span aria-hidden="true" />
        {TESTNET_LIVE ? "Quantic Testnet live" : "Quantic Testnet launching"} · Mainnet coming soon
      </p>
    </div>
    <nav className="site-map-columns" aria-label="Site map">
      {siteMap.map((column) => (
        <div key={column.title} className="site-map-column">
          <h2 className="site-map-title">{column.title}</h2>
          <ul>
            {column.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="site-map-link"
                >
                  {link.label}
                  {link.external && (
                    <span className="site-map-arrow" aria-hidden="true">
                      ↗
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  </div>
);

export default SiteMap;
