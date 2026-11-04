import { smoothstep } from '../data/timeline';

/** Flutuação vertical suave do Vulto (único elemento animado além da câmera). */
export const VULTO_FLOAT_AMPLITUDE = 0.9;
export const VULTO_FLOAT_PERIOD = 3.2; // segundos

export function vultoFloat(seconds: number): number {
  return VULTO_FLOAT_AMPLITUDE * Math.sin((2 * Math.PI * seconds) / VULTO_FLOAT_PERIOD);
}

/** Intensidade do brilho dos olhos (0..1): acendem entre 3,3 s e 4,6 s, com pulsação leve. */
export function eyeGlow(seconds: number): number {
  const on = smoothstep(3.3, 4.6, seconds);
  return on * (0.92 + 0.08 * Math.sin(seconds * 2.4));
}
