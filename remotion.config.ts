import { Config } from '@remotion/cli/config';

// Necessário para renderizar Three.js (WebGL) corretamente no Chromium do Remotion.
Config.setChromiumOpenGlRenderer('angle');

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// A cena tem milhares de meshes + mapa de sombra 4096: dá folga ao carregamento de cada quadro.
Config.setDelayRenderTimeoutInMilliseconds(120000);
