/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {ref, type Ref} from 'vue'
import {VForm} from 'vuetify/components'
import {useApp} from '@/composables/useApp'

interface IRuntimeStore {
  _is_stocks_loading: boolean
  _show_partial_drawer: boolean
  _table: string
  _page_title: string
  _exchanges: Record<string, number | boolean>
  _dialogs: Record<string, string | boolean | undefined | Ref>
  _info_bar: {
    exchanges: Map<string, number>
    indexes: Map<string, number>
    materials: Map<string, number>
  }
}

export const useRuntimeStore: StoreDefinition<'runtime', IRuntimeStore> = defineStore('runtime', {
  state: (): IRuntimeStore => {
    return {
      _is_stocks_loading: false,
      _show_partial_drawer: true,
      _table: 'StocksTable',
      _page_title: '',
      _exchanges: {
        curusd: 1,
        cureur: 1
      },
      _dialogs: {
        _is_visible: false,
        _form: ref<InstanceType<typeof VForm>>(),
        _changes_mode: '',
        _is_ok: true,
        _is_add_company: false,
        _is_fadein_stock: false,
        _is_add_deposit: false,
        _is_add_withdrawal: false,
        _is_daily_changes: false,
        _is_export_db: false,
        _is_import_db: false,
        _is_show_accounting: false,
        _is_delete_transfer: false,
        _is_update_transfer: false,
        _is_delete_stock: false,
        _is_buy_stock: false,
        _is_sell_stock: false,
        _is_add_dividend: false,
        _is_show_dividend: false,
        _is_config_company: false
      },
      _info_bar:  {
        exchanges: new Map<string, number>(),
        indexes: new Map<string, number>(),
        materials: new Map<string, number>()
      }
    }
  },
  getters: {
    exchanges(state: IRuntimeStore) {
      return state._info_bar.exchanges
    },
    indexes(state: IRuntimeStore) {
      return state._info_bar.indexes
    },
    materials(state: IRuntimeStore) {
      return state._info_bar.materials
    },
    exchangesCurUsd(state: IRuntimeStore) {
      return state._exchanges.curusd
    },
    exchangesCurEur(state: IRuntimeStore) {
      return state._exchanges.cureur
    },
    changesMode(state: IRuntimeStore) {
      return state._dialogs._changes_mode
    },
    table(state: IRuntimeStore) {
      return state._table
    },
    isVisible(state: IRuntimeStore) {
      return state._dialogs._is_visible
    },
    isOk(state: IRuntimeStore) {
      return state._dialogs._is_ok
    },
    form(state: IRuntimeStore) {
      return state._dialogs._form
    },
    isAddCompany(state: IRuntimeStore) {
      return state._dialogs._is_add_company
    },
    isFadeinStock(state: IRuntimeStore) {
      return state._dialogs._is_fadein_stock
    },
    isAddDeposit(state: IRuntimeStore) {
      return state._dialogs._is_add_deposit
    },
    isAddWithdrawal(state: IRuntimeStore) {
      return state._dialogs._is_add_withdrawal
    },
    isDailyChanges(state: IRuntimeStore) {
      return state._dialogs._is_daily_changes
    },
    isExportDb(state: IRuntimeStore) {
      return state._dialogs._is_export_db
    },
    isImportDb(state: IRuntimeStore) {
      return state._dialogs._is_import_db
    },
    isShowAccounting(state: IRuntimeStore) {
      return state._dialogs._is_show_accounting
    },
    isDeleteTransfer(state: IRuntimeStore) {
      return state._dialogs._is_delete_transfer
    },
    isUpdateTransfer(state: IRuntimeStore) {
      return state._dialogs._is_update_transfer
    },
    isDeleteStock(state: IRuntimeStore) {
      return state._dialogs._is_delete_stock
    },
    isBuyStock(state: IRuntimeStore) {
      return state._dialogs._is_buy_stock
    },
    isSellStock(state: IRuntimeStore) {
      return state._dialogs._is_sell_stock
    },
    isAddDividend(state: IRuntimeStore) {
      return state._dialogs._is_add_dividend
    },
    isShowDividend(state: IRuntimeStore) {
      return state._dialogs._is_show_dividend
    },
    isConfigCompany(state: IRuntimeStore) {
      return state._dialogs._is_config_company
    }
  },
  actions: {
    setExchanges(entry: Map<string, number>) {
      this._info_bar.exchanges = entry
    },
    setIndexes(entry: Map<string, number>) {
      this._info_bar.indexes = entry
    },
    setMaterials(entry: Map<string, number>) {
      this._info_bar.materials = entry
    },
    setExchangesUsd(value: number) {
      this._exchanges.curusd = value
    },
    setExchangesEur(value: number) {
      this._exchanges.cureur = value
    },
    setIsOk(value: boolean) {
      this._dialogs._is_ok = value
    },
    toggleVisibility(ev = '') {
      const {CONS} = useApp()
      let dialogId = ''
      if (ev !== undefined) {
        dialogId = ev
      }
      if (ev.target !== undefined && ev.target.id !== '') {
        dialogId = ev.target.id
      }
      if (ev.target !== undefined && ev.target.parentElement !== undefined && ev.target.parentElement.id !== '') {
        dialogId = ev.target.parentElement.id
      }
      this._dialogs._changes_mode = dialogId
      console.info('MODALDIALOG: toggleVisibility', dialogId)
      this._dialogs._is_visible = !this._dialogs._is_visible
      switch (dialogId) {
        case CONS.DIALOGS.ADDCOMPANY:
          this._dialogs._is_add_company = !this._dialogs._is_add_company
          break
        case CONS.DIALOGS.FADEINSTOCK:
          this._dialogs._is_fadein_stock = !this._dialogs._is_fadein_stock
          break
        case CONS.DIALOGS.ADDDEPOSIT:
          this._dialogs._is_add_deposit = !this._dialogs._is_add_deposit
          break
        case CONS.DIALOGS.ADDWITHDRAWAL:
          this._dialogs._is_add_withdrawal = !this._dialogs._is_add_withdrawal
          break
        case CONS.DIALOGS.DAILYCHANGES:
          this._dialogs._is_daily_changes = !this._dialogs._is_daily_changes
          break
        case CONS.DIALOGS.DAILYCHANGESALL:
          this._dialogs._is_daily_changes = !this._dialogs._is_daily_changes
          break
        case CONS.DIALOGS.EXPORTDB:
          this._dialogs._is_export_db = !this._dialogs._is_export_db
          break
        case CONS.DIALOGS.IMPORTDB:
          this._dialogs._is_import_db = !this._dialogs._is_import_db
          break
        case CONS.DIALOGS.SHOWACCOUNTING:
          this._dialogs._is_show_accounting = !this._dialogs._is_show_accounting
          break
        case CONS.DIALOGS.DELETETRANSFER:
          this._dialogs._is_delete_transfer = !this._dialogs._is_delete_transfer
          break
        case CONS.DIALOGS.UPDATETRANSFER:
          this._dialogs._is_update_transfer = !this._dialogs._is_update_transfer
          break
        case CONS.DIALOGS.DELETESTOCK:
          this._dialogs._is_delete_stock = !this._dialogs._is_delete_stock
          break
        case CONS.DIALOGS.BUYSTOCK:
          this._dialogs._is_buy_stock = !this._dialogs._is_buy_stock
          break
        case CONS.DIALOGS.SELLSTOCK:
          this._dialogs._is_sell_stock = !this._dialogs._is_sell_stock
          break
        case CONS.DIALOGS.ADDDIVIDEND:
          this._dialogs._is_add_dividend = !this._dialogs._is_add_dividend
          break
        case CONS.DIALOGS.SHOWDIVIDEND:
          this._dialogs._is_show_dividend = !this._dialogs._is_show_dividend
          break
        case CONS.DIALOGS.CONFIGSTOCK:
          this._dialogs._is_config_company = !this._dialogs._is_config_company
          break
        default:
          this._dialogs._is_add_company = false
          this._dialogs._is_fadein_stock = false
          this._dialogs._is_add_deposit = false
          this._dialogs._is_add_withdrawal = false
          this._dialogs._is_daily_changes = false
          this._dialogs._is_export_db = false
          this._dialogs._is_import_db = false
          this._dialogs._is_show_accounting = false
          this._dialogs._is_delete_stock = false
          this._dialogs._is_buy_stock = false
          this._dialogs._is_sell_stock = false
          this._dialogs._is_add_dividend = false
          this._dialogs._is_show_dividend = false
          this._dialogs._is_config_company = false
          this._dialogs._is_delete_transfer = false
          this._dialogs._is_update_transfer = false
          this._dialogs._is_visible = false
      }
    },
    setTable(value: string) {
      this._table = value
    },
    setIsStocksLoading(value: boolean) {
      this._is_stocks_loading = value
    }
  }
})

console.log('--- runtime.js ---')
