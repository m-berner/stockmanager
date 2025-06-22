/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2025, Martin Berner, kontenmanager@gmx.de. All rights reserved.
 */
import {type ObjectPlugin} from 'vue'
import StocksTable from '@/components/StocksTable.vue'
import TransfersTable from '@/components/TransfersTable.vue'
import HelpContent from '@/components/HelpContent.vue'
import PrivacyContent from '@/components/PrivacyContent.vue'
import ImportDatabase from '@/components/dialogs/ImportDatabase.vue'
import ShowAccounting from '@/components/dialogs/ShowAccounting.vue'
import {useApp} from '@/background'
import ExportDatabase from '@/components/dialogs/ExportDatabase.vue'
import AddCompany from '@/components/dialogs/AddCompany.vue'
import DeleteStock from '@/components/dialogs/DeleteStock.vue'

const {CONS} = useApp()

export default <ObjectPlugin<[]>>{
  install: (app) => {
    app.component('StocksTable', StocksTable)
    app.component('TransfersTable', TransfersTable)
    app.component('HelpContent', HelpContent)
    app.component('PrivacyContent', PrivacyContent)
    app.component(CONS.DIALOGS.ADDCOMPANY, AddCompany)
    app.component(CONS.DIALOGS.DELETESTOCK, DeleteStock)
    app.component(CONS.DIALOGS.EXPORTDB, ExportDatabase)
    app.component(CONS.DIALOGS.IMPORTDB, ImportDatabase)
    app.component(CONS.DIALOGS.SHOWACCOUNTING, ShowAccounting)
  }
}

console.log('--- PLUGINS components.js ---')
