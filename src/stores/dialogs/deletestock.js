import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useModaldialogStore } from '@/stores/modaldialog';
export const useDeletestockStore = defineStore('deletestock', {
    state: () => {
        return {
            _deleteable: false
        };
    },
    getters: {
        deleteable: (state) => {
            return state._deleteable;
        }
    },
    actions: {
        setDeleteable(value) {
            this._deleteable = value;
        },
        async delete() {
            console.log('DELETESTOCK: delete');
            const records = useRecordsStore();
            const modaldialog = useModaldialogStore();
            await records.deleteStock(records.stocks.active[records.stocks.active_index].cID);
            modaldialog.toggleVisibility();
        }
    }
});
console.log('--- deletestock.js ---');
