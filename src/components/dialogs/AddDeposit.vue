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
              type="date"
              density="compact"
              v-bind:rules="[validators.isoDate]"
              v-bind:label="t('dialogs.addDeposit.date')"
              v-on:focus="resetValidation"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <CurrencyInput
              v-model="_deposit"
              v-bind:options="{
              currency: getUI().cur,
              precision: 2,
              valueRange: { min: 0 },
              useGrouping: true
              }"
              v-bind:label="t('dialogs.addDeposit.amount')"
              v-bind:validator="validators.positiveNumber"
              v-bind:resetValidation="resetValidation"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-radio-group v-model="_type">
              <v-radio
                v-bind:label="t('dialogs.addDeposit.types.transfer')"
                v-bind:value="CONS.RECORDS.TYPES.TRANSFER"
              ></v-radio>
              <v-radio
                v-bind:label="t('dialogs.addDeposit.types.fee')"
                v-bind:value="CONS.RECORDS.TYPES.FEE">
              </v-radio>
              <v-radio
                v-bind:label="t('dialogs.addDeposit.types.stax')"
                v-bind:value="CONS.RECORDS.TYPES.STAX"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="6">
            <v-radio-group v-model="_type">
              <v-radio
                v-bind:label="t('dialogs.addDeposit.types.ftax')"
                v-bind:value="CONS.RECORDS.TYPES.FTAX"
              ></v-radio>
              <v-radio
                v-bind:label="t('dialogs.addDeposit.types.tax')"
                v-bind:value="CONS.RECORDS.TYPES.TAX">
              </v-radio>
              <v-radio
                v-bind:label="t('dialogs.addDeposit.types.soli')"
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
              v-bind:label="t('dialogs.addDeposit.description')"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import CurrencyInput from '@/components/CurrencyInput.vue'
import {useAdddepositStore} from '@/stores/dialogs/adddeposit'
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'
import {useVueLibrary} from '@/libraries/useVue'
import {storeToRefs} from 'pinia'
import {onMounted, useTemplateRef} from 'vue'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const CONS = useConstants()
const adddeposit = useAdddepositStore()
const modaldialog = useModaldialogStore()
const {_date, _type, _deposit, _description} = storeToRefs(adddeposit)
const {getUI} = useAppLibrary()
const {validators, resetValidation} = useVueLibrary()
const form = useTemplateRef('form-ref')

onMounted(() => {
  console.log('ADDDEPOSIT: onMounted')
  form.value?.reset()
  _deposit.value = 0
  _type.value = CONS.RECORDS.TYPES.TRANSFER
  modaldialog.setNoOk(false)
})

console.log('--- AddDeposit.vue setup ---')
</script>
