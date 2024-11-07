import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useComponents } from '@/components/lib/useComponents';
import { useApp } from '@/useApp';
import { useModaldialogStore } from '@/stores/modaldialog';
const { toNumber } = useApp();
export const useConfigstockStore = defineStore('configstock', {
    state: () => {
        return {
            _company: '',
            _isin: '',
            _wkn: '',
            _sym: '',
            _first_page: '',
            _fade_out: '',
            _quarter_day: '',
            _meeting_day: '',
            _url: ''
        };
    },
    getters: {
        cCompany: (state) => {
            return state._company;
        },
        cISIN: (state) => {
            return state._isin;
        },
        cWKN: (state) => {
            return state._wkn;
        },
        cSym: (state) => {
            return state._sym;
        },
        cFirstPage: (state) => {
            return state._first_page;
        },
        cFadeOut: (state) => {
            return state._fade_out;
        },
        cQuarterDay: (state) => {
            return state._quarter_day;
        },
        cMeetingDay: (state) => {
            return state._meeting_day;
        },
        cURL: (state) => {
            return state._url;
        }
    },
    actions: {
        async configure() {
            console.log('CONFIGSTOCK: configure');
            return new Promise(async (resolve, reject) => {
                const records = useRecordsStore();
                const modaldialog = useModaldialogStore();
                const { validators } = useComponents();
                const stock = { ...records.stocks.active[records.stocks.active_index] };
                if ((stock.mPortfolio ?? 0) > 0.9 && this._fade_out !== '0') {
                    this._fade_out = '0';
                }
                if (validators.isin(this._isin) === true &&
                    validators.wkn(this._wkn) === true &&
                    validators.url(this._url) === true) {
                    stock.cCompany = this._company;
                    stock.cISIN = this._isin;
                    stock.cWKN = this._wkn;
                    stock.cSym = this._sym;
                    stock.cFirstPage = toNumber(this._first_page);
                    stock.cFadeOut = toNumber(this._fade_out);
                    stock.cMeetingDay = new Date(this._meeting_day).getTime();
                    stock.cQuarterDay = new Date(this._quarter_day).getTime();
                    stock.cURL = this._url;
                    await records.updateStock(stock);
                    records.evaluateTransfers();
                    modaldialog.toggleVisibility();
                    resolve();
                }
                else {
                    reject('CONFIGSTOCK: validation failed!');
                }
            });
        }
    }
});
console.log('--- configstock.js ---');
