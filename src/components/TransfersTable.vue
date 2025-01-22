<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-text-field
    v-model="search"
    density="compact"
    hide-details
    prepend-inner-icon="$magnify"
    single-line
    v-bind:label="t('transfersTable.search')"
    variant="outlined"
  ></v-text-field>

  <v-data-table
    density="compact"
    item-key="cID"
    v-bind:headers="tableHeaders"
    v-bind:hide-no-data="false"
    v-bind:hover="true"
    v-bind:items="(records.transfers.all as ITransfer[])"
    v-bind:items-per-page="settings.itemsPerPageTransfers"
    v-bind:items-per-page-options="CONS.SETTINGS.ITEMS_PER_PAGE_OPTIONS"
    v-bind:items-per-page-text="t('transfersTable.itemsPerPageText')"
    v-bind:no-data-text="t('transfersTable.noDataText')"
    v-bind:search="search"
    v-on:update:items-per-page="
      (count) => {
        settings.setItemsPerPageTransfers(count)
      }
    "
  >
    <template v-slot:[`item`]="{ item }">
      <tr class="table-row">
        <td>
          <OptionMenu
            menuType="transfers"
            v-bind:menuItems="options"
            v-bind:recordID="item.cID"
          ></OptionMenu>
        </td>
        <td>{{ item.mCompany }}</td>
        <td v-if="item.cDate > 0">{{ d(new Date(item.cDate), 'short', 'de-DE') }}</td>
        <td v-else></td>
        <td v-if="item.cExDay > 0">{{ d(new Date(item.cExDay), 'short', 'de-DE') }}</td>
        <td v-else></td>
        <td>{{ n(item.cUnitQuotation, 'currency5') }}</td>
        <td>{{ n(item.cAmount, 'currency') }}</td>
        <td>{{ n(item.cCount, 'integer') }}</td>
        <td>{{ n(item.cFees, 'currency') }}</td>
        <td>{{ n(item.cSTax, 'currency') }}</td>
        <td>{{ n(item.cFTax, 'currency') }}</td>
        <td>{{ n(item.cTax, 'currency') }}</td>
        <td>{{ n(item.cSoli, 'currency') }}</td>
        <td>{{ item.cMarketPlace }}</td>
        <td>{{ item.cDescription }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import OptionMenu from '@/components/OptionMenu.vue'
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {useApp} from '@/composables/useApp'

const {d, n, rt, t, tm} = useI18n()
const {CONS} = useApp()
const records = useRecordsStore()
const settings = useSettingsStore()

const search = ref('')
const headers = tm('transfersTable.headers')
const tableHeaders = headers.map((item: { title: string, align: string, sortable: boolean, key: string }) => {
  return {
    title: rt(item.title),
    align: rt(item.align) as 'start' | 'center' | 'end' | undefined,
    sortable: item.sortable,
    key: rt(item.key)
  }
})
const options: Record<string, string>[] = tm('transfersTable.menuItems')

console.log('--- TransfersTable.vue setup ---')
</script>
