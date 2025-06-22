<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-app v-bind:flat="true">
    <router-view name="title"></router-view>
    <router-view name="header"></router-view>
    <router-view name="info"></router-view>
    <v-main>
      <router-view></router-view>
    </v-main>
    <router-view name="footer"></router-view>
  </v-app>
</template>

<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {onBeforeMount, toRaw} from 'vue'
import {useTheme} from 'vuetify'
import {useApp} from '@/background'
import {useRuntimeStore} from '@/stores/runtime'

const settings = useSettingsStore()
const records = useRecordsStore()
const runtime = useRuntimeStore()
const theme = useTheme()
const {CONS, getUI} = useApp()

browser.runtime.onMessage.addListener((message) => {
  const msg = JSON.parse(message)
  switch (msg.type) {
    case CONS.MESSAGES.SET__SETTINGS_SKIN:
      theme.global.name.value = msg.data
      settings.setSkinStoreOnly(msg.data)
      break
    case CONS.MESSAGES.SET__SETTINGS_SERVICE:
      settings.setServiceStoreOnly(msg.data)
      break
    case CONS.MESSAGES.SET__SETTINGS_MARKETS:
      settings.setMarketsStoreOnly(msg.data)
      break
    case CONS.MESSAGES.SET__SETTINGS_INDEXES:
      settings.setIndexesStoreOnly(msg.data)
      break
    case CONS.MESSAGES.SET__SETTINGS_MATERIALS:
      settings.setMaterialsStoreOnly(msg.data)
      break
    case CONS.MESSAGES.SET__SETTINGS_EXCHANGES:
      settings.setExchangesStoreOnly(msg.data)
      break
    default:
      console.error('Set settings message not found')
  }
})

onBeforeMount(async (): Promise<void> => {
  console.log('APP: onBeforeMount')
  const keyStrokeController: string[] = []
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
  /* Listen to onKeyup, onKeyDown:
   * - set the service to tgate if ctrl + alt + t is pressed.
   * - clear the local storage if ctrl + alt + r is pressed.
   */
  window.addEventListener('keydown', onKeyDown, false)
  window.addEventListener('keyup', onKeyUp, false)
  window.addEventListener('beforeunload', onBeforeOnload, false)

  const exchangesBaseDataResponseString = await browser.runtime.sendMessage(JSON.stringify({
    type: CONS.FETCH_API.ASK__EXCHANGES_BASE_DATA,
    data: [getUI().curusd, getUI().cureur],
  }))
  const exchangesBaseDataResponse = JSON.parse(exchangesBaseDataResponseString)
  for (let i = 0; i < exchangesBaseDataResponse.data.length; i++) {
    if (exchangesBaseDataResponse.data[i].key.includes('USD')) {
      runtime.setExchangesUsd(exchangesBaseDataResponse.data[i].value)
    } else {
      runtime.setExchangesEur(exchangesBaseDataResponse.data[i].value)
    }
  }
  await settings.loadStorageIntoStore(theme)
  await records.openDatabase()
  await records.loadDatabaseIntoStore()
  const exchangesDataResponseString = await browser.runtime.sendMessage(JSON.stringify({
    type: CONS.FETCH_API.ASK__EXCHANGES_DATA,
    data: toRaw(settings.exchanges),
  }))
  const materialsDataResponseString = await browser.runtime.sendMessage(JSON.stringify({
    type: CONS.FETCH_API.ASK__MATERIAL_DATA,
    data: [],
  }))
  const indexesDataResponseString = await browser.runtime.sendMessage(JSON.stringify({
    type: CONS.FETCH_API.ASK__INDEX_DATA,
    data: [],
  }))
  const exchanges = new Map<string, number>()
  const materials = new Map<string, number>()
  const indexes = new Map<string, number>()

  const exchangesDataResponse = JSON.parse(exchangesDataResponseString)
  for (let i = 0; i < exchangesDataResponse.data.length; i++) {
    exchanges.set(exchangesDataResponse.data[i].key, exchangesDataResponse.data[i].value)
  }
  runtime.setExchanges(exchanges)

  const materialsDataResponse = JSON.parse(materialsDataResponseString)
  for (let i = 0; i < materialsDataResponse.data.length; i++) {
    materials.set(materialsDataResponse.data[i].key, materialsDataResponse.data[i].value)
  }
  runtime.setMaterials(materials)

  const indexesDataResponse = JSON.parse(indexesDataResponseString)
  for (let i = 0; i < indexesDataResponse.data.length; i++) {
    indexes.set(indexesDataResponse.data[i].key, indexesDataResponse.data[i].value)
  }
  runtime.setIndexes(indexes)
})

console.log('--- AppIndex.vue setup ---', window.location.href)
</script>
