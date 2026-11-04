import { Box, box } from './types';
import { VULTO_COLORS as C } from './palette';

/**
 * Vulto em coordenadas locais: origem no centro da base, FRENTE (olhos)
 * voltada para +Z, ou seja, para a câmera. Fantasma roxo, blocos grandes,
 * poucos detalhes. Altura ≈ 8,4.
 */
export function buildVulto(): Box[] {
  const b: Box[] = [];
  const SELF_GLOW = 0.3; // o corpo tem um pouco de luz própria para ler bem no escuro

  b.push(box(0, 7.8, 0, 2.4, 1.2, 2.4, C.top, SELF_GLOW)); // topo
  b.push(box(0, 6.3, 0, 4.0, 1.8, 3.2, C.top, SELF_GLOW)); // cabeça
  b.push(box(0, 3.9, 0, 5.0, 3.0, 3.6, C.body, SELF_GLOW)); // corpo
  b.push(box(0, 1.7, 0, 5.0, 1.4, 3.6, C.shade, SELF_GLOW)); // parte baixa

  // Barra irregular (silhueta fantasmagórica)
  const bottoms = [0.2, 0.9, 0.0, 0.9, 0.2];
  [-2, -1, 0, 1, 2].forEach((x, i) => {
    const top = 1.0;
    const h = top - bottoms[i];
    b.push(box(x, bottoms[i] + h / 2, 0, 1.0, h, 3.2, C.shade, SELF_GLOW));
  });

  // Olhos amarelos que brilham no escuro (emissive alto)
  for (const x of [-1.1, 1.1]) b.push(box(x, 6.3, 1.65, 0.9, 1.0, 0.15, C.eyes, 3.0));

  return b;
}

export const VULTO_HEIGHT = 8.4;
/** Posição dos olhos em coordenadas locais, usada para halos de brilho e para a luz do Vulto. */
export const VULTO_EYE_POSITIONS: [number, number, number][] = [
  [-1.1, 6.3, 1.75],
  [1.1, 6.3, 1.75],
];
