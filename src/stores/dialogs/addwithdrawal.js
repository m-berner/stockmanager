import { defineStore } from 'pinia';
import { useRecordsStore } from '@/stores/records';
import { useApp } from '@/useApp';
import { useComponents } from '@/components/lib/useComponents';
import { useModaldialogStore } from '@/stores/modaldialog';
const { CONS, notice, isoDatePlusSeconds } = useApp();
export const useAddwithdrawalStore = defineStore('addwithdrawal', {
    state: () => {
        return {
            _date: '',
            _type: 0,
            _withdrawal: 0,
            _description: ''
        };
    },
    getters: {},
    actions: {
        async add() {
            console.log('ADDWITHDRAWAL: add');
            return new Promise(async (resolve, reject) => {
                const { validators } = useComponents();
                const records = useRecordsStore();
                const modaldialog = useModaldialogStore();
                const record = {
                    cStockID: 0,
                    cDate: isoDatePlusSeconds(this._date),
                    cUnitQuotation: 0,
                    cAmount: this._type === CONS.RECORDS.TYPES.TRANSFER ? -this._withdrawal : 0,
                    cCount: 0,
                    cFees: this._type === CONS.RECORDS.TYPES.FEE ? -this._withdrawal : 0,
                    cTax: this._type === CONS.RECORDS.TYPES.TAX ? -this._withdrawal : 0,
                    cSTax: this._type === CONS.RECORDS.TYPES.STAX ? -this._withdrawal : 0,
                    cFTax: this._type === CONS.RECORDS.TYPES.FTAX ? -this._withdrawal : 0,
                    cSoli: this._type === CONS.RECORDS.TYPES.SOLI ? -this._withdrawal : 0,
                    cExDay: 0,
                    cDescription: this._description,
                    cMarketPlace: '',
                    cType: CONS.DB.RECORD_TYPES.WITHDRAWAL
                };
                if (Object.values(CONS.RECORDS.TYPES).indexOf(this._type) === -1) {
                    notice(['System Error']);
                }
                if (validators.isoDate(this._date) === true && validators.positiveNumber(this._withdrawal) === true) {
                    await records.addTransfer(record);
                    records.evaluateTransfers();
                    modaldialog.toggleVisibility();
                    resolve();
                }
                else {
                    reject('ADDWITHDRAWAL: Invalid date');
                }
            });
        }
    }
});
console.log('--- addwithdrawal.js ---');
