/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useRecordsStore} from '@/stores/records'
import {useVueLibrary} from '@/libraries/useVue'
import {useAppLibrary} from '@/libraries/useApp'
import {useModaldialogStore} from '@/stores/modaldialog'

interface IConfigstockStore {
  _company: string
  _isin: string
  _wkn: string
  _sym: string
  _first_page: string
  _fade_out: string
  _quarter_day: string
  _meeting_day: string
  _url: string
}

const {toNumber} = useAppLibrary()

export const useConfigstockStore: StoreDefinition<'configstock', IConfigstockStore> = defineStore('configstock', {
  state: (): IConfigstockStore => {
    return {
      _company: '',
      _isin: '',
      _wkn: '',
      _sym: '',
      _first_page: '',
      _fade_out: '',
      _quarter_day: '',
      _meeting_day: '',
      _url: ''
    }
  },
  getters: {
    cCompany: (state: IConfigstockStore) => {
      return state._company
    },
    cISIN: (state: IConfigstockStore) => {
      return state._isin
    },
    cWKN: (state: IConfigstockStore) => {
      return state._wkn
    },
    cSym: (state: IConfigstockStore) => {
      return state._sym
    },
    cFirstPage: (state: IConfigstockStore) => {
      return state._first_page
    },
    cFadeOut: (state: IConfigstockStore) => {
      return state._fade_out
    },
    cQuarterDay: (state: IConfigstockStore) => {
      return state._quarter_day
    },
    cMeetingDay: (state: IConfigstockStore) => {
      return state._meeting_day
    },
    cURL: (state: IConfigstockStore) => {
      return state._url
    }
  },
  actions: {
    async configure(): Promise<void> {
      console.log('CONFIGSTOCK: configure')
      return new Promise(async (resolve, reject) => {
        const records = useRecordsStore()
        const modaldialog = useModaldialogStore()
        const {validators} = useVueLibrary()
        const stock: IStock = {...records.stocks.active[records.stocks.active_index]}
        if ((stock.mPortfolio ?? 0) > 0.9 && this._fade_out !== '0') {
          this._fade_out = '0'
        }
        if (
          validators.isin(this._isin) === true &&
          validators.wkn(this._wkn) === true &&
          validators.url(this._url) === true
        ) {
          stock.cCompany = this._company
          stock.cISIN = this._isin
          stock.cWKN = this._wkn
          stock.cSym = this._sym
          stock.cFirstPage = toNumber(this._first_page)
          stock.cFadeOut = toNumber(this._fade_out)
          stock.cMeetingDay = new Date(this._meeting_day).getTime()
          stock.cQuarterDay = new Date(this._quarter_day).getTime()
          stock.cURL = this._url
          await records.updateStock(stock)
          records.evaluateTransfers()
          modaldialog.toggleVisibility()
          resolve()
        } else {
          console.error('VALIDATION?')
          reject('CONFIGSTOCK: validation failed!')
        }
      })
    }
  }
})

console.log('--- configstock.js ---')
