/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useApp} from '@/useApp'
import {ref, type Ref} from 'vue'
import {VForm} from 'vuetify/components'

interface IModaldialogStore {
  _visibility: boolean
  _form: Ref
  _toggle: string
  _noOk: boolean
  _add_stock: boolean
  _fadein_stock: boolean
  _add_deposit: boolean
  _add_withdrawal: boolean
  _daily_changes: boolean
  _export_db: boolean
  _import_db: boolean
  _show_accounting: boolean
  _delete_transfer: boolean
  _update_transfer: boolean
  _delete_stock: boolean
  _buy_stock: boolean
  _sell_stock: boolean
  _add_dividend: boolean
  _show_dividend: boolean
  _config_stock: boolean
}

const {CONS} = useApp()

export const useModaldialogStore: StoreDefinition<'modaldialog', IModaldialogStore> = defineStore('modaldialog', {
  state: () => {
    return {
      _visibility: false,
      _form: ref<InstanceType<typeof VForm>>(),
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
    }
  },
  getters: {
    visibility: (state: IModaldialogStore) => {
      return state._visibility
    },
    noOk: (state: IModaldialogStore) => {
      return state._noOk
    },
    form: (state: IModaldialogStore) => {
      return state._form
    },
    toggle: (state: IModaldialogStore) => {
      return state._toggle
    },
    // noOk: (state: IModaldialogStore) => {
    //   return state._noOk
    // },
    addStock: (state: IModaldialogStore) => {
      return state._add_stock
    },
    fadeinStock: (state: IModaldialogStore) => {
      return state._fadein_stock
    },
    addDeposit: (state: IModaldialogStore) => {
      return state._add_deposit
    },
    addWithdrawal: (state: IModaldialogStore) => {
      return state._add_withdrawal
    },
    dailyChanges: (state: IModaldialogStore) => {
      return state._daily_changes
    },
    exportDb: (state: IModaldialogStore) => {
      return state._export_db
    },
    importDb: (state: IModaldialogStore) => {
      return state._import_db
    },
    showAccounting: (state: IModaldialogStore) => {
      return state._show_accounting
    },
    deleteTransfer: (state: IModaldialogStore) => {
      return state._delete_transfer
    },
    updateTransfer: (state: IModaldialogStore) => {
      return state._update_transfer
    },
    deleteStock: (state: IModaldialogStore) => {
      return state._delete_stock
    },
    buyStock: (state: IModaldialogStore) => {
      return state._buy_stock
    },
    sellStock: (state: IModaldialogStore) => {
      return state._sell_stock
    },
    addDividend: (state: IModaldialogStore) => {
      return state._add_dividend
    },
    showDividend: (state: IModaldialogStore) => {
      return state._show_dividend
    },
    configStock: (state: IModaldialogStore) => {
      return state._config_stock
    }
  },
  actions: {
    setNoOk(value: boolean) {
      this._noOk = value
    },
    toggleVisibility(ev = '') {
      let toggle = ''
      if (ev !== undefined) {
        toggle = ev
      }
      if (ev.target !== undefined && ev.target.id !== '') {
        toggle = ev.target.id
      }
      if (ev.target !== undefined && ev.target.parentElement !== undefined && ev.target.parentElement.id !== '') {
        toggle = ev.target.parentElement.id
      }
      this._toggle = toggle
      console.info('MODALDIALOG: toggleVisibility', toggle)
      this._visibility = !this._visibility
      switch (toggle) {
        case CONS.DIALOGS.ADDSTOCK:
          this._add_stock = !this._add_stock
          break
        case CONS.DIALOGS.FADEINSTOCK:
          this._fadein_stock = !this._fadein_stock
          break
        case CONS.DIALOGS.ADDDEPOSIT:
          this._add_deposit = !this._add_deposit
          break
        case CONS.DIALOGS.ADDWITHDRAWAL:
          this._add_withdrawal = !this._add_withdrawal
          break
        case CONS.DIALOGS.DAILYCHANGES:
          this._daily_changes = !this._daily_changes
          break
        case CONS.DIALOGS.DAILYCHANGESALL:
          this._daily_changes = !this._daily_changes
          break
        case CONS.DIALOGS.EXPORTDB:
          this._export_db = !this._export_db
          break
        case CONS.DIALOGS.IMPORTDB:
          this._import_db = !this._import_db
          break
        case CONS.DIALOGS.SHOWACCOUNTING:
          this._show_accounting = !this._show_accounting
          break
        case CONS.DIALOGS.DELETETRANSFER:
          this._delete_transfer = !this.delete_transfer
          break
        case CONS.DIALOGS.UPDATETRANSFER:
          this._update_transfer = !this._update_transfer
          break
        case CONS.DIALOGS.DELETESTOCK:
          this._delete_stock = !this._delete_stock
          break
        case CONS.DIALOGS.BUYSTOCK:
          this._buy_stock = !this._buy_stock
          break
        case CONS.DIALOGS.SELLSTOCK:
          this._sell_stock = !this._sell_stock
          break
        case CONS.DIALOGS.ADDDIVIDEND:
          this._add_dividend = !this._add_dividend
          break
        case CONS.DIALOGS.SHOWDIVIDEND:
          this._show_dividend = !this._show_dividend
          break
        case CONS.DIALOGS.CONFIGSTOCK:
          this._config_stock = !this._config_stock
          break
        default:
          this._add_stock = false
          this._fadein_stock = false
          this._add_deposit = false
          this._add_withdrawal = false
          this._daily_changes = false
          // this._daily_changes_all = false
          this._export_db = false
          this._import_db = false
          this._show_accounting = false
          this._delete_stock = false
          this._buy_stock = false
          this._sell_stock = false
          this._add_dividend = false
          this._show_dividend = false
          this._config_stock = false
          this._delete_transfer = false
          this._update_transfer = false
          this._visibility = false
      }
    }
  }
})

console.log('--- modaldialog.js ---')
