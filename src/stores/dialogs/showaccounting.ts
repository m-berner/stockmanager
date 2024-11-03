/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useConstants} from '@/libraries/useConstants'
import {useRecordsStore} from '@/stores/records'

interface IShowaccountingStore {
  _return_rate: number
  _efficiency: number
  _year: number
  _deposits: number
  _withdrawals: number
  _fees: number
  _taxes: number
  _dividends: number
  _earnings: number
}

const CONS = useConstants()

export const useShowaccountingStore: StoreDefinition<'showaccounting', IShowaccountingStore> = defineStore(
  'showaccounting',
  {
    state: (): IShowaccountingStore => {
      return {
        _return_rate: 0,
        _efficiency: 0,
        _year: new Date().getFullYear(),
        _deposits: 0,
        _withdrawals: 0,
        _fees: 0,
        _taxes: 0,
        _dividends: 0,
        _earnings: 0
      }
    },
    getters: {
      returnRate: (state: IShowaccountingStore) => {
        return state._return_rate
      },
      efficiency: (state: IShowaccountingStore) => {
        return state._efficiency
      },
      year: (state: IShowaccountingStore) => {
        return state._year
      },
      deposits: (state: IShowaccountingStore) => {
        return state._deposits
      },
      withdrawals: (state: IShowaccountingStore) => {
        return state._withdrawals
      },
      fees: (state: IShowaccountingStore) => {
        return state._fees
      },
      taxes: (state: IShowaccountingStore) => {
        return state._taxes
      },
      dividends: (state: IShowaccountingStore) => {
        return state._dividends
      },
      earnings: (state: IShowaccountingStore) => {
        return state._earnings
      }
    },
    actions: {
      setYear(value: number) {
        this._year = value
      },
      onYearAccounting(): void {
        console.info('SHOWACCOUNTING: onYearAccounting', this._year)
        const records = useRecordsStore()
        const a = records.evaluateTransfers(this._year)
        const b =
          this._year === records.firstYearTransfers
            ? CONS.RECORDS.CONTROLLER.TOTAL
            : records.evaluateTransfers(this._year - 1)
        this._return_rate =
          a.deposits + a.withdrawals + (b.deposits + b.withdrawals) / 2 !== 0
            ? (a.earnings - b.earnings + a.dividends - b.dividends + a.taxes - b.taxes + a.fees - b.fees) /
            (a.deposits + a.withdrawals + (b.deposits + b.withdrawals) / 2)
            : 0
        this._efficiency = a.taxes + a.fees !== 0 ? (a.earnings + a.dividends) / -(a.taxes + a.fees) : 0
        this._taxes = a.taxes - b.taxes
        this._fees = a.fees - b.fees
        this._dividends = a.dividends - b.dividends
        this._withdrawals = a.withdrawals - b.withdrawals
        this._earnings = a.earnings - b.earnings
        this._deposits = a.deposits - b.deposits
      }
    }
  }
)

console.log('--- showaccounting.js ---')
