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
import {useConstants} from '@/libraries/useConstants'
import {useModaldialogStore} from '@/stores/modaldialog'

interface ISellstockStore {
  _date: string
  _count: string
  _unit_quotation: number
  _fees: number
  _stax: number
  _tax: number
  _soli: number
  _market_place: string
}

const CONS = useConstants()
const {toNumber} = useAppLibrary()

export const useSellstockStore: StoreDefinition<'sellstock', ISellstockStore> = defineStore('sellstock', {
  state: (): ISellstockStore => {
    return {
      _date: '',
      _count: '',
      _unit_quotation: 0,
      _fees: 0,
      _stax: 0,
      _tax: 0,
      _soli: 0,
      _market_place: ''
    }
  },
  getters: {
    cDate: (state: ISellstockStore) => {
      return state._date
    },
    cCount: (state: ISellstockStore) => {
      return state._count
    },
    cUnitQuotation: (state: ISellstockStore) => {
      return state._unit_quotation
    },
    cFees: (state: ISellstockStore) => {
      return state._fees
    },
    cSTax: (state: ISellstockStore) => {
      return state._stax
    },
    cTax: (state: ISellstockStore) => {
      return state._tax
    },
    cSoli: (state: ISellstockStore) => {
      return state._soli
    },
    cMarketPlace: (state: ISellstockStore) => {
      return state._market_place
    }
  },
  actions: {
    async sell(): Promise<void> {
      console.log('SELLSTOCK: sell')
      const records = useRecordsStore()
      const modaldialog = useModaldialogStore()
      const {validators} = useVueLibrary()
      const transfer = {
        cStockID: records.stocks.active[records.stocks.active_index].cID,
        cDate: new Date(this._date).getTime(),
        cExDay: 0,
        cUnitQuotation: this._unit_quotation,
        cAmount: 0,
        cCount: -toNumber(this._count),
        cFees: -this._fees,
        cSTax: -this._stax,
        cFTax: -0,
        cTax: -this._tax,
        cSoli: -this._soli,
        cType: CONS.DB.RECORD_TYPES.BUY,
        cMarketPlace: this._market_place,
        cDescription: ''
      }
      if (validators.isoDate(this._date) !== true) {
        this._date = '0000-00-00'
      }
      if (validators.positiveInteger(this._count) !== true) {
        this._count = '0'
      }
      if (validators.positiveInteger(this._count) === true && validators.isoDate(this._date) === true) {
        await records.addTransfer(transfer)
        records.evaluateTransfers()
        records.setDrawerDepot()
        modaldialog.toggleVisibility()
      }
    }
  }
})

console.log('--- sellstock.js ---')
