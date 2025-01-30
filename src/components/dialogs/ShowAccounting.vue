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
        <v-row justify="center">
          <v-col cols="6">
            <v-select
              v-model="state._year"
              density="compact"
              v-bind:items="records.yearRangeTransfers()"
              v-bind:label="t('dialogs.showAccounting.year')"
              variant="outlined"
              v-on:update:modelValue="onUpdate"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              density="compact"
              dirty
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.returnRate')"
              variant="outlined"
            >{{ n(state._return_rate, 'percent') }}
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              density="compact"
              dirty
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.efficiency')"
              variant="outlined"
            >{{ n(state._efficiency, 'decimal') }}
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-bind:key="state._deposits"
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.deposits')"
              v-bind:modelValue="state._deposits"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-bind:key="state._withdrawals"
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.withdrawals')"
              v-bind:modelValue="state._withdrawals"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-bind:key="state._earnings"
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.earnings')"
              v-bind:modelValue="state._earnings"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-bind:key="state._taxes"
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.taxes')"
              v-bind:modelValue="state._taxes"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-bind:key="state._dividends"
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.dividends')"
              v-bind:modelValue="state._dividends"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-bind:key="state._fees"
              v-bind:disabled="true"
              v-bind:label="t('dialogs.showAccounting.fees')"
              v-bind:modelValue="state._fees"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
            ></CurrencyInput>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>
<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useRecordsStore} from '@/stores/records'
import {onMounted, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/composables/useApp'
import {useRuntimeStore} from '@/stores/runtime'

const {n, t} = useI18n()
const {getUI} = useApp()
const runtime = useRuntimeStore()
const records = useRecordsStore()

interface IShowAccounting {
  _return_rate: number
  _efficiency: number
  _year: number
  _deposits: number
  _withdrawals: number
  _fees: number
  _taxes: number
  _dividends: number
  _earnings: number
}

const state: IShowAccounting = reactive({
  _return_rate: 0,
  _efficiency: 0,
  _year: new Date().getFullYear(),
  _deposits: 0,
  _withdrawals: 0,
  _fees: 0,
  _taxes: 0,
  _dividends: 0,
  _earnings: 0
})

const onUpdate = (): void => {
  console.info('SHOWACCOUNTING: onYearAccounting', state._year)
  const {CONS} = useApp()
  const a = records.evaluateTransfers(state._year)
  const b =
    state._year === records.initialYearTransfers()
      ? CONS.RECORDS.CONTROLLER.TOTAL
      : records.evaluateTransfers(state._year - 1)
  state._return_rate =
    a.deposits + a.withdrawals + (b.deposits + b.withdrawals) / 2 !== 0
      ? (a.earnings - b.earnings + a.dividends - b.dividends + a.taxes - b.taxes + a.fees - b.fees) /
      (a.deposits + a.withdrawals + (b.deposits + b.withdrawals) / 2)
      : 0
  state._efficiency = a.taxes + a.fees !== 0 ? (a.earnings - b.earnings) + (a.dividends - b.dividends) / -(a.taxes + a.fees) : 0
  state._taxes = a.taxes - b.taxes
  state._fees = a.fees - b.fees
  state._dividends = a.dividends - b.dividends
  state._withdrawals = a.withdrawals - b.withdrawals
  state._earnings = a.earnings - b.earnings
  state._deposits = a.deposits - b.deposits
}
const title = () => {
  return t('dialogs.showAccounting.title')
}
const classes = () => {
  return ''
}
defineExpose({title, classes})

onMounted(() => {
  console.log('SHOWACCOUNTING: onMounted')
  state._year = new Date().getFullYear()
  onUpdate()
  runtime.setIsOk(false)
})

console.log('--- ShowAccounting.vue setup ---')
</script>
