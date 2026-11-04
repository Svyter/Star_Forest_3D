import { Box, box } from './types';
import { HERO_COLORS as C } from './palette';

/**
 * Protagonista em coordenadas locais: origem no centro dos pés,
 * FRENTE voltada para -Z. A câmera da cena fica em +Z, então o público
 * vê as costas (lisas) do casaco. Altura total ≈ 12,7 unidades.
 */
export function buildHero(): Box[] {
  const b: Box[] = [];

  // Sapatos marrons simples
  for (const x of [-1.0, 1.0]) b.push(box(x, 0.45, -0.3, 1.8, 0.9, 2.6, C.shoes));

  // Calça azul de corte reto
  for (const x of [-1.0, 1.0]) b.push(box(x, 2.4, 0, 1.8, 3.0, 1.9, C.pants));

  // Casaco: fechado, sem capuz, até o quadril inferior, barra reta, costas lisas
  b.push(box(0, 5.8, 0, 4.4, 4.4, 2.6, C.jacket));

  // Mangas longas com punhos retos
  for (const x of [-2.95, 2.95]) {
    b.push(box(x, 6.05, 0, 1.5, 3.1, 1.8, C.jacket)); // manga
    b.push(box(x, 4.35, 0, 1.6, 0.3, 1.9, C.jacketDark)); // punho reto
    b.push(box(x, 3.8, 0, 1.3, 0.8, 1.3, C.skin)); // mão geométrica, sem dedos
  }

  // Gola simples (sem pescoço visível: a cabeça assenta direto sobre a gola)
  b.push(box(0, 8.0, 0, 4.0, 0.6, 2.8, C.collar));

  // Dois bolsos quadrados na frente (-Z)
  for (const x of [-1.2, 1.2]) b.push(box(x, 4.9, -1.36, 1.1, 1.1, 0.12, C.jacketDark));

  // Cabeça grande e cúbica
  b.push(box(0, 10.3, 0, 4.2, 4.2, 4.2, C.skin));

  // Cabelo castanho, curto e organizado, com franja reta
  b.push(box(0, 12.35, 0, 4.5, 0.7, 4.5, C.hair)); // topo
  b.push(box(0, 11.0, 1.1, 4.5, 3.0, 2.2, C.hair)); // nuca e parte de trás
  for (const x of [-2.2, 2.2]) b.push(box(x, 11.6, 0.3, 0.3, 1.6, 3.6, C.hair)); // laterais curtas
  b.push(box(0, 11.75, -2.2, 4.5, 1.1, 0.4, C.hair)); // franja reta

  // Olhos pequenos, quadrados e pretos (sem orelhas)
  for (const x of [-1.0, 1.0]) b.push(box(x, 10.0, -2.13, 0.6, 0.6, 0.1, C.eyes));

  // Colar: corrente fina prateada em V + pingente quadrado centralizado no peito
  const chainSegments = 5;
  for (const side of [-1, 1]) {
    for (let i = 0; i < chainSegments; i++) {
      const u = i / (chainSegments - 1);
      const x = side * 1.4 * (1 - u);
      const y = 7.75 - 1.2 * u;
      b.push(box(x, y, -1.43, 0.22, 0.22, 0.1, C.chain));
    }
  }
  // Pingente branco, estado inativo: sem brilho (emissive 0) e sem partículas
  b.push(box(0, 6.2, -1.4, 0.7, 0.7, 0.14, C.pendantInactive, 0));

  return b;
}

export const HERO_HEIGHT = 12.7;
