import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
export const useInfobarStore = defineStore('infobar', {
    state: () => {
        return {
            _drawer_items: []
        };
    },
    getters: {
        drawerItems: (state) => {
            return state._drawer_items;
        }
    },
    actions: {
        createDrawerItems() {
            const records = useRecordsStore();
            console.log('INFOBAR: createDrawerItems');
            const drawerData = {
                'winloss': 'Gewinn/Verlust',
                'earnings': 'Aktien-Erlös',
                'deposits': 'Einzahlung',
                'dividends': 'Dividende',
                'withdrawals': 'Auszahlung',
                'fees': 'Gebühr',
                'taxes': 'Steuer',
                'account': 'Handelskonto',
                'depot': 'Depotkonto'
            };
            const drawerKeys = Object.keys(drawerData);
            this._drawer_items = [];
            for (const elem of drawerKeys) {
                this._drawer_items.push({
                    title: drawerData[elem],
                    value: records.transfers.totalController[elem],
                    class: records.transfers.totalController[elem] < 0 ? elem + '_minus' : elem
                });
            }
        }
    }
});
console.log('--- infobar.js ---');
