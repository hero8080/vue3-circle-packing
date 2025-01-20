import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import { libInjectCss } from 'vite-plugin-lib-inject-css';
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    libInjectCss(),
  ],
  css: {
    modules: false, // 如果你不使用 CSS Modules，设置为 false
    preprocessorOptions: {} // 如果有预处理器，这里配置它们的选项
  },

  build:{
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Vue3CirclePacking",
      fileName: (format) => `vue3-circle-packing.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
