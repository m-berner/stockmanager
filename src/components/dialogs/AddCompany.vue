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
      <v-switch v-model="state._auto" color="secondary" hide-details label="Auto"
                v-on:click="state._auto = !state._auto"></v-switch>
      <v-text-field
        v-model="state._isin"
        autofocus
        required
        v-bind:counter="12"
        v-bind:label="t('dialogs.addStock.isin')"
        v-bind:rules="[validators.isin]"
        variant="outlined"
        v-on:focus="formRef?.resetValidation"
        v-on:update:modelValue="onIsin"
      ></v-text-field>
      <v-text-field
        v-model="state._company"
        required
        v-bind:disabled="state._auto"
        v-bind:label="t('dialogs.addStock.company')"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="state._wkn"
        required
        v-bind:disabled="state._auto"
        v-bind:label="t('dialogs.addStock.wkn')"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="state._sym"
        required
        v-bind:disabled="state._auto"
        v-bind:label="t('dialogs.addStock.symbol')"
        variant="outlined"
      ></v-text-field>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {onMounted, reactive, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRecordsStore} from '@/stores/records'
import {useApp} from '@/background'
import {useRuntimeStore} from '@/stores/runtime'

interface IAddStock {
  _isin: string
  _company: string
  _wkn: string
  _sym: string
  _auto: boolean
}

const {t} = useI18n()
const {CONS, notice, validators} = useApp()
const runtime = useRuntimeStore()
const formRef = useTemplateRef('form-ref')
const state: IAddStock = reactive({
  _isin: '',
  _company: '',
  _wkn: '',
  _sym: '',
  _auto: true
})

const onIsin = async (): Promise<void> => {
  console.log('ADDSTOCK: onIsin')
  if (state._isin !== '' && state._isin?.length === 12) {
    const companyDataResponse = await browser.runtime.sendMessage(JSON.stringify({
      type: CONS.FETCH_API.ASK__COMPANY_DATA,
      data: state._isin
    }))
    const companyData = JSON.parse(companyDataResponse).data
    state._company = companyData.company
    state._wkn = companyData.wkn.toUpperCase()
    state._sym = companyData.symbol.toUpperCase()
  }
}

const ok = async (): Promise<void> => {
  console.log('ADDSTOCK: ok')
  const records = useRecordsStore()
  const stock: IAddedStock = {
    cCompany: state._company,
    cISIN: state._isin.toUpperCase(),
    cWKN: state._wkn.toUpperCase(),
    cSym: state._sym,
    cQuarterDay: 0,
    cMeetingDay: 0,
    cFadeOut: 0,
    cFirstPage: 0,
    cURL: ''
  }
  const verify = records.stocks.all.filter((rec: IStock) => {
    return state._isin.toUpperCase() === rec.cISIN.toUpperCase()
  })
  if (verify.length > 0) {
    notice(['ADDSTOCK ERROR: stock exists already'])
  } else {
    await records.addStock(stock)
    runtime.toggleVisibility(CONS.DIALOGS.ADDCOMPANY)
  }
}
const title = t('dialogs.addStock.title')
const classes = () => {
  return ''
}

onMounted(() => {
  console.log('ADDSTOCK: onMounted', formRef)
  formRef.value?.reset()
  state._auto = true
  runtime.setIsOk(true)
})

defineExpose({ok, title, classes})

console.log('--- AddStock.vue setup ---')
</script>
