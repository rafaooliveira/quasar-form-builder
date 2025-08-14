// builder/nuxt.config.ts
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  future: { compatibilityVersion: 4 },

  // <-- diga ao Nuxt que o código do builder está em builder/app
  srcDir: resolve(__dirname, 'app'),

  // <-- fixe os aliases para dentro de builder/app
  alias: {
    '~': resolve(__dirname, 'app'),
    '@': resolve(__dirname, 'app'),
  },

  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt',
    '@formkit/nuxt',
  ],

  // se quiser auto-importar stores dentro de builder/app/stores
  imports: {
    dirs: ['stores'],
  },

  quasar: {
    plugins: [
      'BottomSheet','Dialog','Loading','LoadingBar','Notify',
      'Dark','LocalStorage','Platform',
    ],
    lang: 'pt-BR',
    iconSet: 'material-icons',
    extras: { animations: 'all', fontIcons: ['material-icons', 'material-icons-outlined', 'material-symbols-outlined'] },
    config: { brand: { primary: '#FFA726' } },
    sassVariables: true,
  },
})
