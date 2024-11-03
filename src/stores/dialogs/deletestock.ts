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

interface IDeletestockStore {
  _deleteable: boolean
}

export const useDeletestockStore: StoreDefinition<'deletestock', IDeletestockStore> = defineStore('deletestock', {
  state: (): IDeletestockStore => {
    return {
      _deleteable: false
    }
  },
  getters: {
    deleteable: (state: IDeletestockStore) => {
      return state._deleteable
    }
  },
  actions: {
    setDeleteable(value: boolean) {
      this._deleteable = value
    },
    async delete(): Promise<void> {
      console.log('DELETESTOCK: delete')
      const records = useRecordsStore()
      const modaldialog = useModaldialogStore()
      await records.deleteStock(records.stocks.active[records.stocks.active_index].cID)
      modaldialog.toggleVisibility()
    }
  }
})

console.log('--- deletestock.js ---')
