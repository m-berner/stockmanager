/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useRecordsStore} from '@/stores/records'
import {useConstants} from '@/libraries/useConstants'
import {useModaldialogStore} from '@/stores/modaldialog'

interface IFadeinstockStore {
  _selected: IStock
}

const CONS = useConstants()

export const useFadeinstockStore: StoreDefinition<'fadeinstock', IFadeinstockStore> = defineStore('fadeinstock', {
  state: (): IFadeinstockStore => {
    return {
      _selected: CONS.RECORDS.TEMPLATES.STOCK
    }
  },
  getters: {
    //
  },
  actions: {
    onSelect(): void {
      console.log('FADEINSTOCK: onSelect')
      this._selected.cFadeOut = 0
    },
    reset(): void {
      console.log('FADEINSTOCK: reset')
      this._selected = CONS.RECORDS.TEMPLATES.STOCK
    },
    async onOk(): Promise<void> {
      console.log('FADEINSTOCK: onOk')
      return await new Promise(async (resolve) => {
        const records = useRecordsStore()
        const modaldialog = useModaldialogStore()
        await records.updateStock(this._selected)
        modaldialog.toggleVisibility()
        resolve()
      })
    }
  }
})
console.log('--- fadeinstock.js ---')
