import { useEffect, useState } from "react";
import Nav, { type SectionKey } from "@/components/zoka/Nav";
import Hero from "@/components/zoka/Hero";
import SectionOverlay from "@/components/zoka/SectionOverlay";
import SiteFooter from "@/components/zoka/SiteFooter";
import TechStory from "@/components/zoka/TechStory";
import ClosingCard from "@/components/zoka/ClosingCard";
import Roadmap from "@/components/zoka/Roadmap";
import Tokenomics from "@/components/zoka/Tokenomics";
import "@/components/zoka/home.css";

const sections: SectionKey[] = ["about", "tech", "download", "explorer", "docs", "github"];
// Places on the home itself: #roadmap and #tokenomics scroll there instead of opening a window.
const anchors = ["roadmap", "tokenomics"];
const readLocation = () => {
  const [section, topic] = window.location.hash.slice(1).split("/");
  return {
    section: sections.includes(section as SectionKey) ? section as SectionKey : null,
    topic,
    anchor: anchors.includes(section) ? section : null,
  };
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
  // After an open window closes (and lets the page scroll again), go to the place.
  useEffect(() => {
    if (!route.anchor) return;
    const timer = window.setTimeout(() => document.getElementById(route.anchor!)?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 60);
    return () => window.clearTimeout(timer);
  }, [route.anchor]);
  const select = (section: SectionKey | null) => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${section ? `#${section}` : ""}`);
    setRoute({ section, topic: undefined, anchor: null });
  };
  const home = () => {
    select(null);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-background">
      <Nav active={route.section} onSelect={select} onHome={home} />
      <Hero active={!route.section} />
      <TechStory />
      <Roadmap />
      <Tokenomics />
      <ClosingCard />
      <SiteFooter onSelect={select} />
      <SectionOverlay active={route.section} topic={route.topic} onClose={() => select(null)} />
    </main>
  );
};

export default Index;
