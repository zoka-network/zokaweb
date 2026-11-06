import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";
import { docsGuideIds } from "@/components/zoka/DocsSection";
import { WALLET_DOWNLOAD, WEB_WALLET_URL } from "@/components/zoka/links";

vi.mock("@/components/zoka/HeroVideo", () => ({ default: () => null }));
afterEach(cleanup);

const sections = ["about", "tech", "download", "explorer", "docs", "github"];

describe("the home", () => {
  it("tells the three post-quantum chapters, in order", () => {
    render(<Index />);
    const titles = ["Private Spending Without ECDSA", "Post-Quantum Encryption for Transactions", "Secure Network and Node Identity"];
    titles.forEach((name, i) => {
      const heading = screen.getByRole("heading", { level: 2, name });
      const chapter = heading.closest("section")!;
      expect(within(chapter).getByText(`${i + 1} / 3`)).toBeInTheDocument();
      expect(within(chapter).getByRole("link", { name: "How it works →" })).toHaveAttribute("href", "#tech");
    });
    const proof = within(screen.getByRole("list", { name: "Proof system" })).getAllByRole("listitem").map((li) => li.textContent);
    expect(proof).toEqual(["STARKs", "Plonky3", "Poseidon2", "FRI"]);
    expect(within(screen.getByRole("list", { name: "X-Wing combines" })).getByText("ML-KEM-768")).toBeInTheDocument();
    const network = within(screen.getByRole("list", { name: "Network layers" })).getAllByRole("listitem").map((li) => li.textContent);
    expect(network).toEqual(["ML-DSA-65Node Identity", "QUIC / irohX25519MLKEM768", "TorOptional"]);
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
        expect(sections, href).toContain(section);
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
