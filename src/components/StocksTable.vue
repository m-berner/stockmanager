<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-data-table
    density="compact"
    item-key="cID"
    v-bind:headers="tableHeaders"
    v-bind:hide-no-data="false"
    v-bind:hover="true"
    v-bind:items="(records.stocks.active as IStock[])"
    v-bind:items-per-page="settings.itemsPerPageStocks"
    v-bind:items-per-page-options="CONS.SETTINGS.ITEMS_PER_PAGE_OPTIONS"
    v-bind:items-per-page-text="t('stocksTable.itemsPerPageText')"
    v-bind:loading="_is_stocks_loading"
    v-bind:no-data-text="t('stocksTable.noDataText')"
    v-on:update:items-per-page="
      (count) => {
        settings.setItemsPerPageStocks(count)
      }
    "
    v-on:update:page="(page) => onUpdatePageHandler(page)">
    <template v-slot:[`item`]="{ item }">
      <tr class="table-row">
        <td>
          <OptionMenu
            menuType="stocks"
            v-bind:menuItems="tm('stocksTable.menuItems')"
            v-bind:recordID="item.cID">
          </OptionMenu>
        </td>
        <td>{{ item.cCompany }}</td>
        <td>{{ item.cISIN }}</td>
        <td v-if="item.cQuarterDay > 0">{{ d(new Date(item.cQuarterDay), 'short', 'de-DE') }}</td>
        <td v-else></td>
        <td v-if="item.cMeetingDay > 0">{{ d(new Date(item.cMeetingDay), 'short', 'de-DE') }}</td>
        <td v-else></td>
        <td>{{ item.mPortfolio }}</td>
        <td>{{ n(item.mBuyValue ?? 0, 'currency3') }}</td>
        <v-tooltip location="left" v-bind:text="n((item.mChange ?? 0) / 100, 'percent')">
          <template v-slot:activator="{ props }">
            <td v-bind:ref="setDynamicStyleWinLoss" v-bind="props">
              {{ n(item.mEuroChange ?? 0, 'currency') }}
            </td>
          </template>
        </v-tooltip>
        <td>{{ n(item.mMin ?? 0, 'currency') }}</td>
        <td class="font-weight-bold color-black">
          {{ n(item.mValue ?? 0, 'currency3') }}
        </td>
        <td>{{ n(item.mMax ?? 0, 'currency') }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import OptionMenu from '@/components/OptionMenu.vue'
import {useI18n} from 'vue-i18n'
import {storeToRefs} from 'pinia'
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {useApp} from '@/background'
import {useRuntimeStore} from '@/stores/runtime'

const {d, n, rt, t, tm} = useI18n()
const {CONS, toNumber} = useApp()
const records = useRecordsStore()
const settings = useSettingsStore()
const runtime = useRuntimeStore()
const {_is_stocks_loading} = storeToRefs(runtime)
const headers = tm('stocksTable.headers')
const tableHeaders = headers.map((item: { title: string, align: string, sortable: boolean, key: string }) => {
  return {
    title: rt(item.title),
    align: rt(item.align) as 'start' | 'center' | 'end' | undefined,
    sortable: item.sortable,
    key: rt(item.key)
  }
})

const setDynamicStyleWinLoss = (el: HTMLElement | null): void => {
  if (el !== null) {
    if (toNumber(el.textContent) < 0) {
      el.classList.add('color-red')
    } else if (toNumber(el.textContent) > 0) {
      el.classList.add('color-black')
    }
    el.classList.add('font-weight-bold')
  }
}
const onUpdatePageHandler = async (p: number): Promise<void> => {
  console.info('STOCKSTABLE: onUpdatePageHandler', p)
  records.setActiveStocksPage(p)
  await records.updateWrapper()
}

console.log('--- StocksTable.vue setup ---')
</script>
