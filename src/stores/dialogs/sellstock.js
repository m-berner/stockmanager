import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useVueLibrary } from '@/libraries/useVue';
import { useAppLibrary } from '@/libraries/useApp';
import { useConstants } from '@/libraries/useConstants';
import { useModaldialogStore } from '@/stores/modaldialog';
const CONS = useConstants();
const { toNumber } = useAppLibrary();
export const useSellstockStore = defineStore('sellstock', {
    state: () => {
        return {
            _date: '',
            _count: '',
            _unit_quotation: 0,
            _fees: 0,
            _stax: 0,
            _tax: 0,
            _soli: 0,
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
        cSTax: (state) => {
            return state._stax;
        },
        cTax: (state) => {
            return state._tax;
        },
        cSoli: (state) => {
            return state._soli;
        },
        cMarketPlace: (state) => {
            return state._market_place;
        }
    },
    actions: {
        async sell() {
            console.log('SELLSTOCK: sell');
            const records = useRecordsStore();
            const modaldialog = useModaldialogStore();
            const { validators } = useVueLibrary();
            const transfer = {
                cStockID: records.stocks.active[records.stocks.active_index].cID,
                cDate: new Date(this._date).getTime(),
                cExDay: 0,
                cUnitQuotation: this._unit_quotation,
                cAmount: 0,
                cCount: -toNumber(this._count),
                cFees: -this._fees,
                cSTax: -this._stax,
                cFTax: -0,
                cTax: -this._tax,
                cSoli: -this._soli,
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
                records.setDrawerDepot();
                modaldialog.toggleVisibility();
            }
        }
    }
});
console.log('--- sellstock.js ---');
