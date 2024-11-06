<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="_date"
              density="compact"
              variant="outlined"
              type="date"
              autofocus
              v-bind:rules="[validators.isoDate]"
              v-bind:label="t('dialogs.updateTransfer.bookDay')"
              v-on:focus="resetValidation"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="_ex_day"
              density="compact"
              variant="outlined"
              type="date"
              v-bind:label="t('dialogs.updateTransfer.exDay')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CurrencyInput
              v-model="_unit_quotation"
              v-bind:options="{ currency: getUI().cur, precision: 5 }"
              v-bind:label="t('dialogs.updateTransfer.unitQuotation')"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="_amount"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.updateTransfer.amount')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="_count"
              density="compact"
              variant="outlined"
              v-bind:label="t('dialogs.updateTransfer.number')"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="_fees"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.updateTransfer.fees')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CurrencyInput
              v-model="_stax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.updateTransfer.sTax')"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="_ftax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.updateTransfer.fTax')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <CurrencyInput
              v-model="_tax"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.updateTransfer.tax')"
            ></CurrencyInput>
          </v-col>
          <v-col cols="6">
            <CurrencyInput
              v-model="_soli"
              v-bind:options="{ currency: getUI().cur }"
              v-bind:label="t('dialogs.updateTransfer.soli')"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="_market_place"
              density="compact"
              variant="outlined"
              v-bind:label="t('dialogs.updateTransfer.marketPlace')"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="_description"
              density="compact"
              variant="outlined"
              v-bind:label="t('dialogs.updateTransfer.description')"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useUpdatetransferStore} from '@/stores/dialogs/updatetransfer'
import {useApp} from '@/useApp'
import {useComponents} from '@/components/lib/useComponents'
import {onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useI18n} from 'vue-i18n'

interface PropsUpdateTransfer {
  initialTransfer: object
}

const {t} = useI18n()
const _props = defineProps<PropsUpdateTransfer>()
const modaldialog = useModaldialogStore()
const updatetransfer = useUpdatetransferStore()
const {getUI} = useApp()
const {validators, resetValidation} = useComponents()
const {
  _date,
  _ex_day,
  _count,
  _amount,
  _fees,
  _unit_quotation,
  _stax,
  _ftax,
  _tax,
  _soli,
  _market_place,
  _description
} = storeToRefs(updatetransfer)

onMounted(() => {
  console.log('UPDATETRANSFER: onMounted')
  updatetransfer.setInitialTransfer(_props.initialTransfer)
  modaldialog.setNoOk(false)
})

console.log('--- UpdateTransfer.vue setup ---')
</script>
