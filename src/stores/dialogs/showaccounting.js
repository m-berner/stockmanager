import { defineStore } from 'pinia';
import { useConstants } from '@/libraries/useConstants';
import { useRecordsStore } from '@/stores/records';
const CONS = useConstants();
export const useShowaccountingStore = defineStore('showaccounting', {
    state: () => {
        return {
            _return_rate: 0,
            _efficiency: 0,
            _year: new Date().getFullYear(),
            _deposits: 0,
            _withdrawals: 0,
            _fees: 0,
            _taxes: 0,
            _dividends: 0,
            _earnings: 0
        };
    },
    getters: {
        returnRate: (state) => {
            return state._return_rate;
        },
        efficiency: (state) => {
            return state._efficiency;
        },
        year: (state) => {
            return state._year;
        },
        deposits: (state) => {
            return state._deposits;
        },
        withdrawals: (state) => {
            return state._withdrawals;
        },
        fees: (state) => {
            return state._fees;
        },
        taxes: (state) => {
            return state._taxes;
        },
        dividends: (state) => {
            return state._dividends;
        },
        earnings: (state) => {
            return state._earnings;
        }
    },
    actions: {
        setYear(value) {
            this._year = value;
        },
        onYearAccounting() {
            console.info('SHOWACCOUNTING: onYearAccounting', this._year);
            const records = useRecordsStore();
            const a = records.evaluateTransfers(this._year);
            const b = this._year === records.firstYearTransfers
                ? CONS.RECORDS.CONTROLLER.TOTAL
                : records.evaluateTransfers(this._year - 1);
            this._return_rate =
                a.deposits + a.withdrawals + (b.deposits + b.withdrawals) / 2 !== 0
                    ? (a.earnings - b.earnings + a.dividends - b.dividends + a.taxes - b.taxes + a.fees - b.fees) /
                        (a.deposits + a.withdrawals + (b.deposits + b.withdrawals) / 2)
                    : 0;
            this._efficiency = a.taxes + a.fees !== 0 ? (a.earnings + a.dividends) / -(a.taxes + a.fees) : 0;
            this._taxes = a.taxes - b.taxes;
            this._fees = a.fees - b.fees;
            this._dividends = a.dividends - b.dividends;
            this._withdrawals = a.withdrawals - b.withdrawals;
            this._earnings = a.earnings - b.earnings;
            this._deposits = a.deposits - b.deposits;
        }
    }
});
console.log('--- showaccounting.js ---');
