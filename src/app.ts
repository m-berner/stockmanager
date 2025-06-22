/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {createApp} from 'vue'
import AppIndex from '@/AppIndex.vue'
import vuetifyPlugin from '@/plugins/vuetify'
import i18nPlugin from '@/plugins/i18n'
import componentsPlugin from '@/plugins/components'
import routerPlugin from '@/plugins/router'
import piniaPlugin from '@/plugins/pinia'

const app = createApp(AppIndex)
app.config.errorHandler = (err: ErrorEvent) => {
  console.error(err)
}
app.config.warnHandler = (msg: string) => {
  console.warn(msg)
}
// NOTE: register dynamic components globally
app.use(componentsPlugin)
app.use(vuetifyPlugin.vuetify)
app.use(i18nPlugin.i18n)
app.use(piniaPlugin.pinia)
app.use(routerPlugin.router)
app.mount('#app')

console.log('--- PAGE_SCRIPT app.js ---', {info: window.location.href})
