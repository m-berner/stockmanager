import { defineStore } from 'pinia';
export const useOptionsPageStore = defineStore('optionspage', {
    state: () => {
        return {
            _tab: 0,
            _tabs_length: 0,
            _theme_keys: [],
            _service_keys: [],
            _index_keys: [],
            _material_keys: []
        };
    },
    getters: {
        tabsLength: (state) => {
            return state._tabs_length;
        },
        themeKeys: (state) => {
            return state._theme_keys;
        },
        serviceKeys: (state) => {
            return state._service_keys;
        },
        indexKeys: (state) => {
            return state._index_keys;
        },
        materialKeys: (state) => {
            return state._material_keys;
        }
    },
    actions: {
        setTab(value) {
            this._tab = value;
        },
        setTabsLength(value) {
            this._tabs_length = value;
        },
        setThemeKeys(value) {
            this._theme_keys = value;
        },
        setServiceKeys(value) {
            this._service_keys = value;
        },
        setIndexKeys(value) {
            this._index_keys = value;
        },
        setMaterialKeys(value) {
            this._material_keys = value;
        }
    }
});
console.log('--- optionspage.js ---');
