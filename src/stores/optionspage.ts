/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'

interface IOptionsPageStore {
  _tab: number
  _tabs_length: number
  _theme_keys: string[]
  _service_keys: string[]
  _index_keys: string[]
  _material_keys: string[]
}

export const useOptionsPageStore: StoreDefinition<'optionspage', IOptionsPageStore> = defineStore('optionspage', {
  state: (): IOptionsPageStore => {
    return {
      _tab: 0,
      _tabs_length: 0,
      _theme_keys: [],
      _service_keys: [],
      _index_keys: [],
      _material_keys: []
    }
  },
  getters: {
    tabsLength: (state: IOptionsPageStore) => {
      return state._tabs_length
    },
    themeKeys: (state: IOptionsPageStore) => {
      return state._theme_keys
    },
    serviceKeys: (state: IOptionsPageStore) => {
      return state._service_keys
    },
    indexKeys: (state: IOptionsPageStore) => {
      return state._index_keys
    },
    materialKeys: (state: IOptionsPageStore) => {
      return state._material_keys
    }
  },
  actions: {
    setTab(value: number) {
      this._tab = value
    },
    setTabsLength(value: number) {
      this._tabs_length = value
    },
    setThemeKeys(value: string[]) {
      this._theme_keys = value
    },
    setServiceKeys(value: string[]) {
      this._service_keys = value
    },
    setIndexKeys(value: string[]) {
      this._index_keys = value
    },
    setMaterialKeys(value: string[]) {
      this._material_keys = value
    }
  }
})

console.log('--- optionspage.js ---')
