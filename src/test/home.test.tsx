import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";
import { docsGuideIds } from "@/components/zoka/DocsSection";
import { WALLET_DOWNLOAD, WEB_WALLET_URL } from "@/components/zoka/links";

vi.mock("@/components/zoka/HeroVideo", () => ({ default: () => null }));
afterEach(cleanup);

const sections = ["about", "tech", "download", "explorer", "docs", "github"];
const anchors = ["roadmap", "tokenomics"];

describe("the home", () => {
  it("tells privacy first, then the three post-quantum chapters, in order", () => {
    render(<Index />);
    const titles = ["Private Payments by Default", "Private Spending Without ECDSA", "Post-Quantum Encryption for Transactions", "Secure Network and Node Identity"];
    titles.forEach((name, i) => {
      const heading = screen.getByRole("heading", { level: 2, name });
      const chapter = heading.closest("section")!;
      expect(within(chapter).getByText(`${i + 1} / 4`)).toBeInTheDocument();
      expect(within(chapter).getByText(i === 0 ? "Privacy by default" : "Post-quantum technology")).toBeInTheDocument();
      expect(within(chapter).getByRole("link", { name: "How it works →" })).toHaveAttribute("href", "#tech");
    });
    // The privacy chapter says what is hidden, and what is not.
    const hidden = within(screen.getByRole("list", { name: "Hidden on the chain" })).getAllByRole("listitem").map((li) => li.textContent);
    expect(hidden).toEqual(["Recipient", "Amount", "Memo", "Spent note"]);
    expect(screen.getByText(/Fees, timing and size stay public/)).toBeInTheDocument();
    const proof = within(screen.getByRole("list", { name: "Proof system" })).getAllByRole("listitem").map((li) => li.textContent);
    expect(proof).toEqual(["STARKs", "Plonky3", "Poseidon2", "FRI"]);
    expect(within(screen.getByRole("list", { name: "X-Wing combines" })).getByText("ML-KEM-768")).toBeInTheDocument();
    const network = within(screen.getByRole("list", { name: "Network layers" })).getAllByRole("listitem").map((li) => li.textContent);
    expect(network).toEqual(["ML-DSA-65Node Identity", "QUIC / irohX25519MLKEM768", "TorOptional"]);
  });

  it("shows the roadmap in order, without dates but the mainnet's target", () => {
    render(<Index />);
    const roadmap = screen.getByRole("heading", { level: 2, name: "The Road to Mainnet and Beyond" }).closest("section")!;
    expect(roadmap).toHaveAttribute("id", "roadmap");
    const years = within(roadmap).getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(years).toEqual(["2026", "2027", "2028"]);
    expect(within(roadmap).getByText("Zoka Quantic Mainnet")).toBeInTheDocument();
    expect(within(roadmap).getByText("Target: Q4 2027, once the external review passes")).toBeInTheDocument();
    expect(within(roadmap).getByText("Team checkpoints retired as the network grows")).toBeInTheDocument();
    expect(within(roadmap).getByText(/An iOS wallet as adoption grows/)).toBeInTheDocument();
    // No other quarter or month is promised.
    expect(roadmap.textContent).not.toMatch(/Q[1-3] 20|January|February|March|April|May|June|July|August|September|October|November|December/);
  });

  it("splits the 23,000,000 ZKA exactly as the node issues them", () => {
    render(<Index />);
    const tokenomics = screen.getByRole("heading", { level: 2, name: "Fixed Supply. Mining for Its Users." }).closest("section")!;
    expect(tokenomics).toHaveAttribute("id", "tokenomics");
    const rows = within(within(tokenomics).getByRole("table")).getAllByRole("row").slice(1);
    const parts = rows.map((row) => within(row).getAllByRole("cell").map((cell) => cell.textContent));
    expect(rows.map((row) => within(row).getByRole("rowheader").textContent)).toEqual([
      "Team, for development",
      "Mining at 12 ZKA per block",
      "Mining at 6 ZKA per block",
    ]);
    // 5M premine in block 1, 1,051,200 blocks of 12 ZKA, 897,600 blocks of 6 ZKA (ledger.rs).
    expect(parts.map((cells) => cells[0])).toEqual(["5,000,000 ZKA", "12,614,400 ZKA", "5,385,600 ZKA"]);
    expect(5_000_000 + 1_051_200 * 12 + 897_600 * 6).toBe(23_000_000);
    expect(parts.map((cells) => cells[1])).toEqual(["21.7%", "54.8%", "23.4%"]);
    // Every part of the bar has a name a screen reader can read.
    const segments = within(tokenomics).getAllByRole("img");
    expect(segments.map((s) => s.getAttribute("aria-label"))).toEqual([
      "Team, for development: 5,000,000 ZKA, 21.7%",
      "Mining at 12 ZKA per block: 12,614,400 ZKA, 54.8%",
      "Mining at 6 ZKA per block: 5,385,600 ZKA, 23.4%",
    ]);
  });

  it("ends with a card to start, and keeps the hero's own links", () => {
    render(<Index />);
    const card = screen.getByRole("heading", { level: 2, name: "Start with Zoka Quantic." }).closest("section")!;
    expect(within(card).getByRole("link", { name: "Download ZSilent" })).toHaveAttribute("href", WALLET_DOWNLOAD);
    expect(within(card).getByRole("link", { name: "Web wallet" })).toHaveAttribute("href", WEB_WALLET_URL);
    expect(within(card).getByRole("link", { name: "Read the docs" })).toHaveAttribute("href", "#docs");
    expect(screen.getByRole("link", { name: "Download wallet" })).toHaveAttribute("href", WALLET_DOWNLOAD);
  });

  it("maps the whole site in the footer, every link going somewhere real", () => {
    render(<Index />);
    const map = screen.getByRole("navigation", { name: "Site map" });
    const links = within(map).getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(20);
    for (const link of links) {
      const href = link.getAttribute("href")!;
      if (href.startsWith("#")) {
        const [section, topic] = href.slice(1).split("/");
        if (anchors.includes(section)) {
          // A place on the home: the element must exist.
          expect(document.getElementById(section), href).not.toBeNull();
        } else {
          expect(sections, href).toContain(section);
        }
        if (topic) expect(docsGuideIds, href).toContain(topic);
        expect(link).not.toHaveAttribute("target");
      } else {
        expect(href, link.textContent ?? "").toMatch(/^(https:\/\/|\/ZOKA_Quantic_)/);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
    for (const title of ["Get started", "Network", "Learn", "Build", "Social"]) {
      expect(within(map).getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });

  it("keeps the GitHub, X and Discord icons at the bottom", () => {
    render(<Index />);
    const footer = screen.getByRole("contentinfo");
    const icons = [...footer.querySelectorAll<HTMLAnchorElement>("a.quantic-social")].map((a) => [a.getAttribute("aria-label"), a.getAttribute("href")]);
    expect(icons).toEqual([
      ["GitHub", "https://github.com/zoka-network"],
      ["X / Twitter", "https://x.com/zokanetwork"],
      ["Discord", "https://discord.gg/uZRPcNb3m7"],
    ]);
  });
});
