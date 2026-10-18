// Procedural root system for the roots descent section.
// World space: x in px across the viewport width, y in px from the surface (0) down to worldHeight.
// Every point carries a growth stamp `b` (0..1+) so roots can be revealed progressively by scroll.

export type RootPoint = { x: number; y: number; w: number; b: number };
export type Root = { pts: RootPoint[]; depth: number; length: number };
export type Pebble = { x: number; y: number; rx: number; ry: number; rot: number; tone: number; parallax: number };

const TAU = Math.PI * 2;

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Wavy soil edge, 0 = top of the edge band, 1 = bottom. Shared by the CSS mask and the canvas,
// so roots and text can react to exactly where each soil layer is.
export function soilWave(u: number, layer: number): number {
  const p = layer * 1.913;
  const v =
    0.52 +
    0.2 * Math.sin(u * TAU * 1.15 + p) +
    0.11 * Math.sin(u * TAU * 2.7 + p * 2.3) +
    0.05 * Math.sin(u * TAU * 6.4 + p * 0.7) +
    0.025 * Math.sin(u * TAU * 13.1 + p * 3.1);
  return Math.min(1, Math.max(0, v));
}

export function soilMaskUrl(layer: number): string {
  const samples = 64;
  let d = "M0 100";
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    d += ` L${(u * 1000).toFixed(1)} ${(soilWave(u, layer) * 100).toFixed(2)}`;
  }
  d += " L1000 100 Z";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' preserveAspectRatio='none'><path d='${d}' fill='black'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export class RootSystem {
  readonly roots: Root[] = [];
  readonly pebbles: Pebble[] = [];
  readonly core: { x: number; y: number };
  maxStamp = 1;
  // Branches wait here so every main root is grown before any of them branch (breadth-first),
  // which spreads the root budget across the whole width instead of one subtree.
  private readonly pending: Array<() => void> = [];

  constructor(
    readonly width: number,
    readonly worldHeight: number,
    readonly viewHeight: number,
    seed = 20261018
  ) {
    this.core = { x: width / 2, y: worldHeight - viewHeight * 0.5 };
    const rng = mulberry32(seed);
    this.seedRoots(rng);
    while (this.pending.length > 0 && this.roots.length < this.budget) this.pending.shift()!();
    this.scatterPebbles(rng);
    this.maxStamp = this.roots.reduce((m, r) => Math.max(m, r.pts[r.pts.length - 1]?.b ?? 0), 0);
  }

  private get budget(): number {
    return this.width < 720 ? 170 : 270;
  }

  private seedRoots(rng: () => number): void {
    const W = this.width;
    const scale = Math.min(1.25, Math.max(0.42, W / 1440));
    // Taproot heads for the core; the rest fan out from the surface across the width.
    this.grow(rng, W * 0.5, -10, 0, 22 * scale, this.worldHeight, 0, 0, true);
    const seeds = W < 720 ? 7 : 11;
    for (let i = 0; i < seeds; i++) {
      const u = (i + 0.5) / seeds;
      const x = W * (0.06 + u * 0.88) + (rng() - 0.5) * W * 0.05;
      const lean = (x - W / 2) / W;
      const angle = lean * 0.9 + (rng() - 0.5) * 0.5;
      const w = (8 + rng() * 9) * scale * (1 - Math.abs(lean) * 0.6);
      // Most main roots travel all the way down and converge on the core; a few wander off.
      const seeks = rng() < 0.7;
      const length = seeks ? this.worldHeight * 1.2 : this.viewHeight * (1.4 + rng() * 1.6);
      this.grow(rng, x, -10, angle, w, length, 1, rng() * 0.05, seeks);
    }
  }

  private grow(
    rng: () => number,
    x: number,
    y: number,
    angle: number,
    width: number,
    length: number,
    depth: number,
    stamp: number,
    seeksCore: boolean
  ): void {
    if (this.roots.length >= this.budget || width < 0.45) return;
    const step = 7;
    const n = Math.max(4, Math.round(length / step));
    const pts: RootPoint[] = [];
    const wobbleFreq = 0.035 + rng() * 0.05;
    const wobblePhase = rng() * TAU;
    const wobbleAmp = 0.05 + rng() * 0.07;
    const gravity = depth === 0 ? 0.03 : 0.012 + rng() * 0.012;
    // Each root grows at its own pace so the growing tips never line up in a row.
    // Capped so no root falls far enough behind to drop off the top while the camera descends.
    const pace = depth === 0 ? 1 : 0.8 + rng() * 0.35;
    const W = this.width;
    let a = angle;
    let px = x;
    let py = y;
    let b = stamp;
    const branches: Array<() => void> = [];

    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const w = width * (1 - t * 0.86) + 0.35;
      pts.push({ x: px, y: py, w, b });

      if (py > this.worldHeight + 40) break;
      const toCore = Math.hypot(this.core.x - px, this.core.y - py);
      if (seeksCore && toCore < 14) break;

      a += (rng() - 0.5) * 0.16 + Math.sin(i * wobbleFreq * TAU + wobblePhase) * wobbleAmp * 0.12;
      a -= a * gravity;
      if (px < W * 0.03) a += 0.07;
      if (px > W * 0.97) a -= 0.07;

      // Near the bottom, the main roots bend toward the core so everything converges on the logo.
      const pull = seeksCore ? 1 : depth <= 1 ? 0.5 : 0;
      if (pull > 0 && py > this.core.y - this.viewHeight * 1.5) {
        const desired = Math.atan2(this.core.x - px, this.core.y - py);
        const closeness = Math.min(1, (py - (this.core.y - this.viewHeight * 1.5)) / (this.viewHeight * 1.2));
        a += (desired - a) * 0.08 * pull * closeness;
      }

      const dx = Math.sin(a) * step;
      const dy = Math.cos(a) * step;
      px += dx;
      py += dy;
      b += (pace * (step * 0.45 + Math.max(0, dy) * 0.55)) / (this.worldHeight * 1.18);

      const canBranch = i > 3 && i < n - 4 && depth < 5;
      const branchChance = depth === 0 ? 0.055 : 0.03 + depth * 0.01;
      if (canBranch && rng() < branchChance && w > 1.3) {
        const dir = rng() < 0.5 ? -1 : 1;
        const childAngle = a + dir * (0.45 + rng() * 0.8);
        const childWidth = w * (0.5 + rng() * 0.16);
        const childLength = Math.max(40, (n - i) * step * (0.35 + rng() * 0.35));
        const bx = px;
        const by = py;
        const bb = b;
        branches.push(() => this.grow(rng, bx, by, childAngle, childWidth, childLength, depth + 1, bb, false));
      } else if (depth >= 2 && i > 2 && rng() < 0.07) {
        // Root hairs: short, thin, never branch.
        const hairAngle = a + (rng() < 0.5 ? -1 : 1) * (0.8 + rng() * 0.7);
        const bx = px;
        const by = py;
        const bb = b;
        branches.push(() => this.grow(rng, bx, by, hairAngle, 0.75, 10 + rng() * 22, 9, bb, false));
      }
    }

    let length2 = 0;
    for (let i = 1; i < pts.length; i++) length2 += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    this.roots.push({ pts, depth, length: length2 });
    this.pending.push(...branches);
  }

  private scatterPebbles(rng: () => number): void {
    const count = Math.round((this.width * this.worldHeight) / 26000);
    for (let i = 0; i < count; i++) {
      const big = rng() < 0.08;
      const r = big ? 6 + rng() * 10 : 1 + rng() * 3.2;
      this.pebbles.push({
        x: rng() * this.width,
        y: this.viewHeight * 0.35 + rng() * (this.worldHeight - this.viewHeight * 0.2),
        rx: r * (1 + rng() * 0.6),
        ry: r,
        rot: rng() * Math.PI,
        tone: rng(),
        parallax: 0.55 + rng() * 0.4
      });
    }
  }
}
