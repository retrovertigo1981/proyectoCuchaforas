import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

const plugins: PluginOption[] = [react()]
if (process.env.ANALYZE === 'true') {
  plugins.push(visualizer({ open: true, filename: 'stats.html' }) as PluginOption)
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log'],
  },
})
