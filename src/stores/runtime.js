import { defineStore } from 'pinia';
export const useRuntimeStore = defineStore('runtime', {
    state: () => {
        return {
            _stocks_loading: false,
            _show_partial_drawer: true,
            _show_stock_table: false,
            _table: 'StocksTable',
            _dates_for_page: []
        };
    },
    getters: {
        stocksLoading: (state) => {
            return state._stocks_loading;
        },
        showTable: (state) => {
            return state._show_stock_table;
        },
        table: (state) => {
            return state._table;
        },
        showPartialDrawer: (state) => {
            return state._show_partial_drawer;
        },
        datesForPage: (state) => {
            return state._dates_for_page;
        }
    },
    actions: {
        toggleShowStockTable() {
            const tmp = Boolean(this._show_stock_table);
            this._show_stock_table = !tmp;
        },
        setTable(value) {
            this._table = value;
        },
        setStocksLoading(value) {
            this._stocks_loading = value;
        },
        setShowPartialDrawer(value) {
            this._show_partial_drawer = value;
        },
        updateDatesForPage(index, value) {
            this._dates_for_page[index] = value;
        }
    }
});
console.log('--- runtime.js ---');
