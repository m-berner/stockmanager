<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-navigation-drawer v-model="state._show.value" app color="secondary" height="100%" v-bind:floating="true"
                       width="180">
    <v-card color="secondary" height="100%">
      <v-list lines="two">
        <v-list-item
          v-for="item in state._drawer_controls"
          v-bind:key="item.id"
          v-bind:class="item.class"
          v-bind:subtitle="item.value"
          v-bind:title="item.title"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-navigation-drawer>
  <v-app-bar app color="secondary" v-bind:flat="true">
    <v-app-bar-nav-icon variant="text" v-on:click="state._show.value = !state._show.value"></v-app-bar-nav-icon>
    <v-list bg-color="secondary" class="hide-scroll-bar" lines="two">
      <v-row>
        <v-list-item v-for="item in _exchanges" v-bind:key="item">
          <v-list-item-title>{{ item }}</v-list-item-title>
          <v-list-item-subtitle>{{ n(runtime.exchanges.get(item) ?? 1, 'decimal3') }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item v-for="item in _indexes" v-bind:key="item">
          <v-list-item-title>{{ CONS.SETTINGS.INDEXES[item] }}</v-list-item-title>
          <v-list-item-subtitle>{{ n(runtime.indexes.get(item) ?? 0, 'integer') }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item v-for="item in _materials" v-bind:key="item">
          <v-list-item-title>{{ t('optionsPage.materials.' + item) }}</v-list-item-title>
          <v-list-item-subtitle
          >{{ n(usd(item), 'currencyUSD') + ' / ' + n(usd(item, false), 'currency') }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-row>
    </v-list>
  </v-app-bar>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRuntimeStore} from '@/stores/runtime'
import {useSettingsStore} from '@/stores/settings'
import {useRecordsStore} from '@/stores/records'
import {storeToRefs} from 'pinia'
import {useApp} from '@/composables/useApp'

const {n, t} = useI18n()
const {CONS, notice} = useApp()
const runtime = useRuntimeStore()
const settings = useSettingsStore()
const records = useRecordsStore()
const {_exchanges, _indexes, _materials} = storeToRefs(settings)
const state = {
  _show: ref(true),
  _drawer_controls: reactive(CONS.DEFAULTS.DRAWER_CONTROLS)
}

const usd = (mat: string, usd = true): number => {
  // NOTE: material prices arrive in USD
  if (usd) {
    return runtime.materials.get(mat) ?? 0
  } else {
    return (runtime.materials.get(mat) ?? 0) / (runtime.exchangesCurUsd)
  }
}
const updateDrawerControls = (): void => {
  console.log('INFOBAR: updateDrawerControls')
  for (let i = 0; i < CONS.DEFAULTS.DRAWER_KEYS.length; i++) {
    state._drawer_controls[i] = {id: i, title: '', value: '', class: ''}
    // const percent =
    // elem === 'winloss' ? ' / ' + n(records.transfers.total_controller.winlossPercent ?? 0, 'percent') : ''
    state._drawer_controls[i].id = i
    state._drawer_controls[i].title = t(`infoBar.drawerTitles.${CONS.DEFAULTS.DRAWER_KEYS[i]}`)
    state._drawer_controls[i].value = n(records.transfers.total_controller[CONS.DEFAULTS.DRAWER_KEYS[i]], 'currency') // + percent,
    state._drawer_controls[i].class = records.transfers.total_controller[CONS.DEFAULTS.DRAWER_KEYS[i]] < 0 ? CONS.DEFAULTS.DRAWER_KEYS[i] + '_minus' : CONS.DEFAULTS.DRAWER_KEYS[i]
  }
}
const onMessageInfoBar = (ev: MessageEvent): void => {
  console.info('INFOBAR: onMessageInfoBar', ev)
  const exchanges = new Map<string, number>()
  const materials = new Map<string, number>()
  const indexes = new Map<string, number>()
  if (ev.data === undefined) {
    notice(['Sorry, no data arrived'])
  } else {
    switch (ev.type) {
      case CONS.FETCH_API.ANSWER__EXCHANGES_DATA:
        for (let i = 0; i < ev.data.length; i++) {
          exchanges.set(ev.data[i].key, ev.data[i].value)
        }
        runtime.setExchanges(exchanges)
        break
      case CONS.FETCH_API.ANSWER__MATERIAL_DATA:
        for (let i = 0; i < ev.data.length; i++) {
          materials.set(ev.data[i].key, ev.data[i].value)
        }
        runtime.setMaterials(materials)
        break
      case CONS.FETCH_API.ANSWER__INDEX_DATA:
        for (let i = 0; i < ev.data.length; i++) {
          indexes.set(ev.data[i].key, ev.data[i].value)
        }
        runtime.setIndexes(indexes)
        break
    }
  }
}

watch(() => records.transfers.total_controller.dividends, updateDrawerControls)
watch(() => records.transfers.total_controller.depot, updateDrawerControls)
watch(() => records.transfers.total_controller.account, updateDrawerControls)
onMounted(() => {
  updateDrawerControls()
})
if (!browser.runtime.onMessage.hasListener(onMessageInfoBar)) {
  // noinspection JSDeprecatedSymbols
  browser.runtime.onMessage.addListener(onMessageInfoBar)
}
console.log('--- InfoBar.vue setup ---')
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.winloss {
  font-weight: bold;
  color: green;
}

.winloss_minus,
.fees_minus,
.taxes_minus,
.withdrawals_minus,
.account_minus,
.earnings_minus {
  color: red;
}

.hide-scroll-bar {
  overflow: hidden;
}
</style>
