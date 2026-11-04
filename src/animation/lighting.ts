import { Vec3 } from '../data/types';

// Parâmetros de iluminação, névoa e sombras (usados pelo Three.js).
//
// NOTA: a partir do Three.js r155 as luzes seguem unidades físicas (sem o fator
// π do modo "legacy"). Por isso as intensidades abaixo estão compensadas.
// Se a cena ficar clara/escura demais, ajuste só estas constantes.

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}

/** Direção PARA a luz da lua (de cima, à esquerda e do lado da câmera, para iluminar as costas do herói). */
export const MOON_DIR: Vec3 = normalize([-0.45, 0.8, 0.55]);
export const MOON_COLOR = 0x9fb8ff;
export const MOON_INTENSITY = 1.15 * Math.PI;

export const AMBIENT_SKY = 0x1a2e4d; // luz ambiente vinda de cima (azul profundo)
export const AMBIENT_GROUND = 0x0b1a17; // luz refletida do chão (verde escuro)
export const AMBIENT_INTENSITY = 1.0 * Math.PI;

/** Névoa exponencial. Reduzida (era 0,0125) para o Vulto e o fundo não ficarem lavados. */
export const FOG_DENSITY = 0.009;

/** Neblina rente ao chão: camadas planas translúcidas (altura em Y). */
export const MIST_LAYER_HEIGHTS = [0.5, 1.3];
export const MIST_LAYER_OPACITY = 0.05;
export const MIST_COLOR = 0x1d4a5c;

/** Luz roxa do Vulto, relativa à posição dele. (Point light em unidades físicas: valor mais alto.) */
export const VULTO_LIGHT_OFFSET: Vec3 = [0, 4, 3];
export const VULTO_LIGHT_COLOR = 0x8a4dff;
export const VULTO_LIGHT_INTENSITY = 30;
export const VULTO_LIGHT_RANGE = 34;

/** Sombras da lua: o volume cobre o chão inteiro; mapa grande para blocos nítidos e borda suave. */
export const SHADOW_MAP_SIZE = 4096;
export const SHADOW_EXTENT = 90;
export const SHADOW_BIAS = -0.0005;
export const SHADOW_NORMAL_BIAS = 0.05;
export const SHADOW_RADIUS = 3;
