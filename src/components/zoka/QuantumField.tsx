import { useEffect, useRef } from "react";

/** A decorative network, not a visualization of live peers or activity. */
const QuantumField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const count = 64;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const nodes = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      return { x: Math.cos(goldenAngle * i) * radius, y, z: Math.sin(goldenAngle * i) * radius, accent: i % 5 === 0 || i % 11 === 0 };
    });
    const edges: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y, nodes[i].z - nodes[j].z);
        if (distance < 0.76 || (i * 19 + j * 7) % 23 === 0) edges.push([i, j]);
      }
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let time = 0;
    let previous = 0;
    let intersecting = true;
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.405;
      const ay = 0.43 + time * 0.065 + currentX;
      const ax = -0.13 + Math.sin(time * 0.075) * 0.12 + currentY;
      const projected = nodes.map((node) => {
        const x = node.x * Math.cos(ay) + node.z * Math.sin(ay);
        const z = -node.x * Math.sin(ay) + node.z * Math.cos(ay);
        const y = node.y * Math.cos(ax) - z * Math.sin(ax);
        const depth = node.y * Math.sin(ax) + z * Math.cos(ax);
        const perspective = 1 / (1 - depth * 0.16);
        return { x: width / 2 + x * radius * perspective, y: height / 2 + y * radius * perspective, depth: (depth + 1) / 2 };
      });
      ctx.lineWidth = 0.65;
      for (const [i, j] of edges) {
        const a = projected[i];
        const b = projected[j];
        ctx.strokeStyle = `rgba(218,218,224,${0.065 + (a.depth + b.depth) * 0.075})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      projected.map((p, index) => ({ ...p, index })).sort((a, b) => a.depth - b.depth).forEach((p) => {
        const accent = nodes[p.index].accent;
        const size = accent ? 2.5 + p.depth * 3.6 : 1 + p.depth * 1.25;
        const color = accent ? "244,170,211" : "242,242,247";
        if (accent && p.depth > 0.4) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
          glow.addColorStop(0, `rgba(${color},0.14)`);
          glow.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${color},${0.5 + p.depth * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    const tick = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      time += elapsed / 1000;
      currentX += (pointerX - currentX) * 0.025;
      currentY += (pointerY - currentY) * 0.025;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const syncAnimation = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      draw();
      if (!motion.matches && !document.hidden && intersecting) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || motion.matches) return;
      pointerX = (event.clientX / window.innerWidth - 0.5) * 0.16;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 0.1;
    };
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      syncAnimation();
    });
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    resize();
    syncAnimation();
    motion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
      window.removeEventListener("pointermove", pointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
};

export default QuantumField;
