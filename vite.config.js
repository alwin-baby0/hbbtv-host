import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { dependencies } from './package.json';

function renderChunks(deps) {
  const chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['@lightningjs/sdk'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

export default ({ mode }) => {
  const outDir = 'build';
  const publicDir = 'public';
  const [buildMode, platform] = mode.split('-');
  console.log('🚀 Building the app in mode: ', buildMode, ' for platform: ', platform);
  const appEnv = loadEnv(platform, process.cwd(), ['APP_', 'NODE_', 'LNG_', 'VITE_']);

  // usefull thing, keep it
  // const plugins = [
  //   legacy({
  //     targets: ['chrome>=38'],
  //     modernPolyfills: [
  //       'es/global-this',
  //       'es/promise/all-settled',
  //       'es/array/flat',
  //       'es/array/flat-map',
  //       'es/object/entries',
  //       'es/object/from-entries',
  //       'es/string/replace-all',
  //     ],
  //     additionalLegacyPolyfills: ["whatwg-fetch"],
  //     renderLegacyChunks: false,
  //   }),
  // ];

  const plugins = [
    legacy({
      renderModernChunks: false,
      targets: ['Chrome >= 53', 'not dead'],
    }),
    // Replaces %APP_*% placeholders in index.html with values from the platform's .env file
    {
      name: 'html-app-env',
      transformIndexHtml: (html) =>
        html.replace(/%(APP_\w+)%/g, (match, key) => (key in appEnv ? appEnv[key] : match)),
    },
  ];

  return defineConfig({
    base: '',
    publicDir,
    plugins,
    server: {
      host: true,
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir,
      target: 'es2015',
      emptyOutDir: true,
      minify: false,
      sourcemap: platform !== 'web',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['@lightningjs/sdk'],
            ...renderChunks(dependencies),
          },
        },
      },
    },
    esbuild: {
      drop: platform === 'web' ? ['console'] : [],
    },
    define: {
      'process.env': JSON.stringify(appEnv),
    },
  });
};
