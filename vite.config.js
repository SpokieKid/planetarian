import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  // define: {
  //   'process.env': {},
  //   'global.Buffer': 'Buffer'
  // },
  // resolve: {
  //   alias: {
  //     buffer: 'buffer/'
  //   }
  // }
  plugins: [react(), nodePolyfills(), sentryVitePlugin({
    org: "planetarian",
    project: "javascript-react"
  })],

  build: {
    sourcemap: true
  }
})