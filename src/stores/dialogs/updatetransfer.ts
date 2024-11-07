/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useApp} from '@/useApp'
import {useRecordsStore} from '@/stores/records'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useComponents} from '@/components/lib/useComponents'

interface IUpdatetransferStore {
  _date: string
  _ex_day: string
  _count: number
  _unit_quotation: number
  _stock_id: number
  _amount: number
  _fees: number
  _stax: number
  _ftax: number
  _tax: number
  _soli: number
  _type: number
  _market_place: string
  _description: string
}

const {toNumber, dateToISO} = useApp()

export const useUpdatetransferStore: StoreDefinition<'updatetransfer', IUpdatetransferStore> = defineStore(
  'updatetransfer',
  {
    state: (): IUpdatetransferStore => {
      return {
        _date: '',
        _ex_day: '',
        _count: 0,
        _unit_quotation: 0,
        _stock_id: 0,
        _amount: 0,
        _fees: 0,
        _stax: 0,
        _ftax: 0,
        _tax: 0,
        _soli: 0,
        _type: 0,
        _market_place: '',
        _description: ''
      }
    },
    getters: {
      //
    },
    actions: {
      setInitialTransfer(value: ITransfer): void {
        this._date = dateToISO(value.cDate)
        this._ex_day = dateToISO(value.cExDay)
        this._count = value.cCount
        this._amount = value.cAmount
        this._fees = value.cFees
        this._unit_quotation = value.cUnitQuotation
        this._stax = value.cSTax
        this._ftax = value.cFTax
        this._tax = value.cTax
        this._soli = value.cSoli
        this._market_place = value.cMarketPlace
        this._description = value.cDescription
      },
      async onUpdate(): Promise<void> {
        console.log('UPDATETRANSFER: update')
        const {validators} = useComponents()
        const records = useRecordsStore()
        const modaldialog = useModaldialogStore()
        const currentTransfer = {...records.transfers.all[records.transfers.index]}
        currentTransfer.cDate = new Date(this._date).getTime()
        currentTransfer.cExDay = new Date(this._ex_day).getTime()
        currentTransfer.cUnitQuotation = this._unit_quotation
        currentTransfer.cAmount = this._amount
        currentTransfer.cCount = toNumber(this._count)
        currentTransfer.cFees = this._fees
        currentTransfer.cSTax = this._stax
        currentTransfer.cFTax = this._ftax
        currentTransfer.cTax = this._tax
        currentTransfer.cSoli = this._soli
        currentTransfer.cMarketPlace = this._market_place
        currentTransfer.cDescription = this._description
        if (validators.isoDate(this._date) === true) {
          await records.updateTransfer(currentTransfer)
          records.evaluateTransfers()
          records.updateWrapper(records.stocks.active_page)
          modaldialog.toggleVisibility()
        }
      }
    }
  }
)

console.log('--- updatetransfer.js ---')
