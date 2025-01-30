<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-file-input
        accept=".json"
        v-bind:clearable="true"
        v-bind:label="t('dialogs.importDatabase.label')"
        variant="outlined"
        v-on:change="(ev: EventTarget) => state._choosen_file = ev.target.files[0]"
      ></v-file-input>
    </v-card-text>
  </v-form>
</template>
<script lang="ts" setup>
import {useRecordsStore} from '@/stores/records'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/composables/useApp'
import {useRuntimeStore} from '@/stores/runtime'

interface IImportDatabase {
  _choosen_file: Blob | null
}

interface EventTarget extends HTMLInputElement {
  target: { files: File[] }
}

const {t} = useI18n()
const runtime = useRuntimeStore()
const state: IImportDatabase = {
  _choosen_file: null
}

const ok = async (): Promise<void> => {
  console.log('IMPORTDATABASE: ok', state._choosen_file)
  const {CONS, notice} = useApp()
  const records = useRecordsStore()
  // NOTE: only database version 21.0 or newer could be restored
  await records.cleanStoreAndDatabase()
  // read backup file into records store bkup object
  await new Promise((resolve, reject) => {
    const onError = (err: ErrorEvent): void => {
      notice([err.message])
      reject(err.message)
    }
    const onLoadBackup = (): void => {
      console.log('HEADERBAR: onLoadBackup')
      if (typeof fr.result === 'string') {
        const bkupObject: IBackup = JSON.parse(fr.result)
        if (bkupObject.sm.cDBVersion < CONS.DB.MINVERSION) {
          notice(['HEADERBAR:onLoadBackup', 'Invalid backup file version'])
          reject(new Error('Invalid backup file version'))
        } else {
          records.setBkupObject(bkupObject)
          resolve('Backup file loaded successfully!')
        }
      } else {
        notice(['HOMEPAGE:onLoadBackup', 'Could not read backup file'])
        reject(new Error('Could not read backup file!'))
      }
    }
    const fr: FileReader = new FileReader()
    if (state._choosen_file !== null) {
      fr.readAsText(state._choosen_file, 'UTF-8')
      fr.addEventListener(CONS.EVENTS.LOAD, onLoadBackup, CONS.SYSTEM.ONCE)
      fr.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE)
    }
  })
  records.loadBkupObjectIntoStore()
  records.setActiveStocksPage(1)
  await records.updateWrapper()
  const result = await records.storeIntoDatabase()
  if (result !== '') {
    console.info('IMPORTDATABASE: onLoad', result)
    runtime.toggleVisibility()
    return Promise.resolve()
  } else {
    notice(['IMPORTDATABASE: onLoad', result])
    return Promise.reject('ERROR: database could not be loaded!')
  }
}
const title = () => {
  return t('dialogs.importDatabase.title')
}
const classes = () => {
  return ''
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('IMPORTDATABASE: onMounted')
  runtime.setIsOk(true)
})

console.log('--- ImportDatabase.vue setup ---')
</script>
