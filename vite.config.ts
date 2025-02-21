import UnoCss from 'unocss/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import legacy from '@vitejs/plugin-legacy';
// import viteCompression from 'vite-plugin-compression';
// https://vitejs.dev/config/

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    UnoCss(),
    // {
    //   configFile: resolve(__dirname, 'uno.config.ts'), // 确保配置文件路径正确
    // }
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true, // <-- this
      },
    }),
    legacy({
      targets: ['defaults', 'not IE 11', 'chrome 61'],
    }),
    // viteCompression({
    //   threshold: 5120000, // 对大于 5mb 的文件进行压缩
    // }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // '/api': {
      //   target: 'http://39.100.39.50:5054',
      //   changeOrigin: false,
      // },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'parens-division',
        javascriptEnabled: true,
        additionalData: `@import "${resolve(__dirname, 'src/assets/less/variable.less')}";`,
      },
      scss: { api: 'modern-compiler' },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    target: ['chrome61'],
    cssTarget: ['chrome61'],
    minify: 'terser',
    modulePreload: {
      resolveDependencies(filename, deps) {
        return deps.filter((dep) => !dep.endsWith('.js'));
      },
    },
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       vue: ['vue'],
    //     },
    //     chunkFileNames: 'static/js/[name]-[hash].js',
    //     entryFileNames: 'static/js/[name]-[hash].js',
    //     assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
    //   },
    // },
  },
});
