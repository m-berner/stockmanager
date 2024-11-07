<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-navigation-drawer color="secondary" height="100%" v-model="state._show.value" width="180" v-bind:floating="true" app>
    <v-card color="secondary" height="100%">
      <v-list lines="two">
        <v-list-item
          v-for="item in state._drawer_controls"
          v-bind:key="item.id"
          v-bind:title="item.title"
          v-bind:subtitle="item.value"
          v-bind:class="item.class"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-navigation-drawer>
  <v-app-bar color="secondary" v-bind:flat="true" app>
    <v-app-bar-nav-icon variant="text" v-on:click="state._show.value = !state._show.value"></v-app-bar-nav-icon>
    <v-list class="w-100" bg-color="secondary">
      <v-row class="w-100" justify="space-between">
        <v-list-item v-for="item in _exchanges" v-bind:key="item">
          <v-list-item-title>{{ item }}</v-list-item-title>
          <v-list-item-subtitle>{{ n(toNumber(online.exchanges.get(item)), 'decimal3') }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item v-for="item in _indexes" v-bind:key="item">
          <v-list-item-title>{{ CONS.SETTINGS.INDEXES[item] }}</v-list-item-title>
          <v-list-item-subtitle>{{ n(toNumber(online.indexes.get(item)), 'integer') }}</v-list-item-subtitle>
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
import {reactive, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useOnlineStore} from '@/stores/online'
import {useSettingsStore} from '@/stores/settings'
import {useRecordsStore} from '@/stores/records'
import {storeToRefs} from 'pinia'
import {useApp} from '@/useApp'

const {n, t} = useI18n()
const {CONS} = useApp()
const {getUI, toNumber} = useApp()
const online = useOnlineStore()
const settings = useSettingsStore()
const records = useRecordsStore()
const {_exchanges, _indexes, _materials} = storeToRefs(settings)
//const drawerControls: IDrawerControls[] = CONS.DEFAULTS.DRAWER_CONTROLS
const state = {
  _show: ref(true),
  _drawer_controls: reactive(CONS.DEFAULTS.DRAWER_CONTROLS)
}

const usd = (mat: string, usd = true): number => {
  if (usd) {
    return online.materials.get(mat) ?? 0
  } else {
    return (online.materials.get(mat) ?? 0) / (online.exchanges.get(getUI().curusd) ?? 1)
  }
}
const updateDrawerControls = (): void => {
  console.log('INFOBAR: updateDrawerControls')
  for (let i = 0; i < CONS.DEFAULTS.DRAWER_KEYS.length; i++) {
    state._drawer_controls[i] = {id: i, title: '', value: '', class: ''}
    // const percent =
    // elem === 'winloss' ? ' / ' + n(records.transfers.totalController.winlossPercent ?? 0, 'percent') : ''
    state._drawer_controls[i].id = i
    state._drawer_controls[i].title = t(`infoBar.drawerTitles.${CONS.DEFAULTS.DRAWER_KEYS[i]}`)
    state._drawer_controls[i].value = n(records.transfers.totalController[CONS.DEFAULTS.DRAWER_KEYS[i]], 'currency') // + percent,
    state._drawer_controls[i].class = records.transfers.totalController[CONS.DEFAULTS.DRAWER_KEYS[i]] < 0 ? CONS.DEFAULTS.DRAWER_KEYS[i] + '_minus' : CONS.DEFAULTS.DRAWER_KEYS[i]
  }
}

//watch(() => [records.transfers.totalController.depot, records.transfers.totalController.account, records.transfers.totalController.dividends], updateDrawerControls)
watch(() => records.transfers.totalController.depot, updateDrawerControls)

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
</style>
