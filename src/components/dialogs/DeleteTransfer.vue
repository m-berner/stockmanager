<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5" v-if="records.transfers.index === 0">
      {{ t('dialogs.deleteTransfer.message[0]') }}
      {{ d(new Date(records.transfers.all[records.transfers.index].cDate), 'short') }}
      ({{ records.transfers.all[records.transfers.index].mCompany }})
      {{ t('dialogs.deleteTransfer.message[1]') }}
    </v-card-text>
    <v-card-text class="pa-5" v-else>
      {{ t('dialogs.deleteTransfer.message[2]') }}
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useModaldialogStore} from '@/stores/modaldialog'
import {useRecordsStore} from '@/stores/records'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {d, t} = useI18n()
const records = useRecordsStore()

onMounted(() => {
  console.info('DELETETRANSFER: onMounted', records.transfers.index)
  const modaldialog = useModaldialogStore()
  if (records.transfers.index === 0) {
    modaldialog.setNoOk(false)
  } else {
    modaldialog.setNoOk(true)
  }
})

console.log('--- DeleteTransfer.vue setup ---')
</script>
