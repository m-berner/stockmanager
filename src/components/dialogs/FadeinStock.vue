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
      <v-select
        v-model="_selected"
        v-bind:label="t('dialogs.fadeinStock.title')"
        v-bind:items="records.stocks.passive"
        v-bind:clearable="true"
        v-bind:return-object="true"
        v-on:update:modelValue="fadeinstock.onSelect"
        variant="outlined"
        item-title="cCompany"
        density="compact"
      ></v-select>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useModaldialogStore} from '@/stores/modaldialog'
import {useRecordsStore} from '@/stores/records'
import {useFadeinstockStore} from '@/stores/dialogs/fadeinstock'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {storeToRefs} from 'pinia'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const records = useRecordsStore()
const fadeinstock = useFadeinstockStore()
const { _selected } = storeToRefs(fadeinstock)

onMounted(() => {
  console.log('FADEINSTOCK: onMounted')
  fadeinstock.reset()
  modaldialog.setNoOk(false)
})

console.log('--- FadeinStock.vue setup ---')
</script>
