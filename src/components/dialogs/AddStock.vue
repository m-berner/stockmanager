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
      <v-switch v-model="_auto" color="secondary" hide-details label="Auto" v-on:click="addstock.toggleAuto"></v-switch>
      <v-text-field
        v-model="_isin"
        v-bind:rules="[validators.isin]"
        v-bind:counter="12"
        v-bind:label="t('dialogs.addStock.isin')"
        v-on:update:modelValue="addstock.onIsin"
        v-on:focus="resetValidation"
        variant="outlined"
        required
        autofocus
      ></v-text-field>
      <v-text-field
        v-model="_company"
        v-bind:label="t('dialogs.addStock.company')"
        v-bind:disabled="_auto"
        variant="outlined"
        required
      ></v-text-field>
      <v-text-field
        v-model="_wkn"
        v-bind:label="t('dialogs.addStock.wkn')"
        v-bind:disabled="_auto"
        variant="outlined"
        required
      ></v-text-field>
      <v-text-field
        v-model="_sym"
        v-bind:label="t('dialogs.addStock.symbol')"
        v-bind:disabled="_auto"
        variant="outlined"
        required
      ></v-text-field>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {useModaldialogStore} from '@/stores/modaldialog'
import {useAddstockStore} from '@/stores/dialogs/addstock'
import {useVueLibrary} from '@/libraries/useVue'
import {storeToRefs} from 'pinia'
import {onMounted, useTemplateRef} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const addstock = useAddstockStore()
const {validators, resetValidation} = useVueLibrary()
const {_isin, _company, _wkn, _sym, _auto} = storeToRefs(addstock)
const form = useTemplateRef('form-ref')

onMounted(() => {
  console.log('ADDSTOCK: onMounted')
  form.value?.reset()
  addstock.setAuto(true)
  modaldialog.setNoOk(false)
})

console.log('--- AddStock.vue setup ---')
</script>
