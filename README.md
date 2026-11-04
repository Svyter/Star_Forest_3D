# Star Forest — primeiro teste (Voxel 2.5D)

## 1. Instalar (uma vez, na pasta do projeto, com internet)
```
npm i react react-dom remotion @remotion/cli @remotion/three three @react-three/fiber
npm i -D typescript @types/react @types/react-dom @types/three
```
Isso grava no package.json versões compatíveis entre si.
Se aparecer erro de "peer dependency" entre @react-three/fiber e React:
fiber 9.x combina com React 19; fiber 8.x combina com React 18.

## 2. Pré-visualizar
```
npm run start
```
Abre o Remotion Studio em http://localhost:3000 (composição "StarForest").

## 3. Conferir um quadro (ex.: quadro 150 = 5 s)
```
npm run frame
```
Salva em out/frame-150.png. Mude --frame em package.json para ver outros momentos.

## 4. Renderizar o vídeo
```
npm run render
```
Vídeo final: out/starforest.mp4 (1920x1080, 30 fps, 300 quadros).

## Estrutura
src/index.ts · Root.tsx · StarForestComposition.tsx
src/data/       personagens, floresta, céu, paleta, timeline
src/animation/  câmera, luzes, animação do Vulto
src/components/ Scene.tsx (Three.js)

## Ajustes rápidos
- Cena escura/clara demais: constantes em src/animation/lighting.ts
- Prévia lenta: reduza o laço de árvores em src/data/forest.ts ou o SHADOW_MAP_SIZE
