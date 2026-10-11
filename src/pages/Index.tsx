import { useState } from "react";
import Nav, { type SectionKey } from "@/components/zoka/Nav";
import Hero from "@/components/zoka/Hero";
import SectionOverlay from "@/components/zoka/SectionOverlay";
import SiteFooter from "@/components/zoka/SiteFooter";

const Index = () => {
  const [active, setActive] = useState<SectionKey | null>(null);

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-background">
      <Nav active={active} onSelect={setActive} onHome={() => setActive(null)} />
      <Hero onCta={() => setActive("tech")} />
      <SectionOverlay active={active} onClose={() => setActive(null)} />
      <SiteFooter onSelect={setActive} />
    </main>
  );
};

export default Index;
