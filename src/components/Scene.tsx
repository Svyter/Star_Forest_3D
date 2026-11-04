import React, { useLayoutEffect, useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCurrentFrame } from 'remotion';
import { frameToSeconds } from '../data/timeline';
import { cameraAt } from '../animation/camera';
import { vultoFloat, eyeGlow } from '../animation/vultoAnimation';
import {
  MOON_DIR,
  MOON_COLOR,
  MOON_INTENSITY,
  AMBIENT_SKY,
  AMBIENT_GROUND,
  AMBIENT_INTENSITY,
  FOG_DENSITY,
  MIST_LAYER_HEIGHTS,
  MIST_LAYER_OPACITY,
  MIST_COLOR,
  VULTO_LIGHT_COLOR,
  VULTO_LIGHT_INTENSITY,
  VULTO_LIGHT_RANGE,
  VULTO_LIGHT_OFFSET,
  SHADOW_MAP_SIZE,
  SHADOW_EXTENT,
  SHADOW_BIAS,
  SHADOW_NORMAL_BIAS,
  SHADOW_RADIUS,
} from '../animation/lighting';
import { FOG_COLOR } from '../data/palette';
import { buildHero } from '../data/hero';
import { buildVulto, VULTO_EYE_POSITIONS } from '../data/vulto';
import { buildGround, buildTrees, buildVegetation, HERO_POS, VULTO_BASE_POS } from '../data/forest';
import { buildStars, SKY_COLORS } from '../data/sky';
import { Box, Vec3 } from '../data/types';

/**
 * Renderiza um Box voxel como um mesh de Three.js.
 * Posição = centro, tamanho = largura total.
 * - Olhos do Vulto e estrelas ignoram a névoa (são fontes de luz própria).
 * - Estrelas não projetam nem recebem sombra.
 */
const Voxel = ({
  b,
  eyeGlowValue,
  isStar = false,
}: {
  b: Box;
  eyeGlowValue?: number;
  isStar?: boolean;
}) => {
  const isEye = b.emissive !== undefined && b.emissive >= 3.0;
  // Olhos do Vulto: intensidade animada por eyeGlow()
  const emissiveIntensity = isEye ? b.emissive! * (eyeGlowValue ?? 1) : b.emissive ?? 0;
  const ignoreFog = isEye || isStar;

  return (
    <mesh position={b.p} castShadow={!isStar} receiveShadow={!isStar}>
      <boxGeometry args={b.s} />
      <meshStandardMaterial
        color={new THREE.Color(b.c)}
        emissive={new THREE.Color(b.c)}
        emissiveIntensity={emissiveIntensity}
        roughness={0.9}
        metalness={0}
        fog={!ignoreFog}
      />
    </mesh>
  );
};

/**
 * Controla a câmera padrão do ThreeCanvas a cada quadro.
 * (Um <perspectiveCamera> filho NÃO substitui a câmera ativa do canvas.)
 */
const CameraRig = ({ pos, target, fov }: { pos: Vec3; target: Vec3; fov: number }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useLayoutEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.fov = fov;
    camera.near = 0.1;
    camera.far = 600; // folga para a cúpula do céu
    camera.lookAt(target[0], target[1], target[2]);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  });

  return null;
};

