import { defineStore } from 'pinia';
import { useApp } from '@/useApp';
import { useRecordsStore } from '@/stores/records';
import { useModaldialogStore } from '@/stores/modaldialog';
import { useComponents } from '@/components/lib/useComponents';
const { toNumber, dateToISO } = useApp();
export const useUpdatetransferStore = defineStore('updatetransfer', {
    state: () => {
        return {
            _date: '',
            _ex_day: '',
            _count: 0,
            _unit_quotation: 0,
            _stock_id: 0,
            _amount: 0,
            _fees: 0,
            _stax: 0,
            _ftax: 0,
            _tax: 0,
            _soli: 0,
            _type: 0,
            _market_place: '',
            _description: ''
        };
    },
    getters: {},
    actions: {
        setInitialTransfer(value) {
            console.error('transfer', value);
            this._date = dateToISO(value.cDate);
            this._ex_day = dateToISO(value.cExDay);
            this._count = value.cCount;
            this._amount = value.cAmount;
            this._fees = value.cFees;
            this._unit_quotation = value.cUnitQuotation;
            this._stax = value.cSTax;
            this._ftax = value.cFTax;
            this._tax = value.cTax;
            this._soli = value.cSoli;
            this._market_place = value.cMarketPlace;
            this._description = value.cDescription;
            console.error('this', this);
        },
        async onUpdate() {
            console.log('UPDATETRANSFER: update');
            const { validators } = useComponents();
            const records = useRecordsStore();
            const modaldialog = useModaldialogStore();
            console.error(records.transfers.index);
            const currentTransfer = { ...records.transfers.all[records.transfers.index] };
            currentTransfer.cDate = new Date(this._date).getTime();
            currentTransfer.cExDay = new Date(this._ex_day).getTime();
            currentTransfer.cUnitQuotation = this._unit_quotation;
            currentTransfer.cAmount = this._amount;
            currentTransfer.cCount = toNumber(this._count);
            currentTransfer.cFees = this._fees;
            currentTransfer.cSTax = this._stax;
            currentTransfer.cFTax = this._ftax;
            currentTransfer.cTax = this._tax;
            currentTransfer.cSoli = this._soli;
            currentTransfer.cMarketPlace = this._market_place;
            currentTransfer.cDescription = this._description;
            if (validators.isoDate(this._date) === true) {
                await records.updateTransfer(currentTransfer);
                records.evaluateTransfers();
                records.updateWrapper(records.stocks.active_page);
                modaldialog.toggleVisibility();
            }
        }
    }
});
console.log('--- updatetransfer.js ---');
