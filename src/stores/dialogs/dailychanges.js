import { defineStore } from 'pinia';
import { useOnlineStore } from '@/stores/online';
import { useApp } from '@/useApp';
const { CONS } = useApp();
export const useDailychangesStore = defineStore('dailychanges', {
    state: () => {
        return {
            _progress: true,
            _search: '',
            _tmpChanges: [],
            _tmpChangesWithNoDuplicates: []
        };
    },
    getters: {
        search: (state) => {
            return state._search;
        },
        tmpChanges: (state) => {
            return state._tmpChanges;
        },
        tmpChangesWithNoDuplicates: (state) => {
            return state._tmpChangesWithNoDuplicates;
        }
    },
    actions: {
        setTmpChanges(value) {
            this._tmpChanges = value;
        },
        setTmpChangesWithNoDuplicates(value) {
            this._tmpChangesWithNoDuplicates = value;
        },
        searchDailyChanges() {
            if (this.search !== null && this._search.length > 2) {
                const online = useOnlineStore();
                const matches = online.changes.filter((item) => {
                    return (item.key.toLowerCase().includes(this._search) ||
                        item.key.toUpperCase().includes(this._search) ||
                        item.key.includes(this._search));
                });
                const elemId = matches[0].key ?? '';
                const elem = document.getElementById(elemId);
                if (elem !== null) {
                    elem.scrollIntoView();
                }
            }
        },
        async getDailyChanges(mode) {
            console.log('DAILYCHANGES: getDailyChanges');
            const online = useOnlineStore();
            online.setChanges([]);
            this.setTmpChanges([]);
            this.setTmpChangesWithNoDuplicates([]);
            this._progress = true;
            if (mode === CONS.DIALOGS.DAILYCHANGES) {
                for (let i = 0; i < CONS.SERVICES.tgate.CHS.length; i++) {
                    await browser.runtime.sendMessage({
                        type: CONS.FETCH_API.ASK__DAILY_CHANGES,
                        data: CONS.SERVICES.tgate.CHS[i]
                    });
                }
                await browser.runtime.sendMessage({
                    type: CONS.FETCH_API.END__DAILY_CHANGES,
                    data: []
                });
            }
            else {
                for (let i = 0; i < CONS.SERVICES.tgate.CHB.length; i++) {
                    await browser.runtime.sendMessage({
                        type: CONS.FETCH_API.ASK__DAILY_CHANGES_ALL,
                        data: CONS.SERVICES.tgate.CHB[i]
                    });
                }
                await browser.runtime.sendMessage({
                    type: CONS.FETCH_API.END__DAILY_CHANGES_ALL
                });
            }
            this._progress = false;
        }
    }
});
console.log('--- dailychanges.js ---');
