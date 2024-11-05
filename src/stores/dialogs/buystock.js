import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useModaldialogStore } from '@/stores/modaldialog';
import { useVueLibrary } from '@/libraries/useVue';
import { useAppLibrary } from '@/libraries/useApp';
import { useConstants } from '@/libraries/useConstants';
const CONS = useConstants();
const { toNumber } = useAppLibrary();
export const useBuystockStore = defineStore('buystock', {
    state: () => {
        return {
            _date: '',
            _count: '',
            _unit_quotation: 0,
            _fees: 0,
            _ftax: 0,
            _market_place: ''
        };
    },
    getters: {
        cDate: (state) => {
            return state._date;
        },
        cCount: (state) => {
            return state._count;
        },
        cUnitQuotation: (state) => {
            return state._unit_quotation;
        },
        cFees: (state) => {
            return state._fees;
        },
        cFTax: (state) => {
            return state._ftax;
        },
        cMarketPlace: (state) => {
            return state._market_place;
        }
    },
    actions: {
        async buy() {
            console.log('BUYSTOCK: buy');
            return new Promise(async (resolve, reject) => {
                const records = useRecordsStore();
                const modaldialog = useModaldialogStore();
                const { validators } = useVueLibrary();
                const transfer = {
                    cStockID: records.stocks.active[records.stocks.active_index].cID,
                    cDate: new Date(this._date).getTime(),
                    cExDay: 0,
                    cUnitQuotation: this._unit_quotation,
                    cAmount: 0,
                    cCount: toNumber(this._count),
                    cFees: -this._fees,
                    cSTax: -0,
                    cFTax: -this._ftax,
                    cTax: -0,
                    cSoli: -0,
                    cType: CONS.DB.RECORD_TYPES.BUY,
                    cMarketPlace: this._market_place,
                    cDescription: ''
                };
                if (validators.isoDate(this._date) !== true) {
                    this._date = '0000-00-00';
                }
                if (validators.positiveInteger(this._count) !== true) {
                    this._count = '0';
                }
                if (validators.positiveInteger(this._count) === true && validators.isoDate(this._date) === true) {
                    await records.addTransfer(transfer);
                    records.evaluateTransfers();
                    records.updatePage(records.stocks.activePage);
                    records.setDrawerDepot();
                    modaldialog.toggleVisibility();
                    resolve();
                }
                else {
                    reject('BUYSTOCK: invalid error');
                }
            });
        }
    }
});
console.log('--- buystock.js ---');
