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
import {useVueLibrary} from '@/libraries/useVue'

interface IAdddepositStore {
  _date: string
  _type: number
  _deposit: number
  _description: string
}

const {CONS, notice, isoDatePlusSeconds} = useAppLibrary()

export const useAdddepositStore: StoreDefinition<'adddeposit', IAdddepositStore> = defineStore('adddeposit', {
  state: (): IAdddepositStore => {
    return {
      _date: '',
      _type: 0,
      _deposit: 0,
      _description: ''
    }
  },
  getters: {
    //
  },
  actions: {
    async add(): Promise<void> {
      console.log('ADDDEPOSIT: add')
      const {validators} = useVueLibrary()
      const records = useRecordsStore()
      const modaldialog = useModaldialogStore()
      const record: IAddTransfer = {
        cStockID: 0,
        cDate: isoDatePlusSeconds(this._date),
        cUnitQuotation: 0,
        cAmount: this._type === CONS.RECORDS.TYPES.TRANSFER ? this._deposit : 0,
        cCount: 0,
        cFees: this._type === CONS.RECORDS.TYPES.FEE ? this._deposit : 0,
        cTax: this._type === CONS.RECORDS.TYPES.TAX ? this._deposit : 0,
        cSTax: this._type === CONS.RECORDS.TYPES.STAX ? this._deposit : 0,
        cFTax: this._type === CONS.RECORDS.TYPES.FTAX ? this._deposit : 0,
        cSoli: this._type === CONS.RECORDS.TYPES.SOLI ? this._deposit : 0,
        cExDay: 0,
        cDescription: this._description,
        cMarketPlace: '',
        cType: CONS.DB.RECORD_TYPES.DEPOSIT
      }
      if (Object.values(CONS.RECORDS.TYPES).indexOf(this._type) === -1) {
        notice(['System Error'])
      }
      if (validators.isoDate(this._date) === true && validators.positiveNumber(this._deposit) === true) {
        await records.addTransfer(record)
        records.evaluateTransfers()
        modaldialog.toggleVisibility()
      }
    }
  }
})
console.log('--- adddeposit.js ---')
