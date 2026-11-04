// Linha do tempo da composição. Tudo é calculado a partir do número do quadro (determinístico).

export const FPS = 30;
export const DURATION_IN_FRAMES = 300; // 10 s
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const frameToSeconds = (frame: number): number => frame / FPS;

export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
