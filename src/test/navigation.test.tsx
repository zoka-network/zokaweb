import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";
import { FAUCET_URL, WALLET_DOWNLOAD, WEB_WALLET_URL } from "@/components/zoka/links";

vi.mock("@/components/zoka/HeroVideo", () => ({ default: () => null }));

beforeEach(() => window.history.replaceState(null, "", "/"));
afterEach(cleanup);

const navigateHash = (hash: string) => {
  window.history.pushState(null, "", hash);
  fireEvent(window, new HashChangeEvent("hashchange"));
};

describe("section navigation", () => {
  it("opens an accessible dialog and restores focus when Escape closes it", async () => {
    render(<Index />);
    const downloads = screen.getByRole("button", { name: "Tech" });
    downloads.focus();
    fireEvent.click(downloads);

    const dialog = screen.getByRole("dialog", { name: /private by default. built to evolve/i });
    const close = within(dialog).getByRole("button", { name: "Close" });
    await waitFor(() => expect(close).toHaveFocus());
    fireEvent.keyDown(close, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(downloads).toHaveFocus());
  });

  it("closes a section with the visible close button", async () => {
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: "Tech", hidden: false }));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("hides collapsed mobile navigation from keyboard and accessibility navigation", () => {
    render(<Index />);
    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    const menu = document.getElementById(toggle.getAttribute("aria-controls")!);
    expect(menu).toHaveAttribute("hidden");
    fireEvent.click(toggle);
    expect(menu).not.toHaveAttribute("hidden");
    fireEvent.click(within(menu!).getByRole("button", { name: "Tech" }));
    expect(menu).toHaveAttribute("hidden");
    expect(screen.getByRole("dialog")).toHaveAccessibleName(/private by default. built to evolve/i);
  });

  it("links the web wallet from the navigation and from Download", () => {
    render(<Index />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Web wallet" })).toHaveAttribute("href", WEB_WALLET_URL);
    fireEvent.click(screen.getByRole("button", { name: "Download" }));
    const open = within(screen.getByRole("dialog")).getByRole("link", { name: "Open the web wallet" });
    expect(open).toHaveAttribute("href", WEB_WALLET_URL);
    expect(open).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps the faucet discreet: a small link beside the web wallet, to its guide in Docs", async () => {
    render(<Index />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Faucet" })).toHaveAttribute("href", "#docs/faucet");
    navigateHash("#docs/faucet");
    const dialog = await screen.findByRole("dialog", { name: /make the network your own/i });
    expect(within(dialog).getByRole("heading", { name: "Get test ZKA" })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Open the faucet" })).toHaveAttribute("href", FAUCET_URL);
    navigateHash("#docs/web-wallet");
    expect(await within(await screen.findByRole("dialog")).findByRole("heading", { name: "Web wallet" })).toBeInTheDocument();
  });

  it("sends the home CTAs to the wallet installer and the declared public explorer", () => {
    render(<Index />);
    expect(screen.getByRole("link", { name: "Download wallet" })).toHaveAttribute("href", WALLET_DOWNLOAD);
    const explorer = screen.getByRole("link", { name: "Explore the network" });
    expect(explorer).toHaveAttribute("href", "https://zokascan.cc");
    expect(explorer).not.toHaveAccessibleDescription("ZokaScan is temporarily offline.");
  });

  it("keeps tutorials out of Download and opens the linked CLI guide inside Docs", async () => {
    render(<Index />);
    fireEvent.click(screen.getByRole("button", { name: "Download" }));
    let dialog = screen.getByRole("dialog");
    const link = within(dialog).getByRole("link", { name: /set up the cli miner/i });
    expect(link).toHaveAttribute("href", "#docs/cli-miner");
    expect(dialog.querySelector("pre")).toBeNull();
    navigateHash(link.getAttribute("href")!);
    dialog = await screen.findByRole("dialog", { name: /make the network your own/i });
    expect(within(dialog).getByRole("heading", { name: "Set up the CLI miner" })).toBeInTheDocument();
    expect(dialog.textContent).toContain("./zoka-miner.sh mine --threads 4");
    expect(within(dialog).getByRole("link", { name: /whitepaper.*protocol/i })).toHaveAttribute("href", "/ZOKA_Quantic_Whitepaper.pdf");
  });

  it("opens a shared guide URL and follows browser history changes", async () => {
    window.history.replaceState(null, "", "/#docs/stratum");
    render(<Index />);
    expect(screen.getByRole("heading", { name: "XMRig & Stratum" })).toBeInTheDocument();
    navigateHash("#download");
    expect(screen.getByRole("dialog", { name: "Your keys. Your silence." })).toBeInTheDocument();
    window.history.replaceState(null, "", "/#docs/stratum");
    fireEvent(window, new PopStateEvent("popstate"));
    expect(screen.getByRole("heading", { name: "XMRig & Stratum" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(window.location.hash).toBe("");
  });
});