/** Cúpula do céu com gradiente (horizonte -> zênite), sem névoa e sem escrever profundidade. */
const SkyDome = () => {
  const geometry = useMemo(() => {
    const radius = 300;
    const geo = new THREE.SphereGeometry(radius, 32, 16);
    const horizon = new THREE.Color(SKY_COLORS.horizon);
    const zenith = new THREE.Color(SKY_COLORS.zenith);
    const pos = geo.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = Math.min(1, Math.max(0, pos.getY(i) / radius / 0.55));
      c.copy(horizon).lerp(zenith, Math.pow(t, 0.8));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} renderOrder={-1}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} fog={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

/** Neblina rente ao chão: poucas camadas planas translúcidas. */
const GroundMist = () => (
  <group>
    {MIST_LAYER_HEIGHTS.map((y, i) => (
      <mesh key={`mist-${i}`} position={[0, y, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[150, 171]} />
        <meshBasicMaterial
          color={MIST_COLOR}
          transparent
          opacity={MIST_LAYER_OPACITY}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    ))}
  </group>
);

/** Halos quadrados atrás dos olhos do Vulto (intensidade acompanha eyeGlow). */
const EyeHalos = ({ glow }: { glow: number }) => (
  <group>
    {VULTO_EYE_POSITIONS.map((p, i) => (
      <group key={`halo-${i}`} position={p}>
        {[
          { size: 1.8, opacity: 0.18 },
          { size: 3.0, opacity: 0.07 },
        ].map((h, k) => (
          <mesh key={k} renderOrder={5}>
            <planeGeometry args={[h.size, h.size]} />
            <meshBasicMaterial
              color={0xffe45a}
              transparent
              opacity={h.opacity * glow}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

const SceneContent = () => {
  const frame = useCurrentFrame();
  const seconds = frameToSeconds(frame);
  const cam = cameraAt(seconds);
  const floatY = vultoFloat(seconds);
  const glow = eyeGlow(seconds);

  const hero = useMemo(() => buildHero(), []);
  const vulto = useMemo(() => buildVulto(), []);
  const ground = useMemo(() => buildGround(), []);
  const trees = useMemo(() => buildTrees(), []);
  const vegetation = useMemo(() => buildVegetation(), []);
  const stars = useMemo(() => buildStars(), []);

  const vultoPos: Vec3 = [VULTO_BASE_POS[0], VULTO_BASE_POS[1] + floatY, VULTO_BASE_POS[2]];

  const vultoLightPos: Vec3 = [
    vultoPos[0] + VULTO_LIGHT_OFFSET[0],
    vultoPos[1] + VULTO_LIGHT_OFFSET[1],
    vultoPos[2] + VULTO_LIGHT_OFFSET[2],
  ];

  return (
    <>
      {/* Câmera cinematográfica */}
      <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />

      {/* Névoa (apenas exponencial: duas <fog> no mesmo "attach" se sobrescrevem) */}
      <fogExp2 attach="fog" args={[FOG_COLOR, FOG_DENSITY]} />

      {/* Céu em gradiente */}
      <SkyDome />

      {/* Luzes */}
      <hemisphereLight
        args={[new THREE.Color(AMBIENT_SKY), new THREE.Color(AMBIENT_GROUND), AMBIENT_INTENSITY]}
      />
      <directionalLight
        position={[MOON_DIR[0] * 100, MOON_DIR[1] * 100, MOON_DIR[2] * 100]}
        color={new THREE.Color(MOON_COLOR)}
        intensity={MOON_INTENSITY}
        castShadow
        shadow-mapSize={[SHADOW_MAP_SIZE, SHADOW_MAP_SIZE]}
        shadow-camera-left={-SHADOW_EXTENT}
        shadow-camera-right={SHADOW_EXTENT}
        shadow-camera-top={SHADOW_EXTENT}
        shadow-camera-bottom={-SHADOW_EXTENT}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-bias={SHADOW_BIAS}
        shadow-normalBias={SHADOW_NORMAL_BIAS}
        shadow-radius={SHADOW_RADIUS}
      />
      {/* Luz roxa do Vulto */}
      <pointLight
        position={vultoLightPos}
        color={new THREE.Color(VULTO_LIGHT_COLOR)}
        intensity={VULTO_LIGHT_INTENSITY * (0.4 + glow * 0.6)}
        distance={VULTO_LIGHT_RANGE}
        decay={1.5}
      />

      {/* Estrelas (sem névoa, sem sombra) */}
      <group>
        {stars.map((b, i) => (
          <Voxel key={`star-${i}`} b={b} isStar />
        ))}
      </group>

      {/* Chão + Floresta */}
      <group>
        {ground.map((b, i) => (
          <Voxel key={`g-${i}`} b={b} />
        ))}
        {trees.map((b, i) => (
          <Voxel key={`t-${i}`} b={b} />
        ))}
        {vegetation.map((b, i) => (
          <Voxel key={`v-${i}`} b={b} />
        ))}
      </group>

      {/* Neblina rente ao chão */}
      <GroundMist />

      {/* Herói - parado, em HERO_POS, de costas para a câmera (frente -Z) */}
      <group position={HERO_POS}>
        {hero.map((b, i) => (
          <Voxel key={`h-${i}`} b={b} />
        ))}
      </group>

      {/* Vulto - flutuando, frente +Z para a câmera */}
      <group position={vultoPos}>
        {vulto.map((b, i) => (
          <Voxel key={`vu-${i}`} b={b} eyeGlowValue={glow} />
        ))}
        <EyeHalos glow={glow} />
      </group>
    </>
  );
};

export const Scene = () => {
  return (
    <ThreeCanvas width={1920} height={1080} shadows style={{ background: '#040a1c' }}>
      <SceneContent />
    </ThreeCanvas>
  );
};
