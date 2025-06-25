/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2025, Martin Berner, kontenmanager@gmx.de. All rights reserved.
 */
import {type ObjectPlugin} from 'vue'
import {createVuetify} from 'vuetify'
import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/iconsets/mdi-svg'
import {
  mdiBasketPlus,
  mdiBasketMinus,
  mdiBasketFill,
  mdiGiftOutline,
  mdiHandshake,
  mdiFileCog,
  mdiCashPlus,
  mdiCashMinus,
  mdiChartTimelineVariant,
  mdiChartTimelineVariantShimmer,
  mdiCalculator,
  mdiCheck,
  mdiClose,
  mdiCog,
  mdiCopyright,
  mdiCurrencyEur,
  mdiDatabaseExport,
  mdiDatabaseImport,
  mdiDelete,
  mdiDomainPlus,
  mdiDomainRemove,
  mdiDomain,
  mdiDotsVertical,
  mdiEmail,
  mdiFileDocumentEdit,
  mdiFileDocumentMinus,
  mdiHelpCircle,
  mdiHome,
  mdiImage,
  mdiInfinity,
  mdiMagnify,
  mdiPlus,
  mdiReload,
  mdiShieldAccount,
  mdiTableRemove,
  mdiTableEdit,
  mdiTransfer
} from '@mdi/js'

interface IVuetify {
  vuetify: ObjectPlugin<[]>
}

export default<IVuetify> {
  vuetify: createVuetify({
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
        tableRemove: mdiTableRemove,
        tableEdit: mdiTableEdit,
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
}

console.log('--- PLUGINS vuetify.js ---')
