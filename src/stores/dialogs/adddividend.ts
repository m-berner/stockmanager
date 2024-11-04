/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useVueLibrary} from '@/libraries/useVue'
import {useAppLibrary} from '@/libraries/useApp'
import {useRecordsStore} from '@/stores/records'

interface IAdddividendStore {
  _date: string
  _ex_day: string
  _count: string
  _deposit: number
  _unit_quotation: number
  _stax: number
  _tax: number
  _soli: number
  _description: string
}

const {CONS, toNumber} = useAppLibrary()

export const useAdddividendStore: StoreDefinition<'adddividend', IAdddividendStore> = defineStore('adddividend', {
  state: (): IAdddividendStore => {
    return {
      _date: '',
      _ex_day: '',
      _count: '',
      _deposit: 0,
      _unit_quotation: 0,
      _stax: 0,
      _tax: 0,
      _soli: 0,
      _description: ''
    }
  },
  getters: {
    cDate: (state: IAdddividendStore) => {
      return state._date
    },
    cExDay: (state: IAdddividendStore) => {
      return state._ex_day
    },
    cCount: (state: IAdddividendStore) => {
      return state._count
    },
    cDeposit: (state: IAdddividendStore) => {
      return state._deposit
    },
    cUnitQuotation: (state: IAdddividendStore) => {
      return state._unit_quotation
    },
    cSTax: (state: IAdddividendStore) => {
      return state._stax
    },
    cTax: (state: IAdddividendStore) => {
      return state._tax
    },
    cSoli: (state: IAdddividendStore) => {
      return state._soli
    },
    cDescription: (state: IAdddividendStore) => {
      return state._description
    }
  },
  actions: {
    async add(): Promise<void> {
      console.log('ADDDIVIDEND: add')
      return await new Promise(async (resolve) => {
        const records = useRecordsStore()
        const modaldialog = useModaldialogStore()
        const {validators} = useVueLibrary()
        const transfer = {
          cStockID: records.stocks.active[records.stocks.active_index].cID,
          cDate: new Date(this._date).getTime(),
          cExDay: new Date(this._ex_day).getTime(),
          cUnitQuotation: toNumber(this._unit_quotation),
          cAmount: 0,
          cCount: toNumber(this._count),
          cFees: 0,
          cSTax: -toNumber(this._stax),
          cFTax: 0,
          cTax: -toNumber(this._tax),
          cSoli: -toNumber(this._soli),
          cType: CONS.DB.RECORD_TYPES.DIV,
          cMarketPlace: '',
          cDescription: this._description
        }
        if (validators.isoDate(this._date) !== true) {
          this._date = '0000-00-00'
        }
        if (validators.isoDate(this._ex_day) !== true) {
          this._date = '0000-00-00'
        }
        if (validators.positiveInteger(this._count) !== true) {
          this._count = '0'
        }
        if (
          validators.positiveInteger(this._count) === true &&
          validators.isoDate(this._date) === true &&
          validators.isoDate(this._ex_day) === true
        ) {
          await records.addTransfer(transfer, records.stocks.active[records.stocks.active_index].cCompany)
          records.updatePage(records.stocks.active_page)
          records.setDrawerDepot()
          modaldialog.toggleVisibility()
          resolve()
        }
      })
    }
  }
})

console.log('--- adddividend.js ---')
