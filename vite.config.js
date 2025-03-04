
import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default ({ mode }) => {
  console.log('🚀 Building the app in mode: ', mode)
  const outDir = 'build';
  const publicDir = 'public';

  const appEnv = loadEnv(mode, process.cwd(), ['APP_', 'NODE_', 'LNG_', 'VITE_']);

  const plugins = [
    legacy({
      targets: ['chrome >= 68'],
      modernPolyfills: [
        'es/global-this',
        'es/promise/all-settled',
        'es/array/flat',
        'es/array/flat-map',
        'es/object/entries',
        'es/object/from-entries',
        'es/string/replace-all',
      ],
      renderLegacyChunks: false,
    }),
  ];
  const isProduction = mode === 'production';
  return defineConfig({
    base: '/',
    publicDir,
    plugins,
    server: {
      host: true,
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir,
      target: 'chrome68',
      emptyOutDir: true,
      // sourcemap: !isProduction,
      // minify: isProduction,
      minify: false,
      sourcemap: false,
    },
    esbuild: {
      // keepNames: true,
      // drop: isProduction ? ['console'] : [],
    },
    define: {
      'process.env': JSON.stringify(appEnv),
    },
  });
};
