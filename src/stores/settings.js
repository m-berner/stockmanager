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
        setServiceStoreOnly(value) {
            this._service = value;
        },
        setSkinStoreOnly(value, theme) {
            theme.global.name.value = value;
            this._skin = value;
        },
        setIndexesStoreOnly(value) {
            this._indexes = value;
        },
        setMaterialsStoreOnly(value) {
            this._materials = value;
        },
        setMarketsStoreOnly(value) {
            this._markets = value;
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
            this.setSkinStoreOnly(response['sSkin'], theme);
            this.setIndexesStoreOnly(response['sIndexes']);
            this.setMaterialsStoreOnly(response['sMaterials']);
            this.setMarketsStoreOnly(response['sMarkets']);
            this.setExchangesStoreOnly(response['sExchanges']);
            this.setPartnerStoreOnly(response['sPartner']);
            this.setItemsPerPageStocksStoreOnly(response['sItemsPerPageStocks']);
            this.setItemsPerPageTransfersStoreOnly(response['sItemsPerPageTransfers']);
        }
    }
});
console.log('--- settings.js ---');
