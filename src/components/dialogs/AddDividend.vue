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
              v-bind:label="t('dialogs.addDividend.bookDay')"
              v-bind:rules="[validators.isoDate]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="state._ex_day"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.addDividend.exDay')"
              v-bind:rules="[validators.isoDate]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="state._count"
              density="compact"
              v-bind:label="t('dialogs.addDividend.count')"
              v-bind:rules="[validators.positiveInteger]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="state._unit_quotation"
              v-bind:label="t('dialogs.addDividend.unitQuotation')"
              v-bind:options="{ currency: getUI().cur, precision: 5 }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._stax"
              v-bind:label="t('dialogs.addDividend.stax')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="state._tax"
              v-bind:label="t('dialogs.addDividend.tax')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="state._soli"
              v-bind:label="t('dialogs.addDividend.soli')"
              v-bind:options="{ currency: getUI().cur }"
            ></CurrencyInput>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="state._description"
              density="compact"
              v-bind:label="t('dialogs.addDividend.description')"
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

interface IAddDividend {
  _date: string
  _ex_day: string
  _count: string
  _deposit: number
  _unit_quotation: number
  _stax: number
  _tax: number
  _soli: number
  _description: string
}

const {t} = useI18n()
const runtime = useRuntimeStore()
const records = useRecordsStore()
const {CONS, getUI, notice, toNumber, validators} = useApp()
const formRef = useTemplateRef('form-ref')
const state: IAddDividend = reactive({
  _date: '',
  _ex_day: '',
  _count: '',
  _deposit: 0,
  _unit_quotation: 0,
  _stax: 0,
  _tax: 0,
  _soli: 0,
  _description: ''
})
// TODO use booking date instead of exday for totalController calc
// TODO use exday for show dividend calc
const ok = async (): Promise<void> => {
  console.log('ADDDIVIDEND: ok')
  const records = useRecordsStore()
  const transfer = {
    cStockID: records.stocks.active[records.stocks.active_index].cID,
    cDate: new Date(state._date).getTime(),
    cExDay: new Date(state._ex_day).getTime(),
    cUnitQuotation: toNumber(state._unit_quotation),
    cAmount: 0,
    cCount: toNumber(state._count),
    cFees: 0,
    cSTax: -toNumber(state._stax),
    cFTax: 0,
    cTax: -toNumber(state._tax),
    cSoli: -toNumber(state._soli),
    cType: CONS.DB.RECORD_TYPES.DIV,
    cMarketPlace: '',
    cDescription: state._description
  }
  if (
    validators.positiveInteger(state._count) === true &&
    validators.isoDate(state._date) === true &&
    validators.isoDate(state._ex_day) === true
  ) {
    await records.addTransfer(transfer, records.stocks.active[records.stocks.active_index].cCompany)
    records.setDrawerDepot()
    runtime.toggleVisibility()
  } else {
    notice(['ADDDIVIDEND: invalid input'])
  }
}
const title = () => {
  return t('dialogs.addDividend.title', {
    company: records.stocks.active[records.stocks.active_index].cCompany
  })
}
const classes = () => {
  return 'align-center justify-content'
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('ADDDIVIDEND: onMounted')
  formRef.value?.reset()
  state._unit_quotation = 0
  state._stax = 0
  state._tax = 0
  state._soli = 0
  runtime.setIsOk(true)
})

console.log('--- AddDividend.vue setup ---')
</script>
