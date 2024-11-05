import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useModaldialogStore } from '@/stores/modaldialog';
import { useAppLibrary } from '@/libraries/useApp';
const { CONS } = useAppLibrary();
export const useAddstockStore = defineStore('addstock', {
    state: () => {
        return {
            _isin: '',
            _company: '',
            _wkn: '',
            _sym: '',
            _auto: true
        };
    },
    getters: {},
    actions: {
        setAuto(value) {
            this._auto = value;
        },
        setWKN(value) {
            this._wkn = value;
        },
        setCompany(value) {
            this._company = value;
        },
        setSymbol(value) {
            this._sym = value;
        },
        async add() {
            console.log('ADDSTOCK: add');
            return new Promise(async (resolve, reject) => {
                const records = useRecordsStore();
                const modaldialog = useModaldialogStore();
                const stock = {
                    cCompany: this._company,
                    cISIN: this._isin.toUpperCase(),
                    cWKN: this._wkn.toUpperCase(),
                    cSym: this._sym,
                    cQuarterDay: 0,
                    cMeetingDay: 0,
                    cFadeOut: 0,
                    cFirstPage: 0,
                    cURL: ''
                };
                const verify = records.stocks.all.filter((rec) => {
                    return this._isin.toUpperCase() === rec.cISIN.toUpperCase();
                });
                if (verify.length > 0) {
                    reject('ADDSTOCK ERROR: stock exists already');
                }
                else {
                    await records.addStock(stock);
                    modaldialog.toggleVisibility(CONS.DIALOGS.ADDSTOCK);
                    resolve();
                }
            });
        },
        async onIsin() {
            console.log('ADDSTOCK: onIsin');
            return new Promise(async (resolve, reject) => {
                if (this._isin !== null && this._isin.length === 12) {
                    await browser.runtime.sendMessage({
                        type: CONS.FETCH_API.ASK__COMPANY_DATA,
                        data: this._isin
                    });
                    resolve();
                }
                else {
                    reject('ADDSTOCK ERROR: onIsin');
                }
            });
        }
    }
});
console.log('--- addstock.js ---');
