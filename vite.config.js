import {defineConfig} from 'vite'
import {fileURLToPath, URL} from 'url'
import {dirname, resolve} from 'path'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import {viteStaticCopy} from 'vite-plugin-static-copy'
import zipPack from 'vite-plugin-zip-pack'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
    VueI18nPlugin({
      runtimeOnly: false,
      compositionOnly: true,
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**')
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
          overwrite: true
        },
        {
          src: '../stockmanager@gmx.de',
          dest: 'C:/Users/Martin/AppData/Roaming/Mozilla/Firefox/Profiles/developer.mb/extensions',
          overwrite: true
        }
      ]
    }),
    zipPack({
      inDir: './stockmanager@gmx.de',
      outDir: 'C:/Users/Martin/Projekte/Privat/stockmanager/releases/firefox',
      outFileName: 'stockmanager@gmx.de.xpi'
    })
  ],
  root: './src',
  base: './',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ]
  },
  build: {
    minify: false,
    cssMinify: false,
    target: ['es2022', 'firefox131'],
    assetsDir: 'assets',
    assetsInlineLimit: 0,
    emptyOutDir: true,
    outDir: '../stockmanager@gmx.de',
    modulePreload: false,
    rollupOptions: {
      input: {
        background: 'src/background.html',
        app: 'src/app.html'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
