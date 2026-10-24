import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const HeroVideo = ({ active }: { active: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [userPlayback, setUserPlayback] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const requested = userPlayback ?? !reducedMotion;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    let visible = true;
    const sync = () => {
      if (requested && active && visible && !document.hidden) {
        void video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [requested, active, failed]);

  return (
    <div className="quantic-video">
      <video
        ref={videoRef}
        src={requested ? "/media/pcquantic.mp4" : undefined}
        poster="/media/pcquantic-poster.jpg"
        width="560"
        height="560"
        muted
        loop
        playsInline
        preload={requested ? "metadata" : "none"}
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => { setPlaying(false); setFailed(true); }}
      />
      {!failed && (
        <button type="button" className="quantic-video-control" aria-label={playing ? "Pause background video" : "Play background video"} onClick={() => setUserPlayback(!playing)}>
          {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
      )}
    </div>
  );
};

export default HeroVideo;
