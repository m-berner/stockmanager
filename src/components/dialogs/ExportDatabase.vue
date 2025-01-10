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
      <v-textarea
        v-bind:disabled="true"
        v-bind:modelValue="t('dialogs.exportDialog', { filename: state._file_name })"
        variant="outlined"
      ></v-textarea>
    </v-card-text>
  </v-form>
</template>
<script lang="ts" setup>
import {useRuntimeStore} from '@/stores/runtime'
import {useRecordsStore} from '@/stores/records'
import {onMounted, reactive} from 'vue'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/composables/useApp'

interface IExportDatabase {
  _file_name: string
}

const {t} = useI18n()
const {CONS} = useApp()
const prefix = new Date().toISOString().substring(0, 10)
const fn = `${prefix}_${CONS.DB.VERSION}_${CONS.DB.BKFN}`
const state: IExportDatabase = reactive({
  _file_name: fn
})
const runtime = useRuntimeStore()

const ok = () => {
  console.log('EXPORTDATABASE: ok')
  const records = useRecordsStore()
  const {notice, getUI, offset} = useApp()
  const stringifyDB = (): string => {
    let buffer: string
    let i: number
    buffer = '"stocks":[\n'
    for (i = 0; i < records.stocks.all.length; i++) {
      buffer += JSON.stringify({
        cCompany: records.stocks.all[i].cCompany,
        cISIN: records.stocks.all[i].cISIN,
        cWKN: records.stocks.all[i].cWKN,
        cSym: records.stocks.all[i].cSym,
        cQuarterDay: records.stocks.all[i].cQuarterDay > 0 ? records.stocks.all[i].cQuarterDay + offset() : 0,
        cMeetingDay: records.stocks.all[i].cMeetingDay > 0 ? records.stocks.all[i].cMeetingDay + offset() : 0,
        cFadeOut: records.stocks.all[i].cFadeOut,
        cFirstPage: records.stocks.all[i].cFirstPage,
        cURL: records.stocks.all[i].cURL,
        cID: records.stocks.all[i].cID
      })
      if (i === records.stocks.all.length - 1) {
        buffer += '\n],\n'
      } else {
        buffer += ',\n'
      }
    }
    buffer += i === 0 ? '],\n' : ''
    buffer += '"transfers":[\n'
    for (i = 0; i < records.transfers.all.length; i++) {
      buffer += JSON.stringify({
        cStockID: records.transfers.all[i].cStockID ?? 0,
        cDate: records.transfers.all[i].cDate > 0 ? records.transfers.all[i].cDate + offset() : 0,
        cUnitQuotation: records.transfers.all[i].cUnitQuotation,
        cAmount: records.transfers.all[i].cAmount ?? 0,
        cCount: records.transfers.all[i].cCount ?? 0,
        cFees: records.transfers.all[i].cFees ?? 0,
        cSTax: records.transfers.all[i].cSTax ?? 0,
        cFTax: records.transfers.all[i].cFTax ?? 0,
        cTax: records.transfers.all[i].cTax ?? 0,
        cSoli: records.transfers.all[i].cSoli ?? 0,
        cExDay: records.transfers.all[i].cExDay > 0 ? records.transfers.all[i].cExDay + offset() : 0,
        cMarketPlace: records.transfers.all[i].cMarketPlace,
        cDescription: records.transfers.all[i].cDescription,
        cType: records.transfers.all[i].cType ?? 0
      })
      if (i === records.transfers.all.length - 1) {
        buffer += '\n]\n'
      } else {
        buffer += ',\n'
      }
    }
    buffer += i === 0 ? ']\n' : ''
    return buffer
  }
  let buffer = `{\n"sm": {"cVersion":${browser.runtime.getManifest().version.replace(/\./g, '')}, "cDBVersion":${
    CONS.DB.VERSION
  }, "cDBCurrency":"${getUI().cur}", "cEngine":"indexeddb"},\n`
  buffer += stringifyDB()
  buffer += '}'
  const blob = new Blob([buffer], {type: 'application/json'})
  const blobUrl = URL.createObjectURL(blob)
  const op: browser.downloads._DownloadOptions = {
    url: blobUrl,
    filename: state._file_name
  }
  const onDownloadChange = (change: browser.downloads._OnChangedDownloadDelta): void => {
    console.log('HEADERBAR: onChanged')
    // noinspection JSDeprecatedSymbols
    browser.downloads.onChanged.removeListener(onDownloadChange)
    if (
      (change.state !== undefined && change.id > 0) ||
      (change.state !== undefined && change.state.current === CONS.EVENTS.COMP)
    ) {
      URL.revokeObjectURL(blobUrl)
    }
  }
  // noinspection JSDeprecatedSymbols
  browser.downloads.onChanged.addListener(onDownloadChange) // wait for download changes
  browser.downloads
    .download(op)
    .then(() => {
      console.log('HEADERBAR: onExportDatabase', 'Download started')
    })
    .catch((err: Error) => {
      notice([err.message])
    })
  runtime.toggleVisibility()
}
const title = () => {
  return t('dialogs.exportDatabase.title')
}
const classes = () => {
  return ''
}
defineExpose({ok, title, classes})

onMounted(() => {
  console.log('EXPORTDATABASE: onMounted')
  runtime.setIsOk(true)
})

console.log('--- ExportDatabase.vue setup ---')
</script>
