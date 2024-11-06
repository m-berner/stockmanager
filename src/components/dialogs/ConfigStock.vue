<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form ref="form-ref" validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="_company"
              variant="outlined"
              density="compact"
              v-bind:label="t('dialogs.configStock.company')"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="_isin"
              variant="outlined"
              density="compact"
              v-bind:rules="[validators.isin]"
              v-bind:label="t('dialogs.configStock.isin')"
              v-on:focus="resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="_wkn"
              variant="outlined"
              density="compact"
              v-bind:rules="[validators.wkn]"
              v-bind:label="t('dialogs.configStock.wkn')"
              v-on:focus="resetValidation"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="_sym"
              variant="outlined"
              density="compact"
              v-bind:label="t('dialogs.configStock.symbol')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-checkbox
              v-model="_first_page"
              variant="outlined"
              hide-details
              v-bind:value="1"
              v-bind:label="t('dialogs.configStock.firstPage')"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="_fade_out"
              variant="outlined"
              hide-details
              v-bind:value="1"
              v-bind:label="t('dialogs.configStock.fadeOut')"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="_quarter_day"
              variant="outlined"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.configStock.qf')"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="_meeting_day"
              variant="outlined"
              density="compact"
              type="date"
              v-bind:label="t('dialogs.configStock.gm')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="_url"
              variant="outlined"
              density="compact"
              v-bind:rules="[validators.url]"
              v-bind:label="t('dialogs.configStock.url')"
              v-on:focus="resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useConfigstockStore} from '@/stores/dialogs/configstock'
import {useComponents} from '@/components/lib/useComponents'
import {useApp} from '@/useApp'
import {storeToRefs} from 'pinia'
import {onMounted, useTemplateRef} from 'vue'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useRecordsStore} from '@/stores/records'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const configstock = useConfigstockStore()
const records = useRecordsStore()
const {dateToISO} = useApp()
const {validators, resetValidation} = useComponents()
const {_company, _isin, _wkn, _sym, _first_page, _fade_out, _quarter_day, _meeting_day, _url} =
  storeToRefs(configstock)
const form = useTemplateRef('form-ref')

onMounted(() => {
  console.log('CONFIGSTOCK: onMounted')
  const currentStock = {...records.stocks.active[records.stocks.active_index]}
  form.value?.reset()
  _company.value = currentStock.cCompany
  _isin.value = currentStock.cISIN
  _wkn.value = currentStock.cWKN
  _sym.value = currentStock.cSym
  _first_page.value = currentStock.cFirstPage
  _fade_out.value = currentStock.cFadeOut
  _meeting_day.value = dateToISO(currentStock.cMeetingDay)
  _quarter_day.value = dateToISO(currentStock.cQuarterDay)
  _url.value = currentStock.cURL
  modaldialog.setNoOk(false)
})

console.log('--- ConfigStock.vue setup ---')
</script>
