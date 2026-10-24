import { useEffect, useState } from "react";
import Nav, { type SectionKey } from "@/components/zoka/Nav";
import Hero from "@/components/zoka/Hero";
import SectionOverlay from "@/components/zoka/SectionOverlay";
import SiteFooter from "@/components/zoka/SiteFooter";

const sections: SectionKey[] = ["about", "tech", "download", "explorer", "docs", "github"];
const readLocation = () => {
  const [section, topic] = window.location.hash.slice(1).split("/");
  return { section: sections.includes(section as SectionKey) ? section as SectionKey : null, topic };
};

const Index = () => {
  const [route, setRoute] = useState(readLocation);
  useEffect(() => {
    const update = () => setRoute(readLocation());
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  const select = (section: SectionKey | null) => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${section ? `#${section}` : ""}`);
    setRoute({ section, topic: undefined });
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-background">
      <Nav active={route.section} onSelect={select} onHome={() => select(null)} />
      <Hero active={!route.section} />
      <SectionOverlay active={route.section} topic={route.topic} onClose={() => select(null)} />
      <SiteFooter onSelect={select} />
    </main>
  );
};

export default Index;
