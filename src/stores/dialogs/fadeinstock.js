import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useApp } from '@/useApp';
import { useModaldialogStore } from '@/stores/modaldialog';
const { CONS } = useApp();
export const useFadeinstockStore = defineStore('fadeinstock', {
    state: () => {
        return {
            _selected: CONS.RECORDS.TEMPLATES.STOCK
        };
    },
    getters: {},
    actions: {
        onSelect() {
            console.log('FADEINSTOCK: onSelect');
            this._selected.cFadeOut = 0;
        },
        reset() {
            console.log('FADEINSTOCK: reset');
            this._selected = CONS.RECORDS.TEMPLATES.STOCK;
        },
        async onOk() {
            console.log('FADEINSTOCK: onOk');
            return await new Promise(async (resolve) => {
                const records = useRecordsStore();
                const modaldialog = useModaldialogStore();
                await records.updateStock(this._selected);
                modaldialog.toggleVisibility();
                resolve();
            });
        }
    }
});
console.log('--- fadeinstock.js ---');
