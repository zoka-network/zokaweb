import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";

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

  it("sends the home CTAs to the wallet installer and the declared public explorer", () => {
    render(<Index />);
    expect(screen.getByRole("link", { name: "Download wallet" })).toHaveAttribute("href", expect.stringContaining("ZSilent-Core-3.0.5.msi"));
    const explorer = screen.getByRole("link", { name: "Explore the network" });
    expect(explorer).toHaveAttribute("href", "https://zokascan.cc");
    expect(explorer).toHaveAccessibleDescription("ZokaScan is temporarily offline.");
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
    expect(within(dialog).getByRole("link", { name: /whitepaper.*protocol/i })).toHaveAttribute("href", "/ZOKA_Quantic_Whitepaper_v2.0.pdf");
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
