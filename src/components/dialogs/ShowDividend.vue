<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-container>
        <v-row v-for="item in _show_dividends" v-bind:key="JSON.stringify(item)">
          <v-col cols="6">
            <v-label density="compact" v-bind:text="d(new Date(item.year), 'short', 'de-DE')"></v-label>
          </v-col>
          <v-col>
            <v-label density="compact" v-bind:text="n(item.dividend, 'currency')"></v-label>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useModaldialogStore} from '@/stores/modaldialog'
import {useRecordsStore} from '@/stores/records'
import {onBeforeMount, onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'

const {d, n} = useI18n()
const records = useRecordsStore()
const {_show_dividends} = storeToRefs(records)

onBeforeMount(() => {
  console.log('SHOWDIVIDEND: onBeforeMount')
  records.initShowDividends()
})

onMounted(() => {
  console.log('SHOWDIVIDEND: onMounted')
  const modaldialog = useModaldialogStore()
  modaldialog.setNoOk(true)
})

console.log('--- ShowDividend.vue setup ---')
</script>
