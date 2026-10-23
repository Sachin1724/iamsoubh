/**
 * Marks the child of a horizontal rail nearest the middle of the rail with
 * `data-active`, on every scroll. Returns a cleanup function.
 *
 * Card offsets are measured once (and on resize), never per frame: the rails
 * auto-drift by writing scrollLeft every frame, and reading layout right after
 * that write forced a full layout each frame.
 */
export function highlightCentre(rail: HTMLElement) {
  let raf = 0;
  let centres: number[] = [];
  let active: Element | null = null;
  const measure = () => {
    centres = Array.from(rail.children, (c) => {
      const el = c as HTMLElement;
      return el.offsetLeft + el.offsetWidth / 2;
    });
  };
  const update = () => {
    raf = 0;
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    for (let i = 1; i < centres.length; i++) {
      if (Math.abs(centres[i] - mid) < Math.abs(centres[best] - mid)) best = i;
    }
    const next = rail.children[best] ?? null;
    if (next === active) return;
    active?.removeAttribute("data-active");
    next?.setAttribute("data-active", "");
    active = next;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  const onResize = () => {
    measure();
    onScroll();
  };
  measure();
  update();
  const ro = new ResizeObserver(onResize);
  ro.observe(rail);
  rail.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    rail.removeEventListener("scroll", onScroll);
  };
}
