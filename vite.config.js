import { defineConfig } from 'vite'

export default defineConfig({
  // 相対パスにすることで、任意のリポジトリ名の GitHub Pages で動作します。
  base: './',
  test: {
    environment: 'node',
  },
})
