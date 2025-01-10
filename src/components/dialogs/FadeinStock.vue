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
      <v-select
        v-model="state._selected"
        density="compact"
        item-title="cCompany"
        v-bind:clearable="true"
        v-bind:items="records.stocks.passive"
        v-bind:label="t('dialogs.fadeinStock.title')"
        v-bind:return-object="true"
        variant="outlined"
        v-on:update:modelValue="() => state._selected.cFadeOut = 0"
      ></v-select>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {onMounted, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/composables/useApp'
import {useRuntimeStore} from '@/stores/runtime'

interface IFadeinStock {
  _selected: IStock
}

const {t} = useI18n()
const {CONS, toNumber} = useApp()
const runtime = useRuntimeStore()
const records = useRecordsStore()
const state: IFadeinStock = reactive({
  _selected: CONS.RECORDS.TEMPLATES.STOCK
})

const ok = async (): Promise<void> => {
  console.log('FADEINSTOCK: ok')
  const records = useRecordsStore()
  const indexOfPassiveStock = records._stocks.passive.findIndex((passiveStock: IStock) => {
    return state._selected.cID === passiveStock.cID
  })
  if (indexOfPassiveStock > -1 && toNumber(state._selected.cFadeOut) === 0) {
    records._stocks.passive.splice(indexOfPassiveStock, 1)
    records._stocks.active.push(state._selected)
  }
  await records.updateStock(state._selected)
  runtime.toggleVisibility()
}
const title = () => {
  return t('dialogs.fadeinStock.title')
}
const classes = () => {
  return ''
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('FADEINSTOCK: onMounted')
  state._selected = CONS.RECORDS.TEMPLATES.STOCK
  runtime.setIsOk(true)
})

console.log('--- FadeinStock.vue setup ---')
</script>
