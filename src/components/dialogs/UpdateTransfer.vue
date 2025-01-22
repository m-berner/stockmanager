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
              autofocus
              density="compact"
              type="date"
              v-bind:label="t('dialogs.updateTransfer.bookDay')"
              v-bind:rules="[validators.isoDate]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="state._ex_day"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.updateTransfer.exDay')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CurrencyInput
              v-model="state._unit_quotation"
              v-bind:label="t('dialogs.updateTransfer.unitQuotation')"
              v-bind:options="{ currency: getUI().cur, precision: 5 }"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._amount"
              v-bind:label="t('dialogs.updateTransfer.amount')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="state._count"
              density="compact"
              v-bind:label="t('dialogs.updateTransfer.number')"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._fees"
              v-bind:label="t('dialogs.updateTransfer.fees')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CurrencyInput
              v-model="state._stax"
              v-bind:label="t('dialogs.updateTransfer.sTax')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._ftax"
              v-bind:label="t('dialogs.updateTransfer.fTax')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CurrencyInput
              v-model="state._tax"
              v-bind:label="t('dialogs.updateTransfer.tax')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._soli"
              v-bind:label="t('dialogs.updateTransfer.soli')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              v-model="state._market_place"
              density="compact"
              item-title="marketPlace"
              v-bind:clearable="true"
              v-bind:items="settings.markets"
              v-bind:label="t('dialogs.updateTransfer.marketPlace')"
              v-bind:return-object="true"
              variant="outlined"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state._description"
              density="compact"
              v-bind:label="t('dialogs.updateTransfer.description')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useApp} from '@/composables/useApp'
import {onMounted, reactive, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRecordsStore} from '@/stores/records'
import {useRuntimeStore} from '@/stores/runtime'
import {useSettingsStore} from '@/stores/settings'

interface IUpdateTransfer {
  _date: string
  _ex_day: string
  _count: number
  _unit_quotation: number
  _stock_id: number
  _amount: number
  _fees: number
  _stax: number
  _ftax: number
  _tax: number
  _soli: number
  _type: number
  _market_place: string
  _description: string
}

const {t} = useI18n()
const runtime = useRuntimeStore()
const records = useRecordsStore()
const settings = useSettingsStore()
const {dateToISO, getUI, notice, toNumber, validators} = useApp()
const formRef = useTemplateRef('form-ref')
const state: IUpdateTransfer = reactive({
  _date: '',
  _ex_day: '',
  _count: 0,
  _unit_quotation: 0,
  _stock_id: 0,
  _amount: 0,
  _fees: 0,
  _stax: 0,
  _ftax: 0,
  _tax: 0,
  _soli: 0,
  _type: 0,
  _market_place: '',
  _description: ''
})

const setInitialTransfer = (value: ITransfer): void => {
  state._date = dateToISO(value.cDate)
  state._ex_day = dateToISO(value.cExDay)
  state._count = value.cCount
  state._amount = value.cAmount
  state._fees = value.cFees
  state._unit_quotation = value.cUnitQuotation
  state._stax = value.cSTax
  state._ftax = value.cFTax
  state._tax = value.cTax
  state._soli = value.cSoli
  state._market_place = value.cMarketPlace
  state._description = value.cDescription
}
const ok = async (): Promise<void> => {
  console.log('UPDATETRANSFER: ok')
  const currentTransfer = {...records.transfers.all[records.transfers.selected_index]}
  currentTransfer.cDate = new Date(state._date).getTime()
  currentTransfer.cExDay = new Date(state._ex_day).getTime()
  currentTransfer.cUnitQuotation = state._unit_quotation
  currentTransfer.cAmount = state._amount
  currentTransfer.cCount = toNumber(state._count)
  currentTransfer.cFees = state._fees
  currentTransfer.cSTax = state._stax
  currentTransfer.cFTax = state._ftax
  currentTransfer.cTax = state._tax
  currentTransfer.cSoli = state._soli
  currentTransfer.cMarketPlace = state._market_place
  currentTransfer.cDescription = state._description
  if (validators.isoDate(state._date) === true) {
    await records.updateTransfer(currentTransfer)
    records.setDrawerDepot()
    runtime.toggleVisibility()
  }else {
    notice(['UPDATETRANSFER: invalid input'])
  }
}
const title = () => {
  return t('dialogs.updateTransfer.title')
}
const classes = () => {
  return ''
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('UPDATETRANSFER: onMounted')
  setInitialTransfer(records.transfers.all[records.transfers.selected_index])
  runtime.setIsOk(true)
})

console.log('--- UpdateTransfer.vue setup ---')
</script>
