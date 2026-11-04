import { Vec3 } from '../data/types';

/**
 * Câmera cinematográfica de 10 s, por quadros-chave suavizados (Catmull-Rom).
 *
 * 0-3 s : plano aberto da floresta, olhando para a direita; leve aproximação.
 *         O protagonista (à esquerda) ainda está fora de quadro.
 * 3-6 s : a câmera gira para a esquerda e desce; o protagonista entra em
 *         primeiro plano, visto de costas, e o Vulto aparece ao fundo, entre as árvores.
 * 6-10 s: aproximação discreta, terminando com os dois personagens visíveis.
 */
interface Key {
  t: number;
  pos: Vec3;
  target: Vec3;
}

const KEYS: Key[] = [
  { t: 0, pos: [14, 16, 66], target: [60, 14, -20] },
  { t: 3, pos: [10, 13, 50], target: [31, 12, -24] },
  { t: 6, pos: [5, 10.5, 32], target: [4, 8, -24] },
  { t: 10, pos: [3, 10, 23], target: [0, 5, -24] },
];

export const CAMERA_FOV = 38; // graus (vertical)

const catmull = (p0: number, p1: number, p2: number, p3: number, u: number): number => {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
};

const sampleVec = (sel: (k: Key) => Vec3, seg: number, u: number): Vec3 => {
  const i0 = Math.max(0, seg - 1);
  const i1 = seg;
  const i2 = seg + 1;
  const i3 = Math.min(KEYS.length - 1, seg + 2);
  const a = sel(KEYS[i0]);
  const b = sel(KEYS[i1]);
  const c = sel(KEYS[i2]);
  const d = sel(KEYS[i3]);
  return [0, 1, 2].map((ax) => catmull(a[ax], b[ax], c[ax], d[ax], u)) as Vec3;
};

export function cameraAt(seconds: number): { pos: Vec3; target: Vec3; fov: number } {
  const t = Math.min(KEYS[KEYS.length - 1].t, Math.max(0, seconds));
  let seg = 0;
  while (seg < KEYS.length - 2 && t > KEYS[seg + 1].t) seg++;
  const span = KEYS[seg + 1].t - KEYS[seg].t;
  const u = (t - KEYS[seg].t) / span;
  return {
    pos: sampleVec((k) => k.pos, seg, u),
    target: sampleVec((k) => k.target, seg, u),
    fov: CAMERA_FOV,
  };
}
