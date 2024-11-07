import { defineStore } from 'pinia';
import { useApp } from '@/useApp';
import { ref } from 'vue';
import { VForm } from 'vuetify/components';
const { CONS } = useApp();
export const useModaldialogStore = defineStore('modaldialog', {
    state: () => {
        return {
            _visibility: false,
            _form: ref(),
            _toggle: '',
            _noOk: false,
            _add_stock: false,
            _fadein_stock: false,
            _add_deposit: false,
            _add_withdrawal: false,
            _daily_changes: false,
            _export_db: false,
            _import_db: false,
            _show_accounting: false,
            _delete_transfer: false,
            _update_transfer: false,
            _delete_stock: false,
            _buy_stock: false,
            _sell_stock: false,
            _add_dividend: false,
            _show_dividend: false,
            _config_stock: false
        };
    },
    getters: {
        visibility: (state) => {
            return state._visibility;
        },
        noOk: (state) => {
            return state._noOk;
        },
        form: (state) => {
            return state._form;
        },
        toggle: (state) => {
            return state._toggle;
        },
        addStock: (state) => {
            return state._add_stock;
        },
        fadeinStock: (state) => {
            return state._fadein_stock;
        },
        addDeposit: (state) => {
            return state._add_deposit;
        },
        addWithdrawal: (state) => {
            return state._add_withdrawal;
        },
        dailyChanges: (state) => {
            return state._daily_changes;
        },
        exportDb: (state) => {
            return state._export_db;
        },
        importDb: (state) => {
            return state._import_db;
        },
        showAccounting: (state) => {
            return state._show_accounting;
        },
        deleteTransfer: (state) => {
            return state._delete_transfer;
        },
        updateTransfer: (state) => {
            return state._update_transfer;
        },
        deleteStock: (state) => {
            return state._delete_stock;
        },
        buyStock: (state) => {
            return state._buy_stock;
        },
        sellStock: (state) => {
            return state._sell_stock;
        },
        addDividend: (state) => {
            return state._add_dividend;
        },
        showDividend: (state) => {
            return state._show_dividend;
        },
        configStock: (state) => {
            return state._config_stock;
        }
    },
    actions: {
        setNoOk(value) {
            this._noOk = value;
        },
        toggleVisibility(ev = '') {
            let toggle = '';
            if (ev !== undefined) {
                toggle = ev;
            }
            if (ev.target !== undefined && ev.target.id !== '') {
                toggle = ev.target.id;
            }
            if (ev.target !== undefined && ev.target.parentElement !== undefined && ev.target.parentElement.id !== '') {
                toggle = ev.target.parentElement.id;
            }
            this._toggle = toggle;
            console.info('MODALDIALOG: toggleVisibility', toggle);
            this._visibility = !this._visibility;
            switch (toggle) {
                case CONS.DIALOGS.ADDSTOCK:
                    this._add_stock = !this._add_stock;
                    break;
                case CONS.DIALOGS.FADEINSTOCK:
                    this._fadein_stock = !this._fadein_stock;
                    break;
                case CONS.DIALOGS.ADDDEPOSIT:
                    this._add_deposit = !this._add_deposit;
                    break;
                case CONS.DIALOGS.ADDWITHDRAWAL:
                    this._add_withdrawal = !this._add_withdrawal;
                    break;
                case CONS.DIALOGS.DAILYCHANGES:
                    this._daily_changes = !this._daily_changes;
                    break;
                case CONS.DIALOGS.DAILYCHANGESALL:
                    this._daily_changes = !this._daily_changes;
                    break;
                case CONS.DIALOGS.EXPORTDB:
                    this._export_db = !this._export_db;
                    break;
                case CONS.DIALOGS.IMPORTDB:
                    this._import_db = !this._import_db;
                    break;
                case CONS.DIALOGS.SHOWACCOUNTING:
                    this._show_accounting = !this._show_accounting;
                    break;
                case CONS.DIALOGS.DELETETRANSFER:
                    this._delete_transfer = !this.delete_transfer;
                    break;
                case CONS.DIALOGS.UPDATETRANSFER:
                    this._update_transfer = !this._update_transfer;
                    break;
                case CONS.DIALOGS.DELETESTOCK:
                    this._delete_stock = !this._delete_stock;
                    break;
                case CONS.DIALOGS.BUYSTOCK:
                    this._buy_stock = !this._buy_stock;
                    break;
                case CONS.DIALOGS.SELLSTOCK:
                    this._sell_stock = !this._sell_stock;
                    break;
                case CONS.DIALOGS.ADDDIVIDEND:
                    this._add_dividend = !this._add_dividend;
                    break;
                case CONS.DIALOGS.SHOWDIVIDEND:
                    this._show_dividend = !this._show_dividend;
                    break;
                case CONS.DIALOGS.CONFIGSTOCK:
                    this._config_stock = !this._config_stock;
                    break;
                default:
                    this._add_stock = false;
                    this._fadein_stock = false;
                    this._add_deposit = false;
                    this._add_withdrawal = false;
                    this._daily_changes = false;
                    this._export_db = false;
                    this._import_db = false;
                    this._show_accounting = false;
                    this._delete_stock = false;
                    this._buy_stock = false;
                    this._sell_stock = false;
                    this._add_dividend = false;
                    this._show_dividend = false;
                    this._config_stock = false;
                    this._delete_transfer = false;
                    this._update_transfer = false;
                    this._visibility = false;
            }
        }
    }
});
console.log('--- modaldialog.js ---');
