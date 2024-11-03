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
        <v-row justify="center">
          <v-col cols="6">
            <v-select
              v-model="_year"
              density="compact"
              variant="outlined"
              v-on:update:modelValue="showaccounting.onYearAccounting"
              v-bind:label="t('dialogs.showAccounting.year')"
              v-bind:items="records.yearRangeTransfers"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              density="compact"
              variant="outlined"
              dirty
              v-bind:label="t('dialogs.showAccounting.returnRate')"
              v-bind:disabled="true"
            >{{ n(_return_rate, 'percent') }}
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              density="compact"
              variant="outlined"
              dirty
              v-bind:label="t('dialogs.showAccounting.efficiency')"
              v-bind:disabled="true"
            >{{ n(_efficiency, 'decimal') }}
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-bind:key="_deposits"
              v-bind:modelValue="_deposits"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
              v-bind:label="t('dialogs.showAccounting.deposits')"
              v-bind:disabled="true"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-bind:key="_withdrawals"
              v-bind:modelValue="_withdrawals"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
              v-bind:label="t('dialogs.showAccounting.withdrawals')"
              v-bind:disabled="true"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-bind:key="_earnings"
              v-bind:modelValue="_earnings"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
              v-bind:label="t('dialogs.showAccounting.earnings')"
              v-bind:disabled="true"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-bind:key="_taxes"
              v-bind:modelValue="_taxes"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
              v-bind:label="t('dialogs.showAccounting.taxes')"
              v-bind:disabled="true"
            ></CurrencyInput>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <CurrencyInput
              v-bind:key="_dividends"
              v-bind:modelValue="_dividends"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
              v-bind:label="t('dialogs.showAccounting.dividends')"
              v-bind:disabled="true"
            ></CurrencyInput>
          </v-col>
          <v-col>
            <CurrencyInput
              v-bind:key="_fees"
              v-bind:modelValue="_fees"
              v-bind:options="{ currency: getUI().cur, precision: 2 }"
              v-bind:label="t('dialogs.showAccounting.fees')"
              v-bind:disabled="true"
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
import {useShowaccountingStore} from '@/stores/dialogs/showaccounting'
import {useRecordsStore} from '@/stores/records'
import {storeToRefs} from 'pinia'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAppLibrary} from '@/libraries/useApp'

const {n, t} = useI18n()
const {getUI} = useAppLibrary()
const modaldialog = useModaldialogStore()
const showaccounting = useShowaccountingStore()
const records = useRecordsStore()
const {_year, _return_rate, _efficiency, _fees, _deposits, _dividends, _withdrawals, _taxes, _earnings} =
  storeToRefs(showaccounting)

onMounted(() => {
  console.log('SHOWACCOUNTING: onMounted')
  showaccounting.setYear(new Date().getFullYear())
  showaccounting.onYearAccounting()
  modaldialog.setNoOk(true)
})

console.log('--- ShowAccounting.vue setup ---')
</script>
