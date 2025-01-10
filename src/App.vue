<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-app v-bind:flat="true">
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {onBeforeMount, ref, toRaw, watchEffect} from 'vue'
import {useTheme} from 'vuetify'
import {useApp} from '@/composables/useApp'
import {useRoute} from 'vue-router'
import {useRuntimeStore} from '@/stores/runtime'

const settings = useSettingsStore()
const records = useRecordsStore()
const runtime = useRuntimeStore()
const theme = useTheme()
const {appPort, CONS, getUI, notice} = useApp()
const layout = ref()
const route = useRoute()

watchEffect(
  () => {
    if (route.meta.layout === undefined) {
      layout.value = 'DefaultLayout'
    } else {
      layout.value = `${route.meta.layout}Layout`
    }
  }
)
onBeforeMount(async (): Promise<void> => {
    console.log('APP: onBeforeMount')
    const keyStrokeController: string[] = []
    const onStorageChange = async (change: Record<string, browser.storage.StorageChange>): Promise<void> => {
      console.info('APP: onStorageChange', change)
      switch (true) {
        case change.service?.oldValue !== undefined:
          settings.setServiceStoreOnly({
            name: change.service.newValue.name,
            url: change.service.newValue.url,
          })
          break
        case change.skin?.oldValue !== undefined:
          theme.global.name.value = change.skin.newValue
          break
        case change.indexes?.oldValue !== undefined:
          settings.setIndexesStoreOnly(change.indexes.newValue)
          break
        case change.materials?.oldValue !== undefined:
          settings.setMaterialsStoreOnly(change.materials.newValue)
          break
        case change.exchanges?.oldValue.length < change.exchanges?.newValue.length:
          settings.setExchangesStoreOnly(change.exchanges.newValue)
          appPort().postMessage({
            type: CONS.FETCH_API.ASK__EXCHANGES_DATA,
            data: change.exchanges.newValue,
          })
          break
        case change.exchanges?.oldValue.length > change.exchanges?.newValue.length:
          settings.setExchangesStoreOnly(change.exchanges.newValue)
          break
      }
    }
    const onBeforeOnload = async (): Promise<void> => {
      console.log('APP: onBeforeOnload')
      const foundTabs = await browser.tabs.query({url: 'about:addons'})
      if (foundTabs.length > 0) {
        await browser.tabs.remove(foundTabs[0].id ?? 0)
      }
      records.dbi.close()
    }
    const onKeyDown = (ev: KeyboardEvent): void => {
      keyStrokeController.push(ev.key)
      if (
        keyStrokeController.includes('Control') &&
        keyStrokeController.includes('Alt') &&
        ev.key === 't'
      ) {
        settings.setServiceStoreOnly({
          name: 'tgate',
          url: CONS.SERVICES.tgate.HOME,
        })
      }
      if (
        keyStrokeController.includes('Control') &&
        keyStrokeController.includes('Alt') &&
        ev.key === 'r'
      ) {
        browser.storage.local.clear()
      }
    }
    const onKeyUp = (ev: KeyboardEvent): void => {
      keyStrokeController.splice(keyStrokeController.indexOf(ev.key), 1)
    }
    const onMessageExchangesBase = (ev: MessageEvent): void => {
      console.info('APP: onMessageExchangesBase', ev)
      if (ev.data === undefined) {
        notice(['Sorry, no data arrived'])
      } else if (ev.type === CONS.FETCH_API.ANSWER__EXCHANGES_DATA) {
        for (let i = 0; i < ev.data.length; i++) {
          if (ev.data[i].key.includes('USD')) {
            runtime.setExchangesUsd(ev.data[i].value)
          } else {
            runtime.setExchangesEur(ev.data[i].value)
          }
        }
      }
    }
    if (!browser.storage.onChanged.hasListener(onStorageChange)) {
      // noinspection JSDeprecatedSymbols
      browser.storage.onChanged.addListener(onStorageChange)
    }
    if (!browser.runtime.onMessage.hasListener(onMessageExchangesBase)) {
      // noinspection JSDeprecatedSymbols
      browser.runtime.onMessage.addListener(onMessageExchangesBase)
    }
    /* Listen to onKeyup, onKeyDown:
     * - set the service to tgate if ctrl + alt + t is pressed.
     * - clear the local storage if ctrl + alt + r is pressed.
     */
    window.addEventListener('keydown', onKeyDown, false)
    window.addEventListener('keyup', onKeyUp, false)
    window.addEventListener('beforeunload', onBeforeOnload, false)
    appPort().postMessage({
      type: CONS.FETCH_API.ASK__EXCHANGES_BASE_DATA,
      data: [getUI().curusd, getUI().cureur],
    })
    await settings.loadStorageIntoStore(theme)
    await records.openDatabase()
    await records.loadDatabaseIntoStore()
    appPort().postMessage({
      type: CONS.FETCH_API.ASK__EXCHANGES_DATA,
      data: toRaw(settings.exchanges),
    })
    appPort().postMessage({
      type: CONS.FETCH_API.ASK__MATERIAL_DATA,
      data: [],
    })
    appPort().postMessage({
      type: CONS.FETCH_API.ASK__INDEX_DATA,
      data: [],
    })
  }
)

//const _appPort = appPort()
//_appPort.postMessage({ test: 'rtertete'})

// _appPort.onMessage.addListener((m) => {
//   console.log("In content script, received message from background script: ");
//   console.log(m);
// });

console.log('--- App.vue setup ---')
</script>
