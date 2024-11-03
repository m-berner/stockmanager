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
        <v-row justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="_date"
              variant="outlined"
              density="compact"
              type="date"
              v-bind:rules="[validators.isoDate]"
              v-bind:label="t('dialogs.addWithdrawal.date')"
              v-on:focus="resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <CurrencyInput
              v-model="_withdrawal"
              v-bind:options="{
                currency: getUI().cur,
                precision: 2,
                valueRange: { min: 0 },
                useGrouping: true }"
              v-bind:label="t('dialogs.addWithdrawal.amount')"
              v-bind:validator="validators.positiveNumber"
              v-bind:resetValidation="resetValidation"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-radio-group v-model="_type">
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
            <v-radio-group v-model="addwithdrawal.cType">
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
              v-model="_description"
              variant="outlined"
              density="compact"
              v-bind:label="t('dialogs.addWithdrawal.description')"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>
<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useAddwithdrawalStore} from '@/stores/dialogs/addwithdrawal'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'
import {useVueLibrary} from '@/libraries/useVue'
import {storeToRefs} from 'pinia'
import {onMounted, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const CONS = useConstants()
const modaldialog = useModaldialogStore()
const addwithdrawal = useAddwithdrawalStore()
const {_date, _type, _withdrawal, _description} = storeToRefs(addwithdrawal)
const {getUI} = useAppLibrary()
const {validators, resetValidation} = useVueLibrary()
const form = useTemplateRef('form-ref')

// TODO check all dialogs and its reset? form
onMounted(() => {
  console.log('ADDWITHDRAWAL: onMounted')
  form.value?.reset()  // NOTE: resets v-text-field but not CurrencyInput...
  _withdrawal.value = 0
  _type.value = CONS.RECORDS.TYPES.TRANSFER
  modaldialog.setNoOk(false)
})

console.log('--- AddWithdrawal.vue setup ---')
</script>
