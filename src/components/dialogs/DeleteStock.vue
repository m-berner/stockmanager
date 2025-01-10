<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text v-if="state._deleteable" class="pa-5">
      {{ t('dialogs.deleteStock.messageA', {company: records.stocks.active[records.stocks.active_index].cCompany}) }}
    </v-card-text>
    <v-card-text v-else class="pa-5">
      {{ t('dialogs.deleteStock.messageB', {company: records.stocks.active[records.stocks.active_index].cCompany}) }}
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {onMounted, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRuntimeStore} from '@/stores/runtime'

interface IDeleteStock {
  _deleteable: boolean
}

const {t} = useI18n()
const records = useRecordsStore()
const runtime = useRuntimeStore()
const state: IDeleteStock = reactive({
  _deleteable: false
})

const ok = async (): Promise<void> => {
  console.log('DELETESTOCK: ok')
  const records = useRecordsStore()
  await records.deleteStock(records.stocks.active[records.stocks.active_index].cID)
  runtime.toggleVisibility()
}
const title = () => {
  return t('dialogs.deleteStock.title', {
    company: records.stocks.active[records.stocks.active_index].cCompany
  })
}
const classes = () => {
  return 'align-center justify-content'
}
defineExpose({ok, title, classes})

onMounted(() => {
  const check = records.transfers.all.findIndex(
    (transfer: ITransfer) => transfer.cStockID === records.stocks.active[records.stocks.active_index].cID
  )
  console.info('DELETESTOCK: onMounted', check)
  if (check <= 0) {
    state._deleteable = true
    runtime.setIsOk(true)
  } else {
    state._deleteable = false
    runtime.setIsOk(false)
  }
})

console.log('--- DeleteStock.vue setup ---')
</script>
