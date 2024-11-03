/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'

interface IRuntimeStore {
  _stocks_loading: boolean
  _show_partial_drawer: boolean
  _show_stock_table: boolean
  _table: string
  _dates_for_page: boolean[]
}

export const useRuntimeStore: StoreDefinition<'runtime', IRuntimeStore> = defineStore('runtime', {
  state: (): IRuntimeStore => {
    return {
      _stocks_loading: false,
      _show_partial_drawer: true,
      _show_stock_table: false,
      _table: 'StocksTable',
      _dates_for_page: []
    }
  },
  getters: {
    stocksLoading: (state: IRuntimeStore) => {
      return state._stocks_loading
    },
    showTable: (state: IRuntimeStore) => {
      return state._show_stock_table
    },
    table: (state: IRuntimeStore) => {
      return state._table
    },
    showPartialDrawer: (state: IRuntimeStore) => {
      return state._show_partial_drawer
    },
    datesForPage: (state: IRuntimeStore) => {
      return state._dates_for_page
    }
  },
  actions: {
    toggleShowStockTable() {
      const tmp: boolean = Boolean(this._show_stock_table)
      this._show_stock_table = !tmp
    },
    setTable(value: string) {
      this._table = value
    },
    setStocksLoading(value: boolean) {
      this._stocks_loading = value
    },
    setShowPartialDrawer(value: boolean) {
      this._show_partial_drawer = value
    },
    updateDatesForPage(index: number, value: boolean) {
      this._dates_for_page[index] = value
    }
  }
})

console.log('--- runtime.js ---')
