/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useRecordsStore} from '@/stores/records'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useAppLibrary} from '@/libraries/useApp'

interface IAddstockStore {
  _isin: string
  _company: string
  _wkn: string
  _sym: string
  _auto: boolean
}

const {CONS} = useAppLibrary()

export const useAddstockStore: StoreDefinition<'addstock', IAddstockStore> = defineStore('addstock', {
  state: (): IAddstockStore => {
    return {
      _isin: '',
      _company: '',
      _wkn: '',
      _sym: '',
      _auto: true
    }
  },
  getters: {
    // auto: (state: IAddstockStore) => {
    //   return state._auto
    // }
  },
  actions: {
    // toogleAuto(): void {
    //   this._auto = !this._auto
    // },
    setAuto(value: boolean) {
      this._auto = value
    },
    setWKN(value: string) {
      this._wkn = value
    },
    setCompany(value: string) {
      this._company = value
    },
    setSymbol(value: string) {
      this._sym = value
    },
    async add(): Promise<void> {
      console.log('ADDSTOCK: add')
      const records = useRecordsStore()
      const modaldialog = useModaldialogStore()
      const stock: IAddStock = {
        cCompany: this._company,
        cISIN: this._isin.toUpperCase(),
        cWKN: this._wkn.toUpperCase(),
        cSym: this._sym,
        cQuarterDay: 0,
        cMeetingDay: 0,
        cFadeOut: 0,
        cFirstPage: 0,
        cURL: ''
      }
      const verify = records.stocks.all.filter((rec: IStock) => {
        return this._isin.toUpperCase() === rec.cISIN.toUpperCase()
      })
      if (verify.length > 0) {
        throw new Error('Error: Stock exists already')
      } else {
        await records.addStock(stock)
        modaldialog.toggleVisibility(CONS.DIALOGS.ADDSTOCK)
      }
    },
    async onIsin(): Promise<void> {
      console.log('ADDSTOCK: onIsin')
      if (this._isin !== null && this._isin.length === 12) {
        await browser.runtime.sendMessage({
          type: CONS.FETCH_API.ASK__COMPANY_DATA,
          data: this._isin
        })
      }
    }
  }
})
console.log('--- addstock.js ---')
