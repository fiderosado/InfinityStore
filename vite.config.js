import {defineConfig} from 'vite';
import path from 'path'
export default defineConfig({
    test: {
        environment: 'jsdom', // Configura jsdom como entorno
        setupFiles: './vitest.setup.js', // Archivo de configuración adicional
    },
    resolve: {
        alias: {
            'infinitystore': path.resolve(__dirname, 'src/InfinityStore.js')
        }
    }
});
