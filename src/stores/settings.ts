/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {type ThemeInstance} from 'vuetify'
import {useApp} from '@/background'

interface ISettingsStore {
  _partner: boolean
  _items_per_page_transfers: number
  _items_per_page_stocks: number
}

export const useSettingsStore: StoreDefinition<'settings', ISettingsStore> = defineStore('settings', {
  state: (): ISettingsStore => {
    const {CONS} = useApp()
    return {
      _partner: CONS.DEFAULTS.STORAGE['sPartner'],
      _items_per_page_transfers: CONS.DEFAULTS.STORAGE['sItemsPerPageTransfers'],
      _items_per_page_stocks: CONS.DEFAULTS.STORAGE['sItemsPerPageStocks']
    }
  },
  getters: {
    partner(state: ISettingsStore) {
      return state._partner
    },
    itemsPerPageTransfers(state: ISettingsStore) {
      return state._items_per_page_transfers
    },
    itemsPerPageStocks(state: ISettingsStore) {
      return state._items_per_page_stocks
    }
  },
  actions: {
    async setService(value: { name: string; url: string }): Promise<void> {
      this._service = value
      await browser.storage.local.set({sService: value})
    },
    setServiceStoreOnly(value: { name: string; url: string }) {
      this._service = value
    },
    async setSkin(value: string, theme: ThemeInstance): Promise<void> {
      theme.global.name.value = value // NOTE: change theme options instance
      this._skin = value
      await browser.storage.local.set({sSkin: value})
    },
    setSkinStoreOnly(value: string, theme: ThemeInstance) {
      theme.global.name.value = value
      this._skin = value
    },
    async toggleIndexes(keys: string[], n: number): Promise<void> {
      let ind: number
      const ar = [...this._indexes]
      if ((ind = ar.indexOf(keys[n])) >= 0) {
        ar.splice(ind, 1)
      } else {
        ar.push(keys[n])
      }
      this._indexes = ar
      await browser.storage.local.set({indexes: ar})
    },
    async setIndexes(value: string[] | boolean) {
      this._indexes = value
      await browser.storage.local.set({sIndexes: value})
    },
    setIndexesStoreOnly(value: string[] | boolean) {
      this._indexes = value
    },
    async setMaterials(value: string[] | boolean) {
      this._materials = value
      await browser.storage.local.set({sMaterials: value})
    },
    setMaterialsStoreOnly(value: string[] | boolean) {
      this._materials = value
    },
    async setMarkets(value: string[] | boolean): Promise<void> {
      this._markets = value
      await browser.storage.local.set({sMarkets: value})
    },
    setMarketsStoreOnly(value: string[] | boolean) {
      this._markets = value
    },
    async setExchanges(value: string[] | boolean): Promise<void> {
      this._exchanges = value
      await browser.storage.local.set({sExchanges: value})
    },
    setExchangesStoreOnly(value: string[] | boolean) {
      this._exchanges = value
    },

    async togglePartner(): Promise<void> {
      const currentPartner = this._partner
      this._partner = !currentPartner
      await browser.storage.local.set({partner: !currentPartner})
    },
    setPartnerStoreOnly(value: string[] | boolean) {
      this._partner = value
    },
    async setItemsPerPageTransfers(value: number): Promise<void> {
      this._items_per_page_transfers = value
      await browser.storage.local.set({sItemsPerPageTransfers: value})
    },
    setItemsPerPageTransfersStoreOnly(value: number) {
      this._items_per_page_transfers = value
    },
    async setItemsPerPageStocks(value: number): Promise<void> {
      this._items_per_page_stocks = value
      await browser.storage.local.set({sItemsPerPageStocks: value})
    },
    setItemsPerPageStocksStoreOnly(value: number) {
      this._items_per_page_stocks = value
    },
    async loadStorageIntoStore(theme: ThemeInstance): Promise<void> {
      console.log('SETTINGS: loadStorageIntoStore')
      const response: IStorageLocal = await browser.storage.local.get()
      theme.global.name.value = response['sSkin'] ?? 'ocean'
      // this.setServiceStoreOnly(response['sService'])
      // this.setSkinStoreOnly(response['sSkin'], theme)
      // this.setIndexesStoreOnly(response['sIndexes'])
      // this.setMaterialsStoreOnly(response['sMaterials'])
      // this.setMarketsStoreOnly(response['sMarkets'])
      // this.setExchangesStoreOnly(response['sExchanges'])
      this.setPartnerStoreOnly(response['sPartner'])
      this.setItemsPerPageStocksStoreOnly(response['sItemsPerPageStocks'])
      this.setItemsPerPageTransfersStoreOnly(response['sItemsPerPageTransfers'])
    },
    async toggleMaterials(keys: string[], n: number): Promise<void> {
      let ind: number
      const ar = [...this._materials]
      if ((ind = ar.indexOf(keys[n])) >= 0) {
        ar.splice(ind, 1)
      } else {
        ar.push(keys[n])
      }
      this._materials = ar
      await browser.storage.local.set({materials: ar})
    }
  }
})

console.log('--- settings.js ---')
