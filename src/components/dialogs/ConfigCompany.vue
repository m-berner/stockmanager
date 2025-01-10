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
              v-model="state._company"
              density="compact"
              v-bind:label="t('dialogs.configStock.company')"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="state._isin"
              density="compact"
              v-bind:label="t('dialogs.configStock.isin')"
              v-bind:rules="[validators.isin]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="state._wkn"
              density="compact"
              v-bind:label="t('dialogs.configStock.wkn')"
              v-bind:rules="[validators.wkn]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="state._sym"
              density="compact"
              v-bind:label="t('dialogs.configStock.symbol')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-checkbox
              v-model="state._first_page"
              hide-details
              v-bind:label="t('dialogs.configStock.firstPage')"
              v-bind:value="1"
              variant="outlined"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="state._fade_out"
              hide-details
              v-bind:label="t('dialogs.configStock.fadeOut')"
              v-bind:value="1"
              variant="outlined"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="state._quarter_day"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.configStock.qf')"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="state._meeting_day"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.configStock.gm')"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="state._url"
              density="compact"
              v-bind:label="t('dialogs.configStock.url')"
              v-bind:rules="[validators.url]"
              variant="outlined"
              v-on:focus="formRef?.resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useApp} from '@/composables/useApp'
import {onMounted, reactive, useTemplateRef} from 'vue'
import {useRecordsStore} from '@/stores/records'
import {useI18n} from 'vue-i18n'
import {useRuntimeStore} from '@/stores/runtime'

interface IConfigStock {
  _company: string
  _isin: string
  _wkn: string
  _sym: string
  _first_page: string
  _fade_out: string
  _quarter_day: string
  _meeting_day: string
  _url: string
}

const {t} = useI18n()
const runtime = useRuntimeStore()
const records = useRecordsStore()
const {dateToISO, notice, toNumber, validators} = useApp()
const formRef = useTemplateRef('form-ref')
const state: IConfigStock = reactive({
  _company: '',
  _isin: '',
  _wkn: '',
  _sym: '',
  _first_page: '',
  _fade_out: '',
  _quarter_day: '',
  _meeting_day: '',
  _url: ''
})

const ok = async (): Promise<void> => {
  console.log('CONFIGSTOCK: ok')
  const records = useRecordsStore()
  const stock: IStock = records.stocks.active[records.stocks.active_index]
  if ((stock.mPortfolio ?? 0) > 0.9 && state._fade_out !== '0') {
    state._fade_out = '0'
  }
  if (
    validators.isin(state._isin) === true &&
    validators.wkn(state._wkn) === true &&
    validators.url(state._url) === true
  ) {
    const indexOfActiveStock = records._stocks.active.findIndex((activeStock: IStock) => {
      return stock.cID === activeStock.cID
    })
    if (indexOfActiveStock > -1 && toNumber(state._fade_out) === 1) {
      records._stocks.active.splice(indexOfActiveStock, 1)
      records._stocks.passive.push(stock)
    }

    stock.cCompany = state._company
    stock.cISIN = state._isin
    stock.cWKN = state._wkn
    stock.cSym = state._sym
    stock.cFirstPage = toNumber(state._first_page)
    stock.cFadeOut = toNumber(state._fade_out)
    stock.cMeetingDay = new Date(state._meeting_day).getTime()
    stock.cQuarterDay = new Date(state._quarter_day).getTime()
    stock.cURL = state._url

    records._sortActiveStocks()
    await records.updateStock(stock)
    records.evaluateTransfers()
    records.setDrawerDepot()
    runtime.toggleVisibility()
  } else {
    notice(['CONFIGSTOCK: validation failed!'])
  }
}
const title = () => {
  return t('dialogs.configStock.title', {
    company: records.stocks.active[records.stocks.active_index].cCompany
  })
}
const classes = () => {
  return ''
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('CONFIGSTOCK: onMounted')
  const currentStock = {...records.stocks.active[records.stocks.active_index]}
  formRef.value?.reset()
  state._company = currentStock.cCompany
  state._isin = currentStock.cISIN
  state._wkn = currentStock.cWKN
  state._sym = currentStock.cSym
  state._first_page = currentStock.cFirstPage
  state._fade_out = currentStock.cFadeOut
  state._meeting_day = dateToISO(currentStock.cMeetingDay)
  state._quarter_day = dateToISO(currentStock.cQuarterDay)
  state._url = currentStock.cURL
  runtime.setIsOk(true)
})

console.log('--- ConfigStock.vue setup ---')
</script>
