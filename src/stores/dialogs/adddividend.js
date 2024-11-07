import { defineStore } from 'pinia';
import { useModaldialogStore } from '@/stores/modaldialog';
import { useComponents } from '@/components/lib/useComponents';
import { useApp } from '@/useApp';
import { useRecordsStore } from '@/stores/records';
const { CONS, toNumber } = useApp();
export const useAdddividendStore = defineStore('adddividend', {
    state: () => {
        return {
            _date: '',
            _ex_day: '',
            _count: '',
            _deposit: 0,
            _unit_quotation: 0,
            _stax: 0,
            _tax: 0,
            _soli: 0,
            _description: ''
        };
    },
    getters: {
        cDate: (state) => {
            return state._date;
        },
        cExDay: (state) => {
            return state._ex_day;
        },
        cCount: (state) => {
            return state._count;
        },
        cDeposit: (state) => {
            return state._deposit;
        },
        cUnitQuotation: (state) => {
            return state._unit_quotation;
        },
        cSTax: (state) => {
            return state._stax;
        },
        cTax: (state) => {
            return state._tax;
        },
        cSoli: (state) => {
            return state._soli;
        },
        cDescription: (state) => {
            return state._description;
        }
    },
    actions: {
        async add() {
            console.log('ADDDIVIDEND: add');
            return new Promise(async (resolve, reject) => {
                const records = useRecordsStore();
                const modaldialog = useModaldialogStore();
                const { validators } = useComponents();
                const transfer = {
                    cStockID: records.stocks.active[records.stocks.active_index].cID,
                    cDate: new Date(this._date).getTime(),
                    cExDay: new Date(this._ex_day).getTime(),
                    cUnitQuotation: toNumber(this._unit_quotation),
                    cAmount: 0,
                    cCount: toNumber(this._count),
                    cFees: 0,
                    cSTax: -toNumber(this._stax),
                    cFTax: 0,
                    cTax: -toNumber(this._tax),
                    cSoli: -toNumber(this._soli),
                    cType: CONS.DB.RECORD_TYPES.DIV,
                    cMarketPlace: '',
                    cDescription: this._description
                };
                if (validators.isoDate(this._date) !== true) {
                    this._date = '0000-00-00';
                }
                if (validators.isoDate(this._ex_day) !== true) {
                    this._date = '0000-00-00';
                }
                if (validators.positiveInteger(this._count) !== true) {
                    this._count = '0';
                }
                if (validators.positiveInteger(this._count) === true &&
                    validators.isoDate(this._date) === true &&
                    validators.isoDate(this._ex_day) === true) {
                    await records.addTransfer(transfer, records.stocks.active[records.stocks.active_index].cCompany);
                    records.updatePage(records.stocks.active_page);
                    records.setDrawerDepot();
                    modaldialog.toggleVisibility();
                    resolve();
                }
                else {
                    reject('ADDDIVIDEND: add error');
                }
            });
        }
    }
});
console.log('--- adddividend.js ---');
