/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import HelpCards from '@/components/HelpCards.vue'
import PrivacyStatement from '@/components/PrivacyStatement.vue'
import StocksTable from '@/components/StocksTable.vue'
import TransfersTable from '@/components/TransfersTable.vue'
import HomePage from '@/views/HomePage.vue'
import OptionsPage from '@/views/OptionsPage.vue'
import AppRouter from '@/App.vue'
import {createPinia} from 'pinia'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createApp} from 'vue'
import {createI18n} from 'vue-i18n'
import {createVuetify} from 'vuetify'
import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg'
import {
  mdiImage,
  mdiHome,
  mdiCurrencyEur,
  mdiReload,
  mdiDomainPlus,
  mdiDomainRemove,
  mdiDomain,
  mdiCashPlus,
  mdiCashMinus,
  mdiChartTimelineVariant,
  mdiChartTimelineVariantShimmer,
  mdiDatabaseExport,
  mdiDatabaseImport,
  mdiTransfer,
  mdiCalculator,
  mdiCog,
  mdiCopyright,
  mdiBasketPlus,
  mdiBasketMinus,
  mdiBasketFill,
  mdiGiftOutline,
  mdiInfinity,
  mdiClose,
  mdiDelete,
  mdiPlus,
  mdiCheck,
  mdiDotsVertical,
  mdiTableLargeRemove,
  mdiFileDocumentMinus,
  mdiFileDocumentEdit,
  mdiHelpCircle,
  mdiShieldAccount,
  mdiHandshake,
  mdiFileCog,
  mdiEmail,
  mdiMagnify
} from '@mdi/js'
import messages from '@intlify/unplugin-vue-i18n/messages'
import {useApp} from '@/useApp'

const {getUI} = useApp()
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: HomePage,
      name: 'home'
    },
    {
      path: '/options',
      component: OptionsPage,
      name: 'options'
    }
  ]
})
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'ocean',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#e0e0e0',
          primary: '#eeeeee',
          surface: '#eeeeee',
          secondary: '#e0e0e0',
          warning: 'orange',
          error: 'orange',
          info: 'yellow',
          success: 'green'
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#e0e0e0',
          primary: '#23222B',
          surface: '#23222B',
          secondary: '#e0e0e0',
          warning: 'orange',
          error: 'orange',
          info: 'yellow',
          success: 'green'
        }
      },
      sky: {
        dark: false,
        colors: {
          background: '#e0e0e0',
          primary: '#3282f6',
          surface: '#3282f6',
          secondary: '#e0e0e0',
          warning: 'orange',
          error: 'orange',
          info: 'yellow',
          success: 'green'
        }
      },
      ocean: {
        dark: false,
        colors: {
          background: '#e0e0e0',
          primary: '#194f7d',
          surface: '#194f7d',
          secondary: '#e0e0e0',
          warning: 'orange',
          error: 'orange',
          info: 'yellow',
          success: 'green'
        }
      },
      earth: {
        dark: false,
        colors: {
          background: '#e0e0e0',
          primary: '#780e12',
          surface: '#780e12',
          secondary: '#e0e0e0',
          warning: 'orange',
          error: 'orange',
          info: 'yellow',
          success: 'green'
        }
      },
      meadow: {
        dark: false,
        colors: {
          background: '#e0e0e0',
          primary: '#378222',
          surface: '#378D22',
          secondary: '#e0e0e0',
          topbar: '#37bb22',
          warning: 'orange',
          error: 'orange',
          info: 'yellow',
          success: 'green'
        }
      }
    }
  },
  icons: {
    sets: {
      mdi
    },
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      sm: mdiImage,
      home: mdiHome,
      euro: mdiCurrencyEur,
      reload: mdiReload,
      addStock: mdiDomainPlus,
      deleteStock: mdiDomainRemove,
      fadeinStock: mdiDomain,
      cashPlus: mdiCashPlus,
      cashMinus: mdiCashMinus,
      dailyChanges: mdiChartTimelineVariant,
      dailyChangesAll: mdiChartTimelineVariantShimmer,
      exportDatabase: mdiDatabaseExport,
      importDatabase: mdiDatabaseImport,
      transfersTable: mdiTransfer,
      showAccounting: mdiCalculator,
      settings: mdiCog,
      copyright: mdiCopyright,
      buyStock: mdiBasketPlus,
      sellStock: mdiBasketMinus,
      addDividend: mdiBasketFill,
      showDividend: mdiGiftOutline,
      configs: mdiFileCog,
      link: mdiInfinity,
      close: mdiClose,
      add: mdiPlus,
      remove: mdiDelete,
      check: mdiCheck,
      dots: mdiDotsVertical,
      tableRemove: mdiTableLargeRemove,
      removeDocument: mdiFileDocumentMinus,
      editDocument: mdiFileDocumentEdit,
      help: mdiHelpCircle,
      privacy: mdiShieldAccount,
      partner: mdiHandshake,
      mail: mdiEmail,
      magnify: mdiMagnify
    }
  }
})
const i18n = createI18n({
  locale: getUI().locale,
  fallbackLocale: 'en-US',
  legacy: false,
  globalInjection: true,
  messages,
  datetimeFormats: {
    'de-DE': {
      numeric: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      },
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      },
      long: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    'en-US': {
      numeric: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  },
  numberFormats: {
    'de-DE': {
      currency5: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
        notation: 'standard'
      },
      currency3: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
        notation: 'standard'
      },
      currency: {
        style: 'currency',
        currency: 'EUR',
        notation: 'standard'
      },
      currencyUSD: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      decimal3: {
        style: 'decimal',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      },
      integer: {
        style: 'decimal',
        maximumFractionDigits: 0
      },
      year: {
        style: 'decimal',
        maximumFractionDigits: 0,
        useGrouping: false
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
        useGrouping: false
      }
    },
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    }
  }
})
const pinia = createPinia()
const app = createApp(AppRouter)

app.config.errorHandler = (err: ErrorEvent) => {
  console.error(err)
}
app.config.warnHandler = (msg: string) => {
  console.warn(msg)
}
app.use(router)
app.use(vuetify)
app.use(i18n)
app.use(pinia)
app.component('StocksTable', StocksTable)
app.component('TransfersTable', TransfersTable)
app.component('PrivacyStatement', PrivacyStatement)
app.component('HelpCards', HelpCards)
app.mount('#app')

console.log('--- app.js ---')
