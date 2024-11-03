<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5" v-if="deletestock.deleteable">
      {{ t('dialogs.deleteStock.messageA', {company: records.stocks.active[records.stocks.active_index].cCompany}) }}
    </v-card-text>
    <v-card-text class="pa-5" v-else>
      {{ t('dialogs.deleteStock.messageB', {company: records.stocks.active[records.stocks.active_index].cCompany}) }}
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {useDeletestockStore} from '@/stores/dialogs/deletestock'
import {onMounted} from 'vue'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const records = useRecordsStore()
const deletestock = useDeletestockStore()
const modaldialog = useModaldialogStore()

onMounted(() => {
  const check = records.transfers.all.findIndex(
    (transfer: ITransfer) => transfer.cStockID === records.stocks.active[records.stocks.active_index].cID
  )
  console.info('DELETESTOCK: onMounted', check)
  if (check <= 0) {
    deletestock.setDeleteable(true)
    modaldialog.setNoOk(false)
  } else {
    deletestock.setDeleteable(false)
    modaldialog.setNoOk(true)
  }
})

console.log('--- DeleteStock.vue setup ---')
</script>
