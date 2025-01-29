import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import pkg from './package.json'

export default {
  input: 'src/InfinityStore.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  /*output: [
    {
      file: 'dist/InfinityStore.cjs.js',  // Ruta directa para CommonJS
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/InfinityStore.esm.js',  // Ruta directa para ES Modules
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],*/
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
  ],
  external: ['react'],
}
// Comandos relevantes:
// - Para instalar las dependencias: npm install
// - Para construir el proyecto: npm run build