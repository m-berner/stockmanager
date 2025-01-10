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
        <v-row justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="state._date"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.addWithdrawal.date')"
              v-bind:rules="[validators.isoDate]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <CurrencyInput
              v-model="state._withdrawal"
              v-bind:label="t('dialogs.addWithdrawal.amount')"
              v-bind:options="{
                currency: getUI().cur,
                precision: 2,
                valueRange: { min: 0 },
                useGrouping: true }"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-radio-group v-model="state._type">
              <v-radio
                v-bind:label="t('dialogs.addWithdrawal.types.transfer')"
                v-bind:value="CONS.RECORDS.TYPES.TRANSFER"
              ></v-radio>
              <v-radio
                v-bind:label="t('dialogs.addWithdrawal.types.fee')"
                v-bind:value="CONS.RECORDS.TYPES.FEE"
              ></v-radio>
              <v-radio
                v-bind:label="t('dialogs.addWithdrawal.types.stax')"
                v-bind:value="CONS.RECORDS.TYPES.STAX"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="6">
            <v-radio-group v-model="state._type">
              <v-radio
                v-bind:label="t('dialogs.addWithdrawal.types.ftax')"
                v-bind:value="CONS.RECORDS.TYPES.FTAX"
              ></v-radio>
              <v-radio
                v-bind:label="t('dialogs.addWithdrawal.types.tax')"
                v-bind:value="CONS.RECORDS.TYPES.TAX"
              ></v-radio>
              <v-radio
                v-bind:label="t('dialogs.addWithdrawal.types.soli')"
                v-bind:value="CONS.RECORDS.TYPES.SOLI"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="state._description"
              density="compact"
              v-bind:label="t('dialogs.addWithdrawal.description')"
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

interface IAddWithdrawal {
  _date: ''
  _type: number
  _withdrawal: number
  _description: string
}

const {t} = useI18n()
const {CONS, getUI, isoDatePlusSeconds, notice, validators} = useApp()
const runtime = useRuntimeStore()
const formRef = useTemplateRef('form-ref')
const state: IAddWithdrawal = reactive({
  _date: '',
  _type: 0,
  _withdrawal: 0,
  _description: ''
})

const ok = async (): Promise<void> => {
  console.log('ADDWITHDRAWAL: ok')
  const records = useRecordsStore()
  const record: IAddTransfer = {
    cStockID: 0,
    cDate: isoDatePlusSeconds(state._date),
    cUnitQuotation: 0,
    cAmount: state._type === CONS.RECORDS.TYPES.TRANSFER ? -state._withdrawal : 0,
    cCount: 0,
    cFees: state._type === CONS.RECORDS.TYPES.FEE ? -state._withdrawal : 0,
    cTax: state._type === CONS.RECORDS.TYPES.TAX ? -state._withdrawal : 0,
    cSTax: state._type === CONS.RECORDS.TYPES.STAX ? -state._withdrawal : 0,
    cFTax: state._type === CONS.RECORDS.TYPES.FTAX ? -state._withdrawal : 0,
    cSoli: state._type === CONS.RECORDS.TYPES.SOLI ? -state._withdrawal : 0,
    cExDay: 0,
    cDescription: state._description,
    cMarketPlace: '',
    cType: CONS.DB.RECORD_TYPES.WITHDRAWAL
  }
  if (Object.values(CONS.RECORDS.TYPES).indexOf(state._type) === -1) {
    notice(['System Error'])
  }
  if (validators.isoDate(state._date) === true) {
    await records.addTransfer(record)
    records.evaluateTransfers()
    runtime.toggleVisibility()
  } else {
    notice(['ADDWITHDRAWAL: Invalid date'])
  }
}
const title = () => {
  return t('dialogs.addWithdrawal.title')
}
const classes = () => {
  return ''
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('ADDWITHDRAWAL: onMounted')
  formRef.value?.reset()  // NOTE: resets v-text-field but not CurrencyInput...
  state._withdrawal = 0
  state._type = CONS.RECORDS.TYPES.TRANSFER
  runtime.setIsOk(true)
})

console.log('--- AddWithdrawal.vue setup ---')
</script>
