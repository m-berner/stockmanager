<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text v-if="records.transfers.selected_index === 0" class="pa-5">
      {{ t('dialogs.deleteTransfer.message[0]') }}
      {{ d(new Date(records.transfers.all[records.transfers.selected_index].cDate), 'short') }}
      ({{ records.transfers.all[records.transfers.selected_index].mCompany }})
      {{ t('dialogs.deleteTransfer.message[1]') }}
    </v-card-text>
    <v-card-text v-else class="pa-5">
      {{ t('dialogs.deleteTransfer.message[2]') }}
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useRuntimeStore} from '@/stores/runtime'
import {useRecordsStore} from '@/stores/records'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {d, t} = useI18n()
const records = useRecordsStore()
const runtime = useRuntimeStore()

const ok = async (): Promise<void> => {
  console.log('DELETETRANSFER: ok')
  if (records.transfers.selected_index === 0) {
    await records.deleteTransfer(records._transfers.all[0].cID ?? -1)
    records.evaluateTransfers()
  }
  runtime.toggleVisibility('')
}
const title = () => {
  return t('dialogs.deleteTransfer.title')
}
const classes = () => {
  return 'align-center justify-content'
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.info('DELETETRANSFER: onMounted', records.transfers.selected_index)
  if (records.transfers.selected_index === 0) {
    runtime.setIsOk(true)
  } else {
    runtime.setIsOk(false)
  }
})

console.log('--- DeleteTransfer.vue setup ---')
</script>
