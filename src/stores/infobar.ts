/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'

interface IInfobarStore {
  _exchanges: Map<string, number>
  _indexes: Map<string, number>
  _materials: Map<string, number>
}

export const useInfobarStore: StoreDefinition<'infobar', IInfobarStore> = defineStore('infobar', {
  state: (): IInfobarStore => {
    return {
      _exchanges: new Map<string, number>(),
      _indexes: new Map<string, number>(),
      _materials: new Map<string, number>()
    }
  },
  getters: {
    exchanges(state: IInfobarStore) {
      return state._exchanges
    },
    indexes(state: IInfobarStore) {
      return state._indexes
    },
    materials(state: IInfobarStore) {
      return state._materials
    }
  },
  actions: {
    setExchanges(entry: Map<string, number>) {
      this._exchanges = entry
    },
    setIndexes(entry: Map<string, number>) {
      this._indexes = entry
    },
    setMaterials(entry: Map<string, number>) {
      this._materials = entry
    }
  }
})

console.log('--- infobar.js ---')
