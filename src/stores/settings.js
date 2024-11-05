import { defineStore } from 'pinia';
import {} from 'vuetify';
import { useConstants } from '@/libraries/useConstants';
export const useSettingsStore = defineStore('settings', {
    state: () => {
        const CONS = useConstants();
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
        };
    },
    getters: {
        service: (state) => {
            return state._service;
        },
        skin: (state) => {
            return state._skin;
        },
        indexes: (state) => {
            return state._indexes;
        },
        materials: (state) => {
            return state._materials;
        },
        markets: (state) => {
            return state._markets;
        },
        exchanges: (state) => {
            return state._exchanges;
        },
        partner: (state) => {
            return state._partner;
        },
        itemsPerPageTransfers: (state) => {
            return state._items_per_page_transfers;
        },
        itemsPerPageStocks: (state) => {
            return state._items_per_page_stocks;
        }
    },
    actions: {
        async setService(value) {
            return new Promise(async (resolve) => {
                this._service = value;
                await browser.storage.local.set({ service: value });
                resolve();
            });
        },
        setServiceStoreOnly(value) {
            this._service = value;
        },
        async setSkin(value, theme) {
            return new Promise(async (resolve) => {
                theme.global.name.value = value;
                this._skin = value;
                await browser.storage.local.set({ skin: value });
                resolve();
            });
        },
        setSkinStoreOnly(value) {
            this._skin = value;
        },
        async setIndexes(value) {
            return new Promise(async (resolve) => {
                this._indexes = value;
                await browser.storage.local.set({ indexes: value });
                resolve();
            });
        },
        setIndexesStoreOnly(value) {
            this._indexes = value;
        },
        async setMaterials(value) {
            return new Promise(async (resolve) => {
                this._materials = value;
                await browser.storage.local.set({ materials: value });
                resolve();
            });
        },
        setMaterialsStoreOnly(value) {
            this._materials = value;
        },
        async setMarkets(value) {
            return new Promise(async (resolve) => {
                this._markets = value;
                await browser.storage.local.set({ markets: value });
                resolve();
            });
        },
        setMarketsStoreOnly(value) {
            this._markets = value;
        },
        async setExchanges(value) {
            return new Promise(async (resolve) => {
                this._exchanges = value;
                await browser.storage.local.set({ exchanges: value });
                resolve();
            });
        },
        setExchangesStoreOnly(value) {
            this._exchanges = value;
        },
        async setPartner(value) {
            return new Promise(async (resolve) => {
                this._partner = value;
                await browser.storage.local.set({ partner: value });
                resolve();
            });
        },
        setPartnerStoreOnly(value) {
            this._partner = value;
        },
        async setItemsPerPageTransfers(value) {
            return new Promise(async (resolve) => {
                this._items_per_page_transfers = value;
                await browser.storage.local.set({ itemsPerPageTransfers: value });
                resolve();
            });
        },
        async setItemsPerPageStocks(value) {
            return new Promise(async (resolve) => {
                this._items_per_page_stocks = value;
                await browser.storage.local.set({ itemsPerPageStocks: value });
                resolve();
            });
        },
        setItemsPerPageTransfersStoreOnly(value) {
            this._items_per_page_transfers = value;
        },
        setItemsPerPageStocksStoreOnly(value) {
            this._items_per_page_stocks = value;
        },
        async loadStorageIntoStore(theme) {
            console.log('SETTINGS: loadStorageIntoStore');
            return new Promise(async (resolve) => {
                const response = await browser.storage.local.get();
                this.setServiceStoreOnly(response.service);
                theme.global.name.value = response.skin ?? 'ocean';
                this.setSkinStoreOnly(response.skin);
                this.setIndexesStoreOnly(response.indexes);
                this.setMaterialsStoreOnly(response.materials);
                this.setMarketsStoreOnly(response.markets);
                this.setExchangesStoreOnly(response.exchanges);
                this.setPartnerStoreOnly(response.partner);
                this.setItemsPerPageStocksStoreOnly(response.items_per_page_stocks);
                this.setItemsPerPageTransfersStoreOnly(response.items_per_page_transfers);
                resolve();
            });
        },
        async togglePartner() {
            return new Promise(async (resolve) => {
                const currentPartner = this._partner;
                this._partner = !currentPartner;
                await browser.storage.local.set({ partner: !currentPartner });
                resolve();
            });
        },
        async mToggleIndexes(keys, n) {
            let ind;
            const ar = [...this._indexes];
            if ((ind = ar.indexOf(keys[n])) >= 0) {
                ar.splice(ind, 1);
            }
            else {
                ar.push(keys[n]);
            }
            this._indexes = ar;
            return new Promise(async (resolve) => {
                await browser.storage.local.set({ indexes: ar });
                resolve();
            });
        },
        async mToggleMaterials(keys, n) {
            let ind;
            const ar = [...this._materials];
            if ((ind = ar.indexOf(keys[n])) >= 0) {
                ar.splice(ind, 1);
            }
            else {
                ar.push(keys[n]);
            }
            this._materials = ar;
            return new Promise(async (resolve) => {
                await browser.storage.local.set({ materials: ar });
                resolve();
            });
        }
    }
});
console.log('--- settings.js ---');
