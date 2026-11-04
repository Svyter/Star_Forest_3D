import { Box, box, Vec3 } from './types';
import { FOREST_COLORS as F } from './palette';
import { mulberry32 } from './rng';

/** Posições fixas dos personagens no mundo. */
export const HERO_POS: Vec3 = [-5, 0, 0];
export const VULTO_BASE_POS: Vec3 = [5, 3.5, -46];

const pick = <T,>(rand: () => number, list: T[]): T =>
  list[Math.floor(rand() * list.length) % list.length];

/** Chão em blocos: grade de lajotas 3x3 com leve variação de altura e de tom. */
export function buildGround(): Box[] {
  const rand = mulberry32(101);
  const out: Box[] = [];
  const TILE = 3;
  for (let x = -75; x < 75; x += TILE) {
    for (let z = -126; z < 45; z += TILE) {
      const top = (rand() - 0.5) * 0.3;
      out.push(box(x + TILE / 2, top - 0.5, z + TILE / 2, TILE, 1.0, TILE, pick(rand, F.ground)));
    }
  }
  return out;
}

function farFrom(x: number, z: number, others: [number, number, number][]): boolean {
  return others.every(([ox, oz, r]) => Math.hypot(x - ox, z - oz) > r);
}

/** Árvores em blocos: tronco + copa em camadas (pinheiros geométricos). */
export function buildTrees(): Box[] {
  const rand = mulberry32(202);
  const out: Box[] = [];
  // Zonas que devem ficar livres para os personagens aparecerem com clareza.
  const keepClear: [number, number, number][] = [
    [HERO_POS[0], HERO_POS[2], 9],
    [VULTO_BASE_POS[0], VULTO_BASE_POS[2], 8],
  ];

  const trees: { x: number; z: number }[] = [];
  for (let z = 34; z > -112; z -= 5.2) {
    for (const side of [-1, 1]) {
      // Corredor central livre perto da câmera; mais denso ao fundo.
      const corridor = z > -34 ? 10 : 4;
      const x = side * (corridor + rand() * 48) + (rand() - 0.5) * 3;
      const zz = z + (rand() - 0.5) * 4;

      if (farFrom(x, zz, keepClear)) trees.push({ x, z: zz });
    }
  }
  // Algumas árvores ao redor do Vulto para ele aparecer "entre as árvores".
  for (const [x, z] of [
    [-3.5, -52],
    [13.5, -45],
    [-1, -60],
    [15, -58],
    [-9, -42],
    [9.5, -62],
  ]) {
    if (farFrom(x, z, keepClear)) trees.push({ x, z });
  }

  for (const t of trees) {
    const trunkH = 6 + rand() * 4;
    const w0 = 9 + Math.round(rand() * 4);
    out.push(box(t.x, trunkH / 2, t.z, 2, trunkH, 2, pick(rand, F.trunk)));
    const widths = [w0, w0 * 0.78, w0 * 0.56, w0 * 0.34];
    const canopyColor = pick(rand, F.canopy);
    widths.forEach((w, k) => {
      const baseY = trunkH - 1.5 + k * 3.0;
      const shade = k % 2 === 0 ? canopyColor : pick(rand, F.canopy);
      out.push(box(t.x, baseY + 1.6, t.z, w, 3.2, w, shade));
    });
    out.push(box(t.x, trunkH - 1.5 + 4 * 3.0 + 0.8, t.z, 1.4, 1.6, 1.4, canopyColor));
  }
  return out;
}

/** Vegetação simples: arbustos de blocos e tufos de grama. */
export function buildVegetation(): Box[] {
  const rand = mulberry32(303);
  const out: Box[] = [];
  const keepClear: [number, number, number][] = [
    [HERO_POS[0], HERO_POS[2], 3.5],
    [VULTO_BASE_POS[0], VULTO_BASE_POS[2], 5],
  ];

  for (let i = 0; i < 90; i++) {
    const x = (rand() - 0.5) * 100;
    const z = 30 - rand() * 100;

    if (!farFrom(x, z, keepClear)) continue;

    // 50% arbusto, 50% tufo de grama
    if (rand() < 0.5) {
      // Arbusto: bloco baixo e largo, 1 a 2 blocos empilhados
      const s = 1.2 + rand() * 1.2;
      const h = 0.8 + rand() * 0.8;
      out.push(box(x, h / 2, z, s, h, s, pick(rand, F.bush)));
      if (rand() < 0.4) {
        out.push(
          box(x + (rand() - 0.5) * 0.8, h + 0.3, z + (rand() - 0.5) * 0.8, s * 0.7, 0.6, s * 0.7, pick(rand, F.bush)),
        );
      }
    } else {
      // Tufo de grama: 2 a 3 hastes finas e altas
      const blades = 2 + Math.floor(rand() * 2);
      for (let k = 0; k < blades; k++) {
        const ox = (rand() - 0.5) * 1.2;
        const oz = (rand() - 0.5) * 1.2;
        const gh = 0.8 + rand() * 1.2;
        out.push(box(x + ox, gh / 2, z + oz, 0.35, gh, 0.35, pick(rand, F.grass)));
      }
    }
  }
  return out;
}
