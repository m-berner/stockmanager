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
      <v-textarea
        v-bind:disabled="true"
        v-bind:modelValue="t('dialogs.exportDialog', { filename: _file_name })"
        variant="outlined"
      ></v-textarea>
    </v-card-text>
  </v-form>
</template>
<script lang="ts" setup>
import {useExportdatabaseStore} from '@/stores/dialogs/exportdatabase'
import {storeToRefs} from 'pinia'
import {useModaldialogStore} from '@/stores/modaldialog'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const modaldialog = useModaldialogStore()
const exportdatabase = useExportdatabaseStore()
const {_file_name} = storeToRefs(exportdatabase)

onMounted(() => {
  console.log('EXPORTDATABASE: onMounted')
  modaldialog.setNoOk(false)
})

console.log('--- ExportDatabase.vue setup ---')
</script>
