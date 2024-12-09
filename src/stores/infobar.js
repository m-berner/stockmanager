import { defineStore } from 'pinia';
export const useInfobarStore = defineStore('infobar', {
    state: () => {
        return {
            _exchanges: new Map(),
            _indexes: new Map(),
            _materials: new Map()
        };
    },
    getters: {
        exchanges(state) {
            return state._exchanges;
        },
        indexes(state) {
            return state._indexes;
        },
        materials(state) {
            return state._materials;
        }
    },
    actions: {
        setExchanges(entry) {
            this._exchanges = entry;
        },
        setIndexes(entry) {
            this._indexes = entry;
        },
        setMaterials(entry) {
            this._materials = entry;
        }
    }
});
console.log('--- infobar.js ---');
