<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-data-table
    v-bind:items-per-page-text="t('stocksTable.itemsPerPageText')"
    v-bind:items-per-page="settings.itemsPerPageStocks"
    v-bind:items-per-page-options="CONS.SETTINGS.ITEMS_PER_PAGE_OPTIONS"
    v-bind:headers="tableHeaders"
    v-bind:items="(records.stocks.active as IStock[])"
    v-bind:hover="true"
    v-bind:hide-no-data="false"
    v-bind:no-data-text="t('stocksTable.noDataText')"
    v-on:update:items-per-page="
      (count) => {
        settings.setItemsPerPageStocks(count)
      }
    "
    v-on:update:page="(page) => onUpdatePageHandler(page)"
    density="compact"
    item-key="cID"
  >
    <template v-slot:[`item`]="{ item }">
      <tr class="table-row">
        <td>
          <OptionMenu v-bind:menuItems="options" v-bind:recordID="item.cID" menuType="stocks"></OptionMenu>
        </td>
        <td>{{ item.cCompany }}</td>
        <td>{{ item.cISIN }}</td>
        <td>{{ d(new Date(item.cQuarterDay), 'short', 'de-DE') }}</td>
        <td>{{ d(new Date(item.cMeetingDay), 'short', 'de-DE') }}</td>
        <td>{{ item.mPortfolio }}</td>
        <td>{{ n(item.mBuyValue ?? 0, 'currency3') }}</td>
        <v-tooltip location="left" v-bind:text="n((item.mChange ?? 0) / 100, 'percent')">
          <template v-slot:activator="{ props }">
            <td v-bind="props" v-bind:ref="setDynamicStyleWinLoss">
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
  <ModalDialog
    v-if="modaldialog.deleteStock"
    classes="align-center justify-content"
    v-bind:title="
      t('dialogs.deleteStock.title', {
        company: records.stocks.active[records.stocks.active_index].cCompany
      })
    "
    v-bind:ok="deletestock.delete"
  >
    <DeleteStock></DeleteStock
    >
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.addDividend"
    v-bind:title="
      t('dialogs.addDividend.title', {
        company: records.stocks.active[records.stocks.active_index].cCompany
      })
    "
    v-bind:ok="adddividend.add"
  >
    <AddDividend></AddDividend>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.showDividend"
    v-bind:title="
      t('dialogs.viewDividend.title', {
        company: records.stocks.active[records.stocks.active_index].cCompany
      })
    "
  >
    <ShowDividend></ShowDividend>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.buyStock"
    v-bind:title="
      t('dialogs.buyStock.title', {
        company: records.stocks.active[records.stocks.active_index].cCompany
      })
    "
    v-bind:ok="buystock.buy"
  >
    <BuyStock></BuyStock>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.sellStock"
    v-bind:title="
      t('dialogs.sellStock.title', {
        company: records.stocks.active[records.stocks.active_index].cCompany
      })
    "
    v-bind:ok="sellstock.sell"
  >
    <SellStock></SellStock
    >
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.configStock"
    v-bind:title="
      t('dialogs.configStock.title', {
        company: records.stocks.active[records.stocks.active_index].cCompany
      })
    "
    v-bind:ok="async () => {configstock.configure()}"
  >
    <ConfigStock></ConfigStock
    >
  </ModalDialog>
</template>

<script lang="ts" setup>
import DeleteStock from '@/components/dialogs/DeleteStock.vue'
import AddDividend from '@/components/dialogs/AddDividend.vue'
import ShowDividend from '@/components/dialogs/ShowDividend.vue'
import BuyStock from '@/components/dialogs/BuyStock.vue'
import SellStock from '@/components/dialogs/SellStock.vue'
import ConfigStock from '@/components/dialogs/ConfigStock.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import OptionMenu from '@/components/OptionMenu.vue'
import {useDeletestockStore} from '@/stores/dialogs/deletestock'
import {useAdddividendStore} from '@/stores/dialogs/adddividend'
import {useBuystockStore} from '@/stores/dialogs/buystock'
import {useSellstockStore} from '@/stores/dialogs/sellstock'
import {useConfigstockStore} from '@/stores/dialogs/configstock'
// import { type MessageFunction, type VueMessageType } from 'vue-i18n'
import {useI18n} from 'vue-i18n'
import {onBeforeMount} from 'vue'
// import { useRuntimeStore } from '@/stores/runtime'
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'
import {useModaldialogStore} from '@/stores/modaldialog'

const {d, n, rt, t, tm} = useI18n()
const CONS = useConstants()
const {toNumber} = useAppLibrary()
const modaldialog = useModaldialogStore()
const deletestock = useDeletestockStore()
const adddividend = useAdddividendStore()
const buystock = useBuystockStore()
const sellstock = useSellstockStore()
const configstock = useConfigstockStore()
const records = useRecordsStore()
const settings = useSettingsStore()

const headers = tm('stocksTable.headers')

const tableHeaders = headers.map((item: { title: string, align: string, sortable: boolean, key: string }) => {
  return {
    title: rt(item.title),
    align: rt(item.align) as 'start' | 'center' | 'end' | undefined,
    sortable: item.sortable,
    key: rt(item.key)
  }
})
const options: Record<string, string>[] = tm('stocksTable.menuItems')

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
const onUpdatePageHandler = (p: number): void => {
  console.info('STOCKSTABLE: onUpdatePageHandler', p)
  records.updateWrapper(p)
}

onBeforeMount(() => {
  console.log('STOCKSTABLE: onBeforeMount')
  records.updateWrapper(1)
})

console.log('--- StocksTable.vue setup ---')
</script>
