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
import DailyChanges from '@/components/dialogs/DailyChanges.vue'
import FadeinStock from '@/components/dialogs/FadeinStock.vue'
import AddDeposit from '@/components/dialogs/AddDeposit.vue'
import AddWithdrawal from '@/components/dialogs/AddWithdrawal.vue'
import BuyStock from '@/components/dialogs/BuyStock.vue'
import SellStock from '@/components/dialogs/SellStock.vue'
import ShowDividend from '@/components/dialogs/ShowDividend.vue'
import AddDividend from '@/components/dialogs/AddDividend.vue'
import ConfigCompany from '@/components/dialogs/ConfigCompany.vue'
import DeleteTransfer from '@/components/dialogs/DeleteTransfer.vue'
import UpdateTransfer from '@/components/dialogs/UpdateTransfer.vue'

const {CONS} = useApp()

export default <ObjectPlugin<[]>>{
  install: (app) => {
    app.component('StocksTable', StocksTable)
    app.component('TransfersTable', TransfersTable)
    app.component('HelpContent', HelpContent)
    app.component('PrivacyContent', PrivacyContent)
    //
    app.component(CONS.DIALOGS.ADDCOMPANY, AddCompany)
    app.component(CONS.DIALOGS.FADEINSTOCK, FadeinStock)
    app.component(CONS.DIALOGS.EXPORTDB, ExportDatabase)
    app.component(CONS.DIALOGS.IMPORTDB, ImportDatabase)
    app.component(CONS.DIALOGS.SHOWACCOUNTING, ShowAccounting)
    app.component(CONS.DIALOGS.DAILYCHANGES, DailyChanges)
    app.component(CONS.DIALOGS.DAILYCHANGESALL, DailyChanges)
    app.component(CONS.DIALOGS.ADDDEPOSIT, AddDeposit)
    app.component(CONS.DIALOGS.ADDWITHDRAWAL, AddWithdrawal)
    //
    app.component(CONS.DIALOGS.DELETESTOCK, DeleteStock)
    app.component(CONS.DIALOGS.BUYSTOCK, BuyStock)
    app.component(CONS.DIALOGS.SELLSTOCK, SellStock)
    app.component(CONS.DIALOGS.ADDDIVIDEND, AddDividend)
    app.component(CONS.DIALOGS.SHOWDIVIDEND, ShowDividend)
    app.component(CONS.DIALOGS.CONFIGSTOCK, ConfigCompany)
    //
    app.component(CONS.DIALOGS.DELETETRANSFER, DeleteTransfer)
    app.component(CONS.DIALOGS.UPDATETRANSFER, UpdateTransfer)
  }
}

console.log('--- PLUGINS components.js ---')
