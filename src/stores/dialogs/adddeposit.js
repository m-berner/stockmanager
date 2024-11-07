import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useModaldialogStore } from '@/stores/modaldialog';
import { useApp } from '@/useApp';
import { useComponents } from '@/components/lib/useComponents';
const { CONS, notice, isoDatePlusSeconds } = useApp();
export const useAdddepositStore = defineStore('adddeposit', {
    state: () => {
        return {
            _date: '',
            _type: 0,
            _deposit: 0,
            _description: ''
        };
    },
    getters: {},
    actions: {
        async add() {
            console.log('ADDDEPOSIT: add');
            const { validators } = useComponents();
            const records = useRecordsStore();
            const modaldialog = useModaldialogStore();
            const record = {
                cStockID: 0,
                cDate: isoDatePlusSeconds(this._date),
                cUnitQuotation: 0,
                cAmount: this._type === CONS.RECORDS.TYPES.TRANSFER ? this._deposit : 0,
                cCount: 0,
                cFees: this._type === CONS.RECORDS.TYPES.FEE ? this._deposit : 0,
                cTax: this._type === CONS.RECORDS.TYPES.TAX ? this._deposit : 0,
                cSTax: this._type === CONS.RECORDS.TYPES.STAX ? this._deposit : 0,
                cFTax: this._type === CONS.RECORDS.TYPES.FTAX ? this._deposit : 0,
                cSoli: this._type === CONS.RECORDS.TYPES.SOLI ? this._deposit : 0,
                cExDay: 0,
                cDescription: this._description,
                cMarketPlace: '',
                cType: CONS.DB.RECORD_TYPES.DEPOSIT
            };
            if (Object.values(CONS.RECORDS.TYPES).indexOf(this._type) === -1) {
                notice(['System Error']);
            }
            return new Promise(async (resolve, reject) => {
                if (validators.isoDate(this._date) === true && validators.positiveNumber(this._deposit) === true) {
                    await records.addTransfer(record);
                    records.evaluateTransfers();
                    modaldialog.toggleVisibility();
                    resolve();
                }
                else {
                    reject('ADDDEPOSIT: add error');
                }
            });
        }
    }
});
console.log('--- adddeposit.js ---');
