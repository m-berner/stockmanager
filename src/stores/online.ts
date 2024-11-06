/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useApp} from '@/useApp'

interface IOnlineStore {
  _min_rate_max: Map<number, IOnlineData>
  _materials: Map<string, number>
  _indexes: Map<string, number>
  _exchanges: Map<string, number>
  _dates: Map<number, IGmQfDates>
  _changes: IChange[]
  _add_stock: Partial<IAddStock>
}

interface IOnlineData {
  id: number
  rate: string
  min: string
  max: string
  cur: string
}

const {toNumber} = useApp()

export const useOnlineStore: StoreDefinition<'online', IOnlineStore> = defineStore('online', {
  state: (): IOnlineStore => {
    return {
      _min_rate_max: new Map<number, IOnlineData>(),
      _materials: new Map<string, number>(),
      _indexes: new Map<string, number>(),
      _exchanges: new Map<string, number>(),
      _dates: new Map<number, IGmQfDates>(),
      _changes: [],
      _add_stock: {
        cCompany: '',
        cISIN: '',
        cWKN: '',
        cSym: ''
      }
    }
  },
  getters: {
    dates: (state: IOnlineStore): Map<number, IGmQfDates> => {
      return state._dates
    },
    minRateMax: (state: IOnlineStore): Map<number, IOnlineData> => {
      return state._min_rate_max
    },
    addStock: (state: IOnlineStore): Partial<IAddStock> => {
      return state._add_stock
    },
    indexes: (state: IOnlineStore): Map<string, number> => {
      return state._indexes
    },
    materials: (state: IOnlineStore): Map<string, number> => {
      return state._materials
    },
    exchanges: (state: IOnlineStore): Map<string, number> => {
      return state._exchanges
    },
    changes: (state: IOnlineStore): IChange[] => {
      return state._changes
    }
  },
  actions: {
    setaddStock(value: IAddStock) {
      this._add_stock = value
    },
    setExchanges(value: Map<string, number>) {
      this._exchanges = value
    },
    setExchangesItem(value: TFetch) {
      this._exchanges.set(value.key, value.value)
    },
    setMaterials(value: Map<string, number>) {
      this._materials = value
    },
    setIndexes(value: Map<string, number>) {
      this._indexes = value
    },
    updateExchanges([key, value]): void {
      this._exchanges.set(key, value)
    },
    setChanges(value: IChange[]): void {
      this._changes = value
    },
    setMinRateMax(value: IOnlineData[]): void {
      let factor = 1
      for (let i = 0; i < value.length; i++) {
        if (value[i].cur.includes('USD')) {
          factor = 1 / this._exchanges.get('EURUSD')
        }
        this._min_rate_max.set(value[i].id, {
          min: factor * toNumber(value[i].min),
          max: factor * toNumber(value[i].max),
          rate: factor * toNumber(value[i].rate)
        })
      }
    },
    setDatesData(value: Map<number, IGmQfDates>): void {
      this._dates = value
    }
  }
})

console.log('--- online.js ---')
