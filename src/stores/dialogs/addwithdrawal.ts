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
import {useComponents} from '@/components/lib/useComponents'
import {useModaldialogStore} from '@/stores/modaldialog'

interface IAddwithdrawalStore {
  _date: ''
  _type: number
  _withdrawal: number
  _description: string
  //_visibility: boolean
}

const {CONS, notice, isoDatePlusSeconds} = useApp()

export const useAddwithdrawalStore: StoreDefinition<'addwithdrawal', IAddwithdrawalStore> = defineStore(
  'addwithdrawal',
  {
    state: (): IAddwithdrawalStore => {
      return {
        _date: '',
        _type: 0,
        _withdrawal: 0,
        _description: ''
        //_visibility: false
      }
    },
    getters: {
      // visibility: (state: IAddwithdrawalStore) => {
      //   return state._visibility
      // }
    },
    actions: {
      async add(): Promise<void> {
        console.log('ADDWITHDRAWAL: add')
        return new Promise(async (resolve, reject) => {
          const {validators} = useComponents()
          const records = useRecordsStore()
          const modaldialog = useModaldialogStore()
          const record: IAddTransfer = {
            cStockID: 0,
            cDate: isoDatePlusSeconds(this._date),
            cUnitQuotation: 0,
            cAmount: this._type === CONS.RECORDS.TYPES.TRANSFER ? -this._withdrawal : 0,
            cCount: 0,
            cFees: this._type === CONS.RECORDS.TYPES.FEE ? -this._withdrawal : 0,
            cTax: this._type === CONS.RECORDS.TYPES.TAX ? -this._withdrawal : 0,
            cSTax: this._type === CONS.RECORDS.TYPES.STAX ? -this._withdrawal : 0,
            cFTax: this._type === CONS.RECORDS.TYPES.FTAX ? -this._withdrawal : 0,
            cSoli: this._type === CONS.RECORDS.TYPES.SOLI ? -this._withdrawal : 0,
            cExDay: 0,
            cDescription: this._description,
            cMarketPlace: '',
            cType: CONS.DB.RECORD_TYPES.WITHDRAWAL
          }
          if (Object.values(CONS.RECORDS.TYPES).indexOf(this._type) === -1) {
            notice(['System Error'])
          }
          if (validators.isoDate(this._date) === true && validators.positiveNumber(this._withdrawal) === true) {
            await records.addTransfer(record)
            records.evaluateTransfers()
            modaldialog.toggleVisibility()
            resolve()
          } else {
            reject('ADDWITHDRAWAL: Invalid date')
          }
        })
      }
    }
  }
)

console.log('--- addwithdrawal.js ---')
