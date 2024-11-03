<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-text-field
    v-model="search"
    v-bind:label="t('transfersTable.search')"
    density="compact"
    variant="outlined"
    prepend-inner-icon="$magnify"
    hide-details
    single-line
  ></v-text-field>

  <v-data-table
    v-bind:items-per-page-text="t('transfersTable.itemsPerPageText')"
    v-bind:items-per-page="settings.itemsPerPageTransfers"
    v-bind:items-per-page-options="CONS.SETTINGS.ITEMS_PER_PAGE_OPTIONS"
    v-bind:headers="tableHeaders"
    v-bind:search="search"
    v-bind:items="(records.transfers.all as ITransfer[])"
    v-bind:hover="true"
    v-bind:hide-no-data="false"
    v-bind:no-data-text="t('transfersTable.noDataText')"
    v-on:update:items-per-page="
      (count) => {
        settings.setItemsPerPageTransfers(count)
      }
    "
    density="compact"
    item-key="cID"
  >
    <template v-slot:[`item`]="{ item }">
      <tr class="table-row">
        <td>
          <OptionMenu
            v-bind:menuItems="tm('transfersTable.menuItems')"
            v-bind:recordID="item.cID"
            menuType="transfers"
          ></OptionMenu>
        </td>
        <td>{{ item.mCompany }}</td>
        <td>{{ d(new Date(item.cDate), 'short', 'de-DE') }}</td>
        <td>{{ d(new Date(item.cExDay), 'short', 'de-DE') }}</td>
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

  <ModalDialog
    v-if="modaldialog.deleteTransfer"
    v-bind:title="t('dialogs.deleteTransfer.title')"
    classes="align-center justify-content"
    v-bind:ok="records.onDeleteTransfer"
  >
    <DeleteTransfer></DeleteTransfer>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.updateTransfer"
    v-bind:title="t('dialogs.updateTransfer.title')"
    v-bind:ok="updateTransfer"
  >
    <UpdateTransfer v-bind:initialTransfer="records.transfers.all[records.transfers.index]"></UpdateTransfer>
  </ModalDialog>
</template>

<script lang="ts" setup>
import ModalDialog from '@/components/ModalDialog.vue'
import DeleteTransfer from '@/components/dialogs/DeleteTransfer.vue'
import UpdateTransfer from '@/components/dialogs/UpdateTransfer.vue'
import OptionMenu from '@/components/OptionMenu.vue'
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useUpdatetransferStore} from '@/stores/dialogs/updatetransfer'
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {useConstants} from '@/libraries/useConstants'

const {d, n, rt, t, tm} = useI18n()
const CONS = useConstants()
const records = useRecordsStore()
const settings = useSettingsStore()
const modaldialog = useModaldialogStore()
const updatetransfer = useUpdatetransferStore()

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
const updateTransfer = async () => {
  await updatetransfer.onUpdate()
}

console.log('--- TransfersTable.vue setup ---')
</script>
