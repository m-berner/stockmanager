import { defineStore } from 'pinia';
import { useApp } from '@/useApp';
const { toNumber } = useApp();
export const useOnlineStore = defineStore('online', {
    state: () => {
        return {
            _min_rate_max: new Map(),
            _materials: new Map(),
            _indexes: new Map(),
            _exchanges: new Map(),
            _dates: new Map(),
            _changes: [],
            _add_stock: {
                cCompany: '',
                cISIN: '',
                cWKN: '',
                cSym: ''
            }
        };
    },
    getters: {
        dates: (state) => {
            return state._dates;
        },
        minRateMax: (state) => {
            return state._min_rate_max;
        },
        addStock: (state) => {
            return state._add_stock;
        },
        indexes: (state) => {
            return state._indexes;
        },
        materials: (state) => {
            return state._materials;
        },
        exchanges: (state) => {
            return state._exchanges;
        },
        changes: (state) => {
            return state._changes;
        }
    },
    actions: {
        setaddStock(value) {
            this._add_stock = value;
        },
        setExchanges(value) {
            this._exchanges = value;
        },
        setExchangesItem(value) {
            this._exchanges.set(value.key, value.value);
        },
        setMaterials(value) {
            this._materials = value;
        },
        setIndexes(value) {
            this._indexes = value;
        },
        updateExchanges([key, value]) {
            this._exchanges.set(key, value);
        },
        setChanges(value) {
            this._changes = value;
        },
        setMinRateMax(value) {
            let factor = 1;
            for (let i = 0; i < value.length; i++) {
                if (value[i].cur.includes('USD')) {
                    factor = 1 / this._exchanges.get('EURUSD');
                }
                this._min_rate_max.set(value[i].id, {
                    min: factor * toNumber(value[i].min),
                    max: factor * toNumber(value[i].max),
                    rate: factor * toNumber(value[i].rate)
                });
            }
        },
        setDatesData(value) {
            this._dates = value;
        }
    }
});
console.log('--- online.js ---');
