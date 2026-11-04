export type Vec3 = [number, number, number];

/**
 * Um bloco (voxel grande). Posição é o CENTRO do bloco, tamanho é a
 * largura total em cada eixo. Cor em hexadecimal sRGB (0xRRGGBB).
 * emissive > 0 faz o bloco emitir luz própria (multiplica a cor e
 * soma ao resultado da iluminação).
 */
export interface Box {
  p: Vec3;
  s: Vec3;
  c: number;
  emissive?: number;
}

export function box(
  cx: number,
  cy: number,
  cz: number,
  sx: number,
  sy: number,
  sz: number,
  c: number,
  emissive = 0,
): Box {
  return { p: [cx, cy, cz], s: [sx, sy, sz], c, emissive };
}
