<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-container>
        <v-row v-for="item in records.dividendsPerStock.get(records._stocks.active[records._stocks.active_index].cID)"
               v-bind:key="item.cID">
          <v-col cols="6">
            <v-label density="compact" v-bind:text="d(new Date(item.cDate), 'short', 'de-DE')"></v-label>
          </v-col>
          <v-col>
            <v-label density="compact" v-bind:text="n(item.cCount * item.cUnitQuotation, 'currency')"></v-label>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {useRuntimeStore} from '@/stores/runtime'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {d, n, t} = useI18n()
const records = useRecordsStore()
const runtime = useRuntimeStore()

const title = () => {
  return t('dialogs.viewDividend.title', {
    company: records.stocks.active[records.stocks.active_index].cCompany
  })
}
const classes = () => {
  return ''
}
defineExpose({title, classes})

onMounted(() => {
  console.log('SHOWDIVIDEND: onMounted')
  runtime.setIsOk(false)
})

console.log('--- ShowDividend.vue setup ---')
</script>
