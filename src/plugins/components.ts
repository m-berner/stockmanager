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

export default <ObjectPlugin<[]>>{
  install: (app) => {
    app.component('StocksTable', StocksTable)
    app.component('TransfersTable', TransfersTable)
    app.component('HelpContent', HelpContent)
    app.component('PrivacyContent', PrivacyContent)
  }
}

console.log('--- PLUGINS components.js ---')
