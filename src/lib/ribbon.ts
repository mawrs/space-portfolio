import { tokens } from "@/data/tokens";

export type Ribbon = {
  base: number;
  min: number;
  max: number;
  vertical: boolean;
};

export function isMobile() {
  return window.matchMedia(`(max-width: ${tokens.breakpoint - 1}px)`).matches;
}

export function readRibbon(mobile = isMobile()): Ribbon | null {
  const cards = [...document.querySelectorAll<HTMLElement>("[data-gl='card']")];
  if (!cards.length || cards[0].offsetWidth === 0) return null;

  const parent = cards[0].parentElement;
  const gap = parent ? Number.parseFloat(getComputedStyle(parent).gap) || 0 : 0;
  const sizes = cards.map((card) => ({
    width: card.offsetWidth,
    height: card.offsetHeight,
  }));
  const span = (index: number) =>
    sizes
      .slice(0, index)
      .reduce((sum, card) => sum + (mobile ? card.height : card.width), 0) +
    gap * index;
  const extent = (index: number) => (mobile ? sizes[index].height : sizes[index].width);
  const viewport = mobile ? window.innerHeight : window.innerWidth;
  const center = (index: number) => viewport / 2 - span(index) - extent(index) / 2;

  if (mobile) {
    const last = sizes.length - 1;
    return {
      base: 0,
      min: Math.min(0, viewport - (span(last) + extent(last) + gap)),
      max: 0,
      vertical: true,
    };
  }

  const focus = Math.min(tokens.focusIndex, sizes.length - 1);
  const base = center(focus);
  return {
    base,
    min: center(sizes.length - 1) - base,
    max: center(0) - base,
    vertical: false,
  };
}
