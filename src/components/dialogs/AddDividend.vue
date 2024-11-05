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
              v-model="_date"
              v-bind:label="t('dialogs.addDividend.bookDay')"
              v-bind:rules="[validators.isoDate]"
              v-on:focus="resetValidation"
              variant="outlined"
              density="compact"
              type="date"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="_ex_day"
              v-bind:label="t('dialogs.addDividend.exDay')"
              v-bind:rules="[validators.isoDate]"
              v-on:focus="resetValidation"
              variant="outlined"
              density="compact"
              type="date"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="_count"
              v-bind:label="t('dialogs.addDividend.count')"
              v-bind:rules="[validators.positiveInteger]"
              v-on:focus="resetValidation"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="_unit_quotation"
              v-bind:options="{ currency: getUI().cur, precision: 5 }"
              v-bind:label="t('dialogs.addDividend.unitQuotation')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="_stax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.addDividend.stax')"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="_tax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.addDividend.tax')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="_soli"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.addDividend.soli')"
            ></CurrencyInput>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="_description"
              variant="outlined"
              density="compact"
              v-bind:label="t('dialogs.addDividend.description')"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useAdddividendStore} from '@/stores/dialogs/adddividend'
import {useAppLibrary} from '@/libraries/useApp'
import {useVueLibrary} from '@/libraries/useVue'
import {storeToRefs} from 'pinia'
import {onMounted, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const adddividend = useAdddividendStore()
const {getUI} = useAppLibrary()
const {validators, resetValidation} = useVueLibrary()
const {_date, _ex_day, _count, _unit_quotation, _stax, _tax, _soli, _description} = storeToRefs(adddividend)
const form = useTemplateRef('form-ref')

onMounted(() => {
  console.log('ADDDIVIDEND: onMounted')
  form.value?.reset()
  _unit_quotation.value = 0
  _stax.value = 0
  _tax.value = 0
  _soli.value = 0
  modaldialog.setNoOk(false)
})

console.log('--- AddDividend.vue setup ---')
</script>
