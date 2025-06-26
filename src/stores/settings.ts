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
    const {CONS} = useApp()
    return {
      _service: CONS.DEFAULTS.STORAGE.sService,
      _skin: CONS.DEFAULTS.STORAGE.sSkin,
      _indexes: CONS.DEFAULTS.STORAGE.sIndexes,
      _materials: CONS.DEFAULTS.STORAGE.sMaterials,
      _markets: CONS.DEFAULTS.STORAGE.sMarkets,
      _exchanges: CONS.DEFAULTS.STORAGE.sExchanges,
      _partner: CONS.DEFAULTS.STORAGE.sPartner,
      _items_per_page_transfers: CONS.DEFAULTS.STORAGE.sItemsPerPageTransfers,
      _items_per_page_stocks: CONS.DEFAULTS.STORAGE.sItemsPerPageStocks
    }
  },
  getters: {
    service(state: ISettingsStore) {
      return state._service
    },
    skin(state: ISettingsStore) {
      return state._skin
    },
    indexes(state: ISettingsStore) {
      return state._indexes
    },
    materials(state: ISettingsStore) {
      return state._materials
    },
    markets(state: ISettingsStore) {
      return state._markets
    },
    exchanges(state: ISettingsStore) {
      return state._exchanges
    },
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
    setServiceStoreOnly(value: { name: string; url: string }) {
      this._service = value
    },
    setSkinStoreOnly(value: string, theme: ThemeInstance) {
      theme.global.name.value = value
      this._skin = value
    },
    setIndexesStoreOnly(value: string[]) {
      this._indexes = value
    },
    setMaterialsStoreOnly(value: string[]) {
      this._materials = value
    },
    setMarketsStoreOnly(value: string[] | boolean) {
      this._markets = value
    },
    setExchangesStoreOnly(value: string[] | boolean) {
      this._exchanges = value
    },
    async togglePartner(): Promise<void> {
      const currentPartner = this._partner
      this._partner = !currentPartner
      await browser.storage.local.set({sPartner: !currentPartner})
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
      this.setServiceStoreOnly(response['sService'])
      theme.global.name.value = response['sSkin'] ?? 'ocean'
      this.setSkinStoreOnly(response['sSkin'], theme)
      this.setIndexesStoreOnly(response['sIndexes'])
      this.setMaterialsStoreOnly(response['sMaterials'])
      this.setMarketsStoreOnly(response['sMarkets'])
      this.setExchangesStoreOnly(response['sExchanges'])
      this.setPartnerStoreOnly(response['sPartner'])
      this.setItemsPerPageStocksStoreOnly(response['sItemsPerPageStocks'])
      this.setItemsPerPageTransfersStoreOnly(response['sItemsPerPageTransfers'])
    }
  }
})

console.log('--- settings.js ---')
