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
              v-bind:label="t('dialogs.buyStock.bookDay')"
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
              v-bind:label="t('dialogs.buyStock.count')"
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
              v-bind:label="t('dialogs.buyStock.unitQuotation')"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-model="_fees"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.buyStock.fees')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-model="_ftax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.buyStock.ftax')"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <v-select
              v-model="_market_place"
              variant="outlined"
              density="compact"
              item-title="marketPlace"
              v-bind:label="t('dialogs.buyStock.marketplace')"
              v-bind:items="settings.markets"
              v-bind:clearable="true"
              v-bind:return-object="true"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useBuystockStore} from '@/stores/dialogs/buystock'
import {useSettingsStore} from '@/stores/settings'
import {useApp} from '@/useApp'
import {useComponents} from '@/components/lib/useComponents'
import {storeToRefs} from 'pinia'
import {onMounted, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const buystock = useBuystockStore()
const settings = useSettingsStore()
const {getUI} = useApp()
const {validators, resetValidation} = useComponents()
const {_date, _count, _unit_quotation, _fees, _ftax, _market_place} = storeToRefs(buystock)
const form = useTemplateRef('form-ref')

onMounted(() => {
  console.log('BUYSTOCK: onMounted')
  form.value?.reset()
  _unit_quotation.value = 0
  _fees.value = 0
  _ftax.value = 0
  modaldialog.setNoOk(false)
})

console.log('--- BuyStock.vue setup ---')
</script>
