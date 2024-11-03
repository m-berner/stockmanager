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
      <v-file-input
        v-model="_file_name"
        v-bind:clearable="true"
        v-bind:label="t('dialogs.importDatabase.label')"
        variant="outlined"
      ></v-file-input>
    </v-card-text>
  </v-form>
</template>
<script lang="ts" setup>
import {useModaldialogStore} from '@/stores/modaldialog'
import {useImportdatabaseStore} from '@/stores/dialogs/importdatabase'
import {storeToRefs} from 'pinia'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const importdatabase = useImportdatabaseStore()
const {_file_name} = storeToRefs(importdatabase)

onMounted(() => {
  console.log('IMPORTDATABASE: onMounted')
  importdatabase.setFileName([])
  modaldialog.setNoOk(false)
})

console.log('--- ImportDatabase.vue setup ---')
</script>
