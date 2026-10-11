import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";

vi.mock("@/components/zoka/QuantumField", () => ({ default: () => null }));
vi.mock("@/components/zoka/ThemeToggle", () => ({ default: () => null }));

afterEach(cleanup);

describe("section navigation", () => {
  it("opens an accessible dialog and restores focus when Escape closes it", async () => {
    render(<Index />);
    const downloads = screen.getByRole("button", { name: "Explore the network" });
    downloads.focus();
    fireEvent.click(downloads);

    const dialog = screen.getByRole("dialog", { name: /a blockchain built in rust/i });
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
    expect(screen.getByRole("dialog")).toHaveAccessibleName(/a blockchain built in rust/i);
  });
});
