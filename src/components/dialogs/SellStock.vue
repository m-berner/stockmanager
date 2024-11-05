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
              v-bind:label="t('dialogs.sellStock.bookDay')"
              v-bind:rules="[validators.isoDate]"
              v-on:focus="resetValidation"
              variant="outlined"
              density="compact"
              type="date"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="_count"
              v-bind:label="t('dialogs.sellStock.count')"
              v-bind:rules="[validators.positiveInteger]"
              v-on:focus="resetValidation"
              variant="outlined"
              density="compact"
              autofocus
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="_unit_quotation"
              v-bind:options="{ currency: getUI().cur, precision: 5 }"
              v-bind:label="t('dialogs.sellStock.unitQuotation')"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="_fees"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.sellStock.fees')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="_stax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.sellStock.stax')"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="_market_place"
              variant="outlined"
              density="compact"
              item-title="marketPlace"
              v-bind:label="t('dialogs.sellStock.marketplace')"
              v-bind:items="settings.markets"
              v-bind:clearable="true"
              v-bind:return-object="true"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="_tax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.sellStock.tax')"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="_soli"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.sellStock.soli')"
            ></CurrencyInput>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useSellstockStore} from '@/stores/dialogs/sellstock'
import {useSettingsStore} from '@/stores/settings'
import {useAppLibrary} from '@/libraries/useApp'
import {useVueLibrary} from '@/libraries/useVue'
import {storeToRefs} from 'pinia'
import {onMounted, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const settings = useSettingsStore()
const sellstock = useSellstockStore()
const {getUI} = useAppLibrary()
const {validators, resetValidation} = useVueLibrary()
const {_date, _count, _unit_quotation, _fees, _stax, _tax, _soli, _market_place} = storeToRefs(sellstock)
const form = useTemplateRef('form-ref')

onMounted(() => {
  console.log('SELLSTOCK: onMounted')
  form.value?.reset()
  _unit_quotation.value = 0
  _fees.value = 0
  _stax.value = 0
  _tax.value = 0
  _soli.value = 0
  modaldialog.setNoOk(false)
})

console.log('--- SellStock.vue setup ---')
</script>
