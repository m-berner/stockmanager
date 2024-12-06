import { defineStore } from 'pinia';
import {} from 'vuetify';
import { useApp } from '@/composables/useApp';
export const useSettingsStore = defineStore('settings', {
    state: () => {
        const { CONS } = useApp();
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
        service(state) {
            return state._service;
        },
        skin(state) {
            return state._skin;
        },
        indexes(state) {
            return state._indexes;
        },
        materials(state) {
            return state._materials;
        },
        markets(state) {
            return state._markets;
        },
        exchanges(state) {
            return state._exchanges;
        },
        partner(state) {
            return state._partner;
        },
        itemsPerPageTransfers(state) {
            return state._items_per_page_transfers;
        },
        itemsPerPageStocks(state) {
            return state._items_per_page_stocks;
        }
    },
    actions: {
        async setService(value) {
            this._service = value;
            await browser.storage.local.set({ service: value });
        },
        setServiceStoreOnly(value) {
            this._service = value;
        },
        async setSkin(value, theme) {
            theme.global.name.value = value;
            this._skin = value;
            await browser.storage.local.set({ skin: value });
        },
        setSkinStoreOnly(value) {
            this._skin = value;
        },
        async toggleIndexes(keys, n) {
            let ind;
            const ar = [...this._indexes];
            if ((ind = ar.indexOf(keys[n])) >= 0) {
                ar.splice(ind, 1);
            }
            else {
                ar.push(keys[n]);
            }
            this._indexes = ar;
            await browser.storage.local.set({ indexes: ar });
        },
        setIndexesStoreOnly(value) {
            this._indexes = value;
        },
        setMaterialsStoreOnly(value) {
            this._materials = value;
        },
        async setMarkets(value) {
            this._markets = value;
            await browser.storage.local.set({ markets: value });
        },
        setMarketsStoreOnly(value) {
            this._markets = value;
        },
        async setExchanges(value) {
            this._exchanges = value;
            await browser.storage.local.set({ exchanges: value });
        },
        setExchangesStoreOnly(value) {
            this._exchanges = value;
        },
        async togglePartner() {
            const currentPartner = this._partner;
            this._partner = !currentPartner;
            await browser.storage.local.set({ partner: !currentPartner });
        },
        setPartnerStoreOnly(value) {
            this._partner = value;
        },
        async setItemsPerPageTransfers(value) {
            this._items_per_page_transfers = value;
            await browser.storage.local.set({ itemsPerPageTransfers: value });
        },
        setItemsPerPageTransfersStoreOnly(value) {
            this._items_per_page_transfers = value;
        },
        async setItemsPerPageStocks(value) {
            this._items_per_page_stocks = value;
            await browser.storage.local.set({ itemsPerPageStocks: value });
        },
        setItemsPerPageStocksStoreOnly(value) {
            this._items_per_page_stocks = value;
        },
        async loadStorageIntoStore(theme) {
            console.log('SETTINGS: loadStorageIntoStore');
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
        },
        async toggleMaterials(keys, n) {
            let ind;
            const ar = [...this._materials];
            if ((ind = ar.indexOf(keys[n])) >= 0) {
                ar.splice(ind, 1);
            }
            else {
                ar.push(keys[n]);
            }
            this._materials = ar;
            await browser.storage.local.set({ materials: ar });
        }
    }
});
console.log('--- settings.js ---');
