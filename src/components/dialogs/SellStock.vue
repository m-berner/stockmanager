<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form ref="form-ref" validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="state._date"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.sellStock.bookDay')"
              v-bind:rules="[validators.isoDate]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="state._count"
              autofocus
              density="compact"
              v-bind:label="t('dialogs.sellStock.count')"
              v-bind:rules="[validators.positiveInteger]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._unit_quotation"
              v-bind:label="t('dialogs.sellStock.unitQuotation')"
              v-bind:options="{ currency: getUI().cur, precision: 5 }"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="state._fees"
              v-bind:label="t('dialogs.sellStock.fees')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._stax"
              v-bind:label="t('dialogs.sellStock.stax')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="state._market_place"
              density="compact"
              item-title="marketPlace"
              v-bind:clearable="true"
              v-bind:items="settings.markets"
              v-bind:label="t('dialogs.sellStock.marketplace')"
              v-bind:return-object="true"
              variant="outlined"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._tax"
              v-bind:label="t('dialogs.sellStock.tax')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="state._soli"
              v-bind:label="t('dialogs.sellStock.soli')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useSettingsStore} from '@/stores/settings'
import {useApp} from '@/composables/useApp'
import {onMounted, reactive, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRecordsStore} from '@/stores/records'
import {useRuntimeStore} from '@/stores/runtime'

interface ISellStock {
  _date: string
  _count: string
  _unit_quotation: number
  _fees: number
  _stax: number
  _tax: number
  _soli: number
  _market_place: string
}

const {t} = useI18n()
const runtime = useRuntimeStore()
const records = useRecordsStore()
const settings = useSettingsStore()
const {CONS, getUI, toNumber, validators} = useApp()
const formRef = useTemplateRef('form-ref')
const state: ISellStock = reactive({
  _date: '',
  _count: '',
  _unit_quotation: 0,
  _fees: 0,
  _stax: 0,
  _tax: 0,
  _soli: 0,
  _market_place: ''
})

const ok = async (): Promise<void> => {
  console.log('SELLSTOCK: ok', state._date, validators.isoDate(state._date))
  const transfer = {
    cStockID: records.stocks.active[records.stocks.active_index].cID,
    cDate: new Date(state._date).getTime(),
    cExDay: 0,
    cUnitQuotation: state._unit_quotation,
    cAmount: 0,
    cCount: -toNumber(state._count),
    cFees: -state._fees,
    cSTax: -state._stax,
    cFTax: -0,
    cTax: -state._tax,
    cSoli: -state._soli,
    cType: CONS.DB.RECORD_TYPES.BUY,
    cMarketPlace: state._market_place,
    cDescription: ''
  }
  if (validators.isoDate(state._date) !== true) {
    state._date = '0000-00-00'
  }
  if (validators.positiveInteger(state._count) !== true) {
    state._count = '0'
  }
  console.error('SELLSTOCK:', validators.isoDate(state._date) )
  if (validators.positiveInteger(state._count) === true && validators.isoDate(state._date) === true) {
    await records.addTransfer(transfer)
    records.evaluateTransfers()
    records.setDrawerDepot()
    runtime.toggleVisibility()
  }
}
const title = () => {
  return t('dialogs.sellStock.title', {
    company: records.stocks.active[records.stocks.active_index].cCompany
  })
}
const classes = () => {
  return ''
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('SELLSTOCK: onMounted')
  formRef.value?.reset()
  state._unit_quotation = 0
  state._fees = 0
  state._stax = 0
  state._tax = 0
  state._soli = 0
  runtime.setIsOk(true)
})

console.log('--- SellStock.vue setup ---')
</script>
