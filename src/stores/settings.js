import { defineStore } from 'pinia';
import {} from 'vuetify';
import { useApp } from '@/background';
export const useSettingsStore = defineStore('settings', {
    state: () => {
        const { CONS } = useApp();
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
            await browser.storage.local.set({ sService: value });
        },
        setServiceStoreOnly(value) {
            this._service = value;
        },
        async setSkin(value, theme) {
            theme.global.name.value = value;
            this._skin = value;
            await browser.storage.local.set({ sSkin: value });
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
            await browser.storage.local.set({ sIndexes: ar });
        },
        setIndexesStoreOnly(value) {
            this._indexes = value;
        },
        setMaterialsStoreOnly(value) {
            this._materials = value;
        },
        async setMarkets(value) {
            this._markets = value;
            await browser.storage.local.set({ sMarkets: value });
        },
        setMarketsStoreOnly(value) {
            this._markets = value;
        },
        async setExchanges(value) {
            this._exchanges = value;
            await browser.storage.local.set({ sExchanges: value });
        },
        setExchangesStoreOnly(value) {
            this._exchanges = value;
        },
        async togglePartner() {
            const currentPartner = this._partner;
            this._partner = !currentPartner;
            await browser.storage.local.set({ sPartner: !currentPartner });
        },
        setPartnerStoreOnly(value) {
            this._partner = value;
        },
        async setItemsPerPageTransfers(value) {
            this._items_per_page_transfers = value;
            await browser.storage.local.set({ sItemsPerPageTransfers: value });
        },
        setItemsPerPageTransfersStoreOnly(value) {
            this._items_per_page_transfers = value;
        },
        async setItemsPerPageStocks(value) {
            this._items_per_page_stocks = value;
            await browser.storage.local.set({ sItemsPerPageStocks: value });
        },
        setItemsPerPageStocksStoreOnly(value) {
            this._items_per_page_stocks = value;
        },
        async loadStorageIntoStore(theme) {
            console.log('SETTINGS: loadStorageIntoStore');
            const response = await browser.storage.local.get();
            this.setServiceStoreOnly(response['sService']);
            theme.global.name.value = response['sSkin'] ?? 'ocean';
            this.setSkinStoreOnly(response['sSkin']);
            this.setIndexesStoreOnly(response['sIndexes']);
            this.setMaterialsStoreOnly(response['sMaterials']);
            this.setMarketsStoreOnly(response['sMarkets']);
            this.setExchangesStoreOnly(response['sExchanges']);
            this.setPartnerStoreOnly(response['sPartner']);
            this.setItemsPerPageStocksStoreOnly(response['sItemsPerPageStocks']);
            this.setItemsPerPageTransfersStoreOnly(response['sItemsPerPageTransfers']);
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
            await browser.storage.local.set({ sMaterials: ar });
        }
    }
});
console.log('--- settings.js ---');
