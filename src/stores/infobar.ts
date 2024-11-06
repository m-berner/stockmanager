/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useRecordsStore} from '@/stores/records'

interface IInfobarStore {
  _drawer_items: Array<Record<string, string>>
}

export const useInfobarStore: StoreDefinition<'infobar', IInfobarStore> = defineStore('infobar', {
  state: (): IInfobarStore => {
    return {
      _drawer_items: []
    }
  },
  getters: {
    drawerItems: (state: IInfobarStore) => {
      return state._drawer_items
    }
  },
  actions: {
    createDrawerItems(): void {
      const records = useRecordsStore()
      console.log('INFOBAR: createDrawerItems')
      const drawerData: Record<string, string> = {
        'winloss': 'Gewinn/Verlust',
        'earnings': 'Aktien-Erlös',
        'deposits': 'Einzahlung',
        'dividends': 'Dividende',
        'withdrawals': 'Auszahlung',
        'fees': 'Gebühr',
        'taxes': 'Steuer',
        'account': 'Handelskonto',
        'depot': 'Depotkonto'
      } //tm('infoBar.drawer')
      const drawerKeys = Object.keys(drawerData)
      this._drawer_items = []
      for (const elem of drawerKeys) {
        //const percent =
        //  elem === 'winloss' ? ' / ' + n(records.transfers.totalController.winlossPercent ?? 0, 'percent') : ''
        this._drawer_items.push({
          title: drawerData[elem],
          value: records.transfers.totalController[elem], // n(records.transfers.totalController[elem], 'currency') + percent,
          class: records.transfers.totalController[elem] < 0 ? elem + '_minus' : elem
        })
      }
    }
  }
})

console.log('--- infobar.js ---')
