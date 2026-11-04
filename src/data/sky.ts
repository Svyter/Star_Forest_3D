import { Box, box } from './types';
import { mulberry32 } from './rng';
import { SKY_ZENITH, SKY_HORIZON } from './palette';

/**
 * Céu noturno + estrelas. Estrelas são blocos pequenos com emissive alto,
 * distribuídas de forma determinística para não piscarem entre frames.
 * Ficam bem longe, atrás de tudo, para dar profundidade.
 */
export function buildStars(): Box[] {
  const rand = mulberry32(404);
  const out: Box[] = [];
  for (let i = 0; i < 220; i++) {
    const x = (rand() - 0.5) * 320;
    const y = 28 + rand() * 90; // só na parte de cima
    const z = -140 + rand() * 80; // bem ao fundo
    const s = 0.5 + rand() * 1.1;
    // Variação de brilho: algumas mais fracas, algumas mais fortes
    const glow = 0.8 + rand() * 2.2;
    // 90% brancas, 10% azuladas
    const color = rand() < 0.9 ? 0xffffff : 0xbfd8ff;
    out.push(box(x, y, z, s, s, s, color, glow));
  }
  return out;
}

export const SKY_COLORS = {
  zenith: SKY_ZENITH, // 0x040a1c
  horizon: SKY_HORIZON, // 0x0d3040
};
