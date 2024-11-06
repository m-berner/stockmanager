/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {type ThemeInstance} from 'vuetify'
import {useApp} from '@/useApp'

interface ISettingsStore {
  _service: IUrlWithName
  _skin: string
  _indexes: string[]
  _materials: string[]
  _markets: string[]
  _exchanges: string[]
  _partner: boolean
  _items_per_page_transfers: number
  _items_per_page_stocks: number
}

export const useSettingsStore: StoreDefinition<'settings', ISettingsStore> = defineStore('settings', {
  state: (): ISettingsStore => {
    const { CONS } = useApp()
    return {
      _service: CONS.DEFAULTS.STORAGE.service,
      _skin: CONS.DEFAULTS.STORAGE.skin,
      _indexes: CONS.DEFAULTS.STORAGE.indexes,
      _materials: CONS.DEFAULTS.STORAGE.materials,
      _markets: CONS.DEFAULTS.STORAGE.markets,
      _exchanges: CONS.DEFAULTS.STORAGE.exchanges,
      _partner: CONS.DEFAULTS.STORAGE.partner,
      _items_per_page_transfers: CONS.DEFAULTS.STORAGE.items_per_page_transfers,
      _items_per_page_stocks: CONS.DEFAULTS.STORAGE.items_per_page_stocks
    }
  },
  getters: {
    service: (state: ISettingsStore) => {
      return state._service
    },
    skin: (state: ISettingsStore) => {
      return state._skin
    },
    indexes: (state: ISettingsStore) => {
      return state._indexes
    },
    materials: (state: ISettingsStore) => {
      return state._materials
    },
    markets: (state: ISettingsStore) => {
      return state._markets
    },
    exchanges: (state: ISettingsStore) => {
      return state._exchanges
    },
    partner: (state: ISettingsStore) => {
      return state._partner
    },
    itemsPerPageTransfers: (state: ISettingsStore) => {
      return state._items_per_page_transfers
    },
    itemsPerPageStocks: (state: ISettingsStore) => {
      return state._items_per_page_stocks
    }
  },
  actions: {
    async setService(value: { name: string; url: string }): Promise<void> {
      return new Promise(async (resolve) => {
        this._service = value
        await browser.storage.local.set({service: value})
        resolve()
      })
    },
    setServiceStoreOnly(value: { name: string; url: string }) {
      this._service = value
    },
    async setSkin(value: string, theme: ThemeInstance): Promise<void> {
      return new Promise(async (resolve) => {
        theme.global.name.value = value // NOTE: change theme options instance
        this._skin = value
        await browser.storage.local.set({skin: value})
        resolve()
      })
    },
    setSkinStoreOnly(value: string) {
      this._skin = value
    },
    async setIndexes(value: string[] | boolean): Promise<void> {
      return new Promise(async (resolve) => {
        this._indexes = value
        await browser.storage.local.set({indexes: value})
        resolve()
      })
    },
    setIndexesStoreOnly(value: string[] | boolean) {
      this._indexes = value
    },
    async setMaterials(value: string[] | boolean): Promise<void> {
      return new Promise(async (resolve) => {
        this._materials = value
        await browser.storage.local.set({materials: value})
        resolve()
      })
    },
    setMaterialsStoreOnly(value: string[] | boolean) {
      this._materials = value
    },
    async setMarkets(value: string[] | boolean): Promise<void> {
      return new Promise(async (resolve) => {
        this._markets = value
        await browser.storage.local.set({markets: value})
        resolve()
      })
    },
    setMarketsStoreOnly(value: string[] | boolean) {
      this._markets = value
    },
    async setExchanges(value: string[] | boolean): Promise<void> {
      return new Promise(async (resolve) => {
        this._exchanges = value
        await browser.storage.local.set({exchanges: value})
        resolve()
      })
    },
    setExchangesStoreOnly(value: string[] | boolean) {
      this._exchanges = value
    },
    async setPartner(value: string[] | boolean): Promise<void> {
      return new Promise(async (resolve) => {
        this._partner = value
        await browser.storage.local.set({partner: value})
        resolve()
      })
    },
    setPartnerStoreOnly(value: string[] | boolean) {
      this._partner = value
    },
    async setItemsPerPageTransfers(value: number): Promise<void> {
      return new Promise(async (resolve) => {
        this._items_per_page_transfers = value
        await browser.storage.local.set({itemsPerPageTransfers: value})
        resolve()
      })
    },
    async setItemsPerPageStocks(value: number): Promise<void> {
      return new Promise(async (resolve) => {
        this._items_per_page_stocks = value
        await browser.storage.local.set({itemsPerPageStocks: value})
        resolve()
      })
    },
    setItemsPerPageTransfersStoreOnly(value: number) {
      this._items_per_page_transfers = value
    },
    setItemsPerPageStocksStoreOnly(value: number) {
      this._items_per_page_stocks = value
    },
    async loadStorageIntoStore(theme: ThemeInstance): Promise<void> {
      console.log('SETTINGS: loadStorageIntoStore')
      return new Promise(async (resolve) => {
        const response: IStorageLocal = await browser.storage.local.get()
        this.setServiceStoreOnly(response.service)
        theme.global.name.value = response.skin ?? 'ocean'
        this.setSkinStoreOnly(response.skin)
        this.setIndexesStoreOnly(response.indexes)
        this.setMaterialsStoreOnly(response.materials)
        this.setMarketsStoreOnly(response.markets)
        this.setExchangesStoreOnly(response.exchanges)
        this.setPartnerStoreOnly(response.partner)
        this.setItemsPerPageStocksStoreOnly(response.items_per_page_stocks)
        this.setItemsPerPageTransfersStoreOnly(response.items_per_page_transfers)
        resolve()
      })
    },
    async togglePartner(): Promise<void> {
      return new Promise(async (resolve) => {
        const currentPartner = this._partner
        this._partner = !currentPartner
        await browser.storage.local.set({partner: !currentPartner})
        resolve()
      })
    },
    async mToggleIndexes(keys: string[], n: number): Promise<void> {
      let ind: number
      const ar = [...this._indexes]
      if ((ind = ar.indexOf(keys[n])) >= 0) {
        ar.splice(ind, 1)
      } else {
        ar.push(keys[n])
      }
      this._indexes = ar
      return new Promise(async (resolve) => {
        await browser.storage.local.set({indexes: ar})
        resolve()
      })
    },
    async mToggleMaterials(keys: string[], n: number): Promise<void> {
      let ind: number
      const ar = [...this._materials]
      if ((ind = ar.indexOf(keys[n])) >= 0) {
        ar.splice(ind, 1)
      } else {
        ar.push(keys[n])
      }
      this._materials = ar
      return new Promise(async (resolve) => {
        await browser.storage.local.set({materials: ar})
        resolve()
      })
    }
  }
})

console.log('--- settings.js ---')
