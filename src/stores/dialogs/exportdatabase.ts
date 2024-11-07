/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useRecordsStore} from '@/stores/records'
import {useApp} from '@/useApp'
import {useModaldialogStore} from '../modaldialog'

interface IExportdatabaseStore {
  _file_name: string
}

const {CONS} = useApp()
const {notice, getUI, offset} = useApp()
const prefix = new Date().toISOString().substring(0, 10)
const fn = `${prefix}_${CONS.DB.VERSION}_${CONS.DB.BKFN}`

export const useExportdatabaseStore: StoreDefinition<'exportdatabase', IExportdatabaseStore> = defineStore(
  'exportdatabase',
  {
    state: (): IExportdatabaseStore => {
      return {
        _file_name: fn
      }
    },
    getters: {
      fileName: (state: IExportdatabaseStore) => {
        return state._file_name
      }
    },
    actions: {
      export(): void {
        console.log('EXPORTDATABASE: export')
        const records = useRecordsStore()
        const modaldialog = useModaldialogStore()
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
        const op = {
          url: blobUrl,
          filename: this._file_name
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
        modaldialog.toggleVisibility()
      }
    }
  }
)

console.log('--- exportdatabase.js ---')
