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
import {useComponents} from '@/components/lib/useComponents'
import {useApp} from '@/useApp'

interface IBuystockStore {
  _date: string
  _count: string
  _unit_quotation: number
  _fees: number
  _ftax: number
  _market_place: string
}

const {CONS} = useApp()
const {toNumber} = useApp()

export const useBuystockStore: StoreDefinition<'buystock', IBuystockStore> = defineStore('buystock', {
  state: (): IBuystockStore => {
    return {
      _date: '',
      _count: '',
      _unit_quotation: 0,
      _fees: 0,
      _ftax: 0,
      _market_place: ''
    }
  },
  getters: {
    cDate: (state: IBuystockStore) => {
      return state._date
    },
    cCount: (state: IBuystockStore) => {
      return state._count
    },
    cUnitQuotation: (state: IBuystockStore) => {
      return state._unit_quotation
    },
    cFees: (state: IBuystockStore) => {
      return state._fees
    },
    cFTax: (state: IBuystockStore) => {
      return state._ftax
    },
    cMarketPlace: (state: IBuystockStore) => {
      return state._market_place
    }
  },
  actions: {
    async buy(): Promise<void> {
      console.log('BUYSTOCK: buy')
      return new Promise(async (resolve, reject) => {
        const records = useRecordsStore()
        const modaldialog = useModaldialogStore()
        const {validators} = useComponents()
        const transfer = {
          cStockID: records.stocks.active[records.stocks.active_index].cID,
          cDate: new Date(this._date).getTime(),
          cExDay: 0,
          cUnitQuotation: this._unit_quotation,
          cAmount: 0,
          cCount: toNumber(this._count),
          cFees: -this._fees,
          cSTax: -0,
          cFTax: -this._ftax,
          cTax: -0,
          cSoli: -0,
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
          records.updatePage(records.stocks.activePage)
          records.setDrawerDepot()
          modaldialog.toggleVisibility()
          resolve()
        } else {
          reject('BUYSTOCK: invalid error')
        }
      })
    }
  }
})

console.log('--- buystock.js ---')
