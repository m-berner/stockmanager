/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useOnlineStore} from '@/stores/online'
import {useRuntimeStore} from '@/stores/runtime'
import {useSettingsStore} from '@/stores/settings'
import {useModaldialogStore} from '@/stores/modaldialog'
import {toRaw} from 'vue'
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'

interface IDividend {
  year: number
  dividend: number
}

interface IRecordsStore {
  _dbi: IDBDatabase | null
  _stocks: IRecordStoreStocks
  _transfers: IRecordStoreTransfers
  _bkup_object: IBackup
  _dividends_per_stock: Map<number, ITransfer[]>
  _show_dividends: IDividend[]
}

interface IRecordStoreTransfers {
  all: ITransfer[]
  stockController: Map<number, IStockController>
  totalController: ITotalController
}

interface IRecordStoreStocks {
  all: IStock[]
  active: IStock[]
  passive: IStock[]
  active_page: number
  active_index: number
  active_page_count: number
  active_portfolio_count: number
}

const CONS = useConstants()
const {notice, offset, migrateStock, migrateTransfer} = useAppLibrary()

export const useRecordsStore: StoreDefinition<'records', IRecordsStore> = defineStore('records', {
  state: (): IRecordsStore => {
    return {
      _dbi: null,
      _stocks: {
        all: [],
        active: [],
        passive: [],
        active_page: 1,
        active_page_count: 0,
        active_portfolio_count: 0,
        active_index: -1
      },
      _transfers: {
        all: [],
        stockController: new Map<number, IStockController>(),
        totalController: CONS.RECORDS.CONTROLLER.TOTAL
      },
      _bkup_object: {
        sm: {
          cVersion: 0,
          cDBVersion: 0,
          cDBCurrency: '',
          cEngine: ''
        },
        stocks: [],
        transfers: []
      },
      _dividends_per_stock: new Map<number, ITransfer[]>(),
      _show_dividends: []
    }
  },
  getters: {
    stocks: (state: IRecordsStore) => {
      return state._stocks
    },
    transfers: (
      state: IRecordsStore
    ): {
      all: ITransfer[]
      stockController: Map<number, IStockController>
      totalController: ITotalController
    } => {
      return state._transfers
    },
    dbi: (state: IRecordsStore): IDBDatabase | null => {
      return state._dbi
    },
    bkupObject: (state: IRecordsStore): IBackup => {
      return state._bkup_object
    },
    firstYearTransfers(state: IRecordsStore): number {
      const years: number[] = state._transfers.all.map((record: ITransfer) => {
        return new Date(record.mSortDate ?? 0).getFullYear()
      })
      return Math.min(...Array.from(new Set(years)))
    },
    yearRangeTransfers(state: IRecordsStore): number[] {
      const years: number[] = state._transfers.all.map((record: ITransfer) => {
        return new Date(record.mSortDate ?? 0).getFullYear()
      })
      const uniqueYears = Array.from(new Set(years))
      uniqueYears.sort((a: number, b: number): number => {
        return b - a
      })
      return uniqueYears
    },
    checkActiveStocksRate(state: IRecordsStore): boolean {
      const settings = useSettingsStore()
      let result = true
      if (state._stocks.active.length > 0) {
        for (
          let i = (state._stocks.active_page - 1) * settings.itemsPerPageStocks;
          i < (state._stocks.active_page - 1) * settings.itemsPerPageStocks + state._stocks.active_page_count;
          i++
        ) {
          if (state._stocks.active[i].mValue !== 0) {
            result = false
          }
        }
      }
      return result
    }
  },
  actions: {
    _loadStockIntoStore(stock: IStock): void {
      const memRecord = {
        ...stock,
        ...CONS.RECORDS.TEMPLATES.MSTOCK
      }
      this._stocks.all.push(memRecord)
      if (memRecord.cFadeOut === 1) {
        this._stocks.passive.push(memRecord)
      } else if (memRecord.cFadeOut === 0) {
        this._stocks.active.push(memRecord)
      }
    },
    _loadTransferIntoStore(stock: IStock[], transfer: ITransfer): void {
      if (transfer.cType === CONS.DB.RECORD_TYPES.DIV) {
        transfer.mSortDate = transfer.cExDay
      } else {
        transfer.mSortDate = transfer.cDate
      }
      if (stock.length > 0) {
        transfer.mCompany = toRaw(stock[0]).cCompany
      } else {
        transfer.mCompany = ''
      }
      this._transfers.all.push(transfer)
    },
    _setStocksPortfolio(): void {
      console.info('RECORDS: _setStocksPortfolio')
      let portfolio = 0
      let same = false
      const buySellTransfers = this._transfers.all.filter((transfer: ITransfer) => {
        return transfer.cType === CONS.DB.RECORD_TYPES.BUY || transfer.cType === CONS.DB.RECORD_TYPES.SELL
      })
      buySellTransfers.sort((a: ITransfer, b: ITransfer): number => {
        return a.cStockID - b.cStockID
      })
      for (let i = 0; i < buySellTransfers.length; i++) {
        if (!same) {
          portfolio = buySellTransfers[i].cCount
        }
        if (i < buySellTransfers.length - 1 && buySellTransfers[i].cStockID === buySellTransfers[i + 1].cStockID) {
          portfolio = portfolio + buySellTransfers[i + 1].cCount
          same = true
        } else {
          const indexByID = this._stocks.all.findIndex((stock: IStock) => {
            return stock.cID === buySellTransfers[i].cStockID
          })
          if (indexByID > -1) {
            this._stocks.all[indexByID].mPortfolio = portfolio
            same = false
          }
        }
      }
    },
    _readIsin(p: number): TFetch[] {
      console.info('RECORDS: _readIsin', p)
      const settings = useSettingsStore()
      const isin: TFetch[] = []
      const rest = this._stocks.active.length % settings.itemsPerPageStocks
      const lastPage = Math.ceil(this._stocks.active.length / settings.itemsPerPageStocks)

      this._stocks.active_page_count = p < lastPage ? settings.itemsPerPageStocks : rest
      this._stocks.active_portfolio_count = this._stocks.active.filter((stock: IStock) => {
        let portfolio = 0
        if (stock.mPortfolio !== undefined) {
          portfolio = stock.mPortfolio
        }
        return portfolio > 0
      }).length
      const portfolioCount = Math.ceil(this._stocks.active_portfolio_count / settings.itemsPerPageStocks)
      let pageStocks: IStock[] = []
      this._stocks.active_page = p
      if (this._stocks.active.length > 0) {
        if (portfolioCount > 1 && p <= portfolioCount) {
          if (p === 1) {
            pageStocks = this._stocks.active.slice(
              (p - 1) * settings.itemsPerPageStocks,
              (p - 1) * settings.itemsPerPageStocks + portfolioCount * this._stocks.active_page_count
            )
          }
        } else {
          pageStocks = this._stocks.active.slice(
            (p - 1) * settings.itemsPerPageStocks,
            (p - 1) * settings.itemsPerPageStocks + this._stocks.active_page_count
          )
        }
        for (let i = 0; i < pageStocks.length; i++) {
          isin.push({id: pageStocks[i].cID, isin: pageStocks[i].cISIN, min: '0', rate: '0', max: '0', cur: ''})
        }
      }
      return isin
    },
    _sortTransfers(): ITransfer[] {
      return this._transfers.all.sort((a: ITransfer, b: ITransfer): number => {
        return (b.mSortDate ?? 0) - (a.mSortDate ?? 0)
      })
    },
    _sortActiveStocks(): void {
      this._stocks.active.sort((a: IStock, b: IStock): number => {
        return (a.cID ?? 0) - (b.cID ?? 0)
      })
      this._stocks.active.sort((a: IStock, b: IStock): number => {
        return (b.cFirstPage ?? 0) - (a.cFirstPage ?? 0)
      })
      this._stocks.active.sort((a: IStock, b: IStock): number => {
        return (b.mPortfolio ?? 0) - (a.mPortfolio ?? 0)
      })
    },
    _getActiveStocksIndexById(ident: number): number {
      return this._stocks.active.findIndex((stock: IStock) => {
        return stock.cID === ident
      })
    },
    initShowDividends(): void {
      console.log('RECORDS: initShowDividends', this._dividends_per_stock)
      const dividendTransfersPerStock =
        this._dividends_per_stock.get(this._stocks.active[this._stocks.active_index].cID) ?? []
      this._show_dividends = []
      for (let i = 0; i < dividendTransfersPerStock.length; i++) {
        const transfer = dividendTransfersPerStock[i]
        this._show_dividends.push({
          year: transfer.cDate,
          dividend: transfer.cCount * transfer.cUnitQuotation
        })
      }
    },
    setDrawerDepot(): void {
      console.log('RECORDS: setDrawerDepot')
      const portfolio = this._stocks.active.filter((stock: IStock) => {
        return (stock.mPortfolio ?? 0) > 0
      })
      const total = this._transfers.totalController
      let depot = 0
      let buyvalue = 0
      portfolio.forEach((stock: IStock) => {
        depot += (stock.mPortfolio ?? 0) * (stock.mValue ?? 0)
        buyvalue += (stock.mPortfolio ?? 0) * (stock.mBuyValue ?? 0)
      })
      total.depot = depot
      total.winloss = depot - buyvalue + total.fees + total.taxes + total.dividends + total.earnings
      total.winlossPercent =
        total.withdrawals + total.deposits - total.account !== 0
          ? total.winloss / (total.withdrawals + total.deposits - total.account)
          : 0
    },
    setActiveStocksValues(
      index: number,
      value: number,
      min: number,
      max: number,
      echange: number,
      pchange: number
    ): void {
      this._stocks.active[index].mValue = value
      this._stocks.active[index].mMin = min
      this._stocks.active[index].mMax = max
      this._stocks.active[index].mEuroChange = echange
      this._stocks.active[index].mChange = pchange
    },
    resetActiveStocksValues(): void {
      const records = useRecordsStore()
      const settings = useSettingsStore()
      if (this._stocks.active.length > 0) {
        for (
          let i = (records.stocks.active_page - 1) * settings.itemsPerPageStocks;
          i < (records.stocks.active_page - 1) * settings.itemsPerPageStocks + records.stocks.active_page_count;
          i++
        ) {
          this._stocks.active[i].mValue = 0
          this._stocks.active[i].mMin = 0
          this._stocks.active[i].mMax = 0
          this._stocks.active[i].mChange = 0
          this._stocks.active[i].mEuroChange = 0
        }
      }
    },
    setBkupObject(value: IBackup) {
      delete value?.orders // NOTE: before version 23
      this._bkup_object = {
        sm: {
          cVersion: 0,
          cDBVersion: 0,
          cDBCurrency: '',
          cEngine: ''
        },
        stocks: [],
        transfers: []
      }
      this._bkup_object = value
    },
    setActiveStocksPage(value: number): void {
      this._stocks.active_page = value
    },
    setActiveStockIndexForGivenId(value: number): void {
      this._stocks.active_index = this._stocks.active.findIndex((rec: IStock) => {
        return rec.cID === value
      })
    },
    setTransferIndexForGivenId(value: number): void {
      this._transfers.index = this._transfers.all.findIndex((rec: ITransfer) => {
        return rec.cID === value
      })
    },
    evaluateTransfers(year = CONS.DEFAULTS.YEAR): ITotalController {
      console.info('RECORDS: evaluateTransfers', year)
      const oldestTransferFirst = [...this._transfers.all]
      oldestTransferFirst.sort((a: ITransfer, b: ITransfer): number => {
        return (a.mSortDate ?? 0) - (b.mSortDate ?? 0)
      })
      const allStocksPlusZero = [{cID: 0}, ...this._stocks.all]
      const totalController: ITotalController = {...CONS.RECORDS.CONTROLLER.TOTAL}
      //
      allStocksPlusZero.forEach((stock: IStock) => {
        const transfersPerStock = oldestTransferFirst.filter((transfer: ITransfer) => {
          const currentYear = new Date(transfer.mSortDate ?? 0).getFullYear()
          return transfer.cStockID === stock.cID && currentYear <= year
        })
        const dividendController: ITransfer[] = []
        const activeStockIndex = this._getActiveStocksIndexById(stock.cID)
        let portfolio = 0
        let buyCount = 0
        let invest = 0
        transfersPerStock.forEach((transfer: ITransfer) => {
          totalController.fees += transfer.cFees ?? 0
          totalController.taxes +=
            (transfer.cTax ?? 0) + (transfer.cFTax ?? 0) + (transfer.cSTax ?? 0) + (transfer.cSoli ?? 0)
          console.error('transfer',transfer)
          switch (transfer.cType) {
            case CONS.DB.RECORD_TYPES.BUY:
              totalController.buy += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0)
              portfolio += transfer.cCount ?? 0
              buyCount += transfer.cCount ?? 0
              invest += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0)
              break
            case CONS.DB.RECORD_TYPES.SELL:
              totalController.sell += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0)
              portfolio += transfer.cCount ?? 0
              invest = (portfolio * invest) / buyCount
              buyCount = portfolio
              if (portfolio < 0.9 && portfolio > -0.9) {
                portfolio = 0
                buyCount = 0
                invest = 0
              }
              break
            case CONS.DB.RECORD_TYPES.DIV:
              totalController.dividends += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0)
              dividendController.push(transfer)
              break
            case CONS.DB.RECORD_TYPES.DEPOSIT:
              totalController.deposits += transfer.cAmount ?? 0
              break
            case CONS.DB.RECORD_TYPES.WITHDRAWAL:
              totalController.withdrawals += transfer.cAmount ?? 0
              break
            default:
              console.error('RECORDS: evaluateTransfers:unknown type', transfer.cType)
          }
        })
        if (activeStockIndex > -1) {
          this._stocks.active[activeStockIndex].mPortfolio = portfolio
          this._stocks.active[activeStockIndex].mBuyValue = buyCount > 0.9 ? invest / buyCount : 0
          this._dividends_per_stock.set(stock.cID, dividendController)
        }
        totalController.depotBuyValue += buyCount > 0.9 ? (portfolio * invest) / buyCount : 0
      })
      totalController.account =
        totalController.dividends +
        totalController.deposits -
        totalController.sell +
        totalController.withdrawals -
        totalController.buy +
        totalController.fees +
        totalController.taxes
      totalController.earnings = totalController.depotBuyValue - totalController.sell - totalController.buy
      if (year === CONS.DEFAULTS.YEAR) {
        this._transfers.totalController = totalController
      }
      console.error(totalController)
      return {...totalController}
    },
    updatePage(p: number): void {
      console.info('RECORDS: updatePage', p)
      const settings = useSettingsStore()
      const online = useOnlineStore()
      const overPaged = this._stocks.active.filter((rec: IStock) => {
        return (rec.mPortfolio ?? 0) > 0
      }).length
      console.error(overPaged)
      // TODO what if the portfolio consists out of more than 9 shares?
      for (
        let i = (this._stocks.active_page - 1) * settings.itemsPerPageStocks;
        i < Math.max((this._stocks.active_page - 1) * settings.itemsPerPageStocks + this._stocks.active_page_count, overPaged);
        i++
      ) {
        const id = this._stocks.active[i].cID as number
        const {rate, min, max} = online.minRateMax.get(id) ?? {rate: 0, min: 0, max: 0}
        const buyValue = this._stocks.active[i].mBuyValue ?? 0
        const portfolio = this._stocks.active[i].mPortfolio ?? 0
        const euroChange = (rate - buyValue) * portfolio
        const percentChange = buyValue * portfolio !== 0 ? (euroChange * 100) / (buyValue * portfolio) : 0
        this.setActiveStocksValues(i, rate, min, max, euroChange, percentChange)
      }
      const rest = this._stocks.active.length % settings.itemsPerPageStocks
      const lastPage = Math.ceil(this._stocks.active.length / settings.itemsPerPageStocks)
      this._stocks.active_page_count = p < lastPage ? settings.itemsPerPageStocks : rest
      this._stocks.active_page = p
      if (this._stocks.active.length > 0) {
        this._stocks.active.slice(
          (p - 1) * settings.itemsPerPageStocks,
          (p - 1) * settings.itemsPerPageStocks + this._stocks.active_page_count
        )
      }
    },
    loadBkupObjectIntoStore(): void {
      let stock: IStock
      let transfer: ITransfer
      let addStock: IStock
      let newTransfer: ITransfer
      let currentStock: IStock[]
      for (stock of this._bkup_object.stocks) {
        addStock = migrateStock({...stock})
        this._loadStockIntoStore(addStock)
      }
      for (transfer of this._bkup_object.transfers) {
        newTransfer = migrateTransfer({...transfer})
        currentStock = this._stocks.all.filter((stock: IStock) => {
          return stock.cID === newTransfer.cStockID
        })
        this._loadTransferIntoStore(currentStock, newTransfer)
      }
      this.evaluateTransfers()
      this._sortActiveStocks()
      this.setActiveStocksPage(1)
      this.resetActiveStocksValues()
    },
    updateWrapper(p: number): void {
      console.log('RECORDS: updateWrapper')
      const runtime = useRuntimeStore()
      // const onMessage = (ev: MessageEvent) => {
      //   console.info('RECORDS: onMessage')
      //   const online = useOnlineStore()
      //   switch (ev.type) {
      //     case CONS.FETCH_API.ANSWER__MIN_RATE_MAX:
      //       online.setMinRateMax(ev.data)
      //       runtime.setShowPartialDrawer(false)
      //       this.updatePage(p)
      //       this.setDrawerDepot()
      //       break
      //     case CONS.FETCH_API.ANSWER__DATES_DATA:
      //       runtime.updateDatesForPage(p - 1, false)
      //       online.setDatesData(new Map(ev.data))
      //       for (let i = 0; i < ev.data.length; i++) {
      //         const rec = this.stocks.active[this._getActiveStocksIndexById(ev.data[i][0])]
      //         if (rec.cMeetingDay < ev.data[i][1].gm) {
      //           rec.cMeetingDay = ev.data[i][1].gm
      //         }
      //         if (rec.cQuarterDay < ev.data[i][1].qf) {
      //           rec.cQuarterDay = ev.data[i][1].qf
      //         }
      //         if (rec.cMeetingDay < ev.data[i][1].gm || rec.cQuarterDay < ev.data[i][1].qf) {
      //           this.updateTransfer(rec)
      //         }
      //       }
      //       break
      //   }
      // }
      const isinData = this._readIsin(p)
      this.setActiveStocksPage(p)
      // if (!browser.runtime.onMessage.hasListener(onMessage)) {
      //   browser.runtime.onMessage.addListener(onMessage)
      // }
      browser.runtime.sendMessage({type: CONS.FETCH_API.ASK__MIN_RATE_MAX, data: isinData})
      if (runtime.datesForPage[p - 1] === undefined) {
        browser.runtime.sendMessage({type: CONS.FETCH_API.ASK__DATES_DATA, data: isinData})
      }
    },
    async cleanStoreAndDatabase(): Promise<string> {
      console.log('RECORDS: cleanStoreAndDatabase')
      this._stocks.active.splice(0, this._stocks.active.length)
      this._stocks.passive.splice(0, this._stocks.passive.length)
      this._stocks.all.splice(0, this._stocks.all.length)
      this._transfers.totalController = CONS.RECORDS.CONTROLLER.TOTAL
      this._transfers.stockController = new Map<number, IStockController>()
      this._transfers.all.splice(0, this._transfers.all.length)
      return await new Promise((resolve, reject) => {
        const onError = (ev: ErrorEvent): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false)
          reject(ev.message)
        }
        const onComplete = (): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.COMP, onComplete, false)
          resolve('Cleared database and records store!')
        }
        const onSuccessClearStocks = (): void => {
          requestClearStocks.addEventListener(CONS.EVENTS.SUC, onSuccessClearStocks, false)
          console.info('RECORDS: dropped stocks')
        }
        const onSuccessClearTransfers = (): void => {
          requestClearTransfers.addEventListener(CONS.EVENTS.SUC, onSuccessClearStocks, false)
          console.info('RECORDS: dropped transfers')
        }
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S, CONS.DB.STORES.T], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.COMP, onComplete, false)
        requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false)
        const requestClearStocks = requestTransaction.objectStore(CONS.DB.STORES.S).clear()
        requestClearStocks.addEventListener(CONS.EVENTS.SUC, onSuccessClearStocks, false)
        const requestClearTransfers = requestTransaction.objectStore(CONS.DB.STORES.T).clear()
        requestClearTransfers.addEventListener(CONS.EVENTS.SUC, onSuccessClearTransfers, false)
      })
    },
    async openDatabase(): Promise<string> {
      return await new Promise((resolve, reject) => {
        const onError = (err: ErrorEvent): void => {
          reject(err.message)
        }
        const onSuccess = (ev: Event): void => {
          this._dbi = (ev.target as IDBOpenDBRequest).result
          resolve('RECORDS: database opened successfully!')
        }
        const openDBRequest = indexedDB.open(CONS.DB.NAME, CONS.DB.VERSION)
        openDBRequest.addEventListener(CONS.EVENTS.SUC, onSuccess, CONS.SYSTEM.ONCE)
        openDBRequest.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE)
      })
    },
    async loadDatabaseIntoStore(): Promise<string> {
      console.info('RECORDS: loadDatabaseIntoStore')
      const runtime = useRuntimeStore()
      this._stocks.all.splice(0, this._stocks.all.length)
      this._stocks.active.splice(0, this._stocks.active.length)
      this._stocks.passive.splice(0, this._stocks.passive.length)
      this._transfers.all.splice(0, this._transfers.all.length)
      return await new Promise((resolve, reject) => {
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S, CONS.DB.STORES.T], 'readonly')
        const onComplete = (): void => {
          console.info('RECORDS: loadDatabaseIntoStore: all records loaded!')
          this.evaluateTransfers()
          this._sortActiveStocks()
          this.setActiveStocksPage(1)
          this.resetActiveStocksValues()
          runtime.toggleShowStockTable()
          resolve('RECORDS: loadDatabaseIntoStore: all records loaded!')
        }
        const onAbort = (): void => {
          notice(['Transaction aborted!', requestTransaction.error as string])
          reject(requestTransaction.error)
        }
        requestTransaction.addEventListener(CONS.EVENTS.COMP, onComplete, CONS.SYSTEM.ONCE)
        requestTransaction.addEventListener(CONS.EVENTS.ABORT, onAbort, CONS.SYSTEM.ONCE)
        const onSuccessStocksOpenCursor = (ev: TIDBRequestEvent): void => {
          const cursor = ev.target.result
          if (cursor !== null) {
            this._loadStockIntoStore(cursor.value)
            cursor.continue()
          } else {
            requestStocksOpenCursor.removeEventListener(CONS.EVENTS.SUC, onSuccessStocksOpenCursor, false)
            console.info('RECORDS: stocks loaded into memory')
            const onSuccessTransfersOpenCursor = (ev: TIDBRequestEvent): void => {
              const cursor: IDBCursorWithValue | null = ev.target.result
              if (cursor !== null) {
                const transfer: ITransfer = {...cursor.value}
                const newTransfer = migrateTransfer({...transfer})
                const currentStock: IStock[] = this._stocks.all.filter((stock: IStock) => {
                  return stock.cID === newTransfer.cStockID
                })
                this._loadTransferIntoStore(currentStock, newTransfer)
                cursor.continue()
              } else {
                requestTransfersOpenCursor.removeEventListener(CONS.EVENTS.SUC, onSuccessTransfersOpenCursor, false)
                console.info('RECORDS: transfers loaded into memory')
                // this._transfers.all.sort((a: ITransfer, b: ITransfer): number => {
                //   return (b.mSortDate ?? 0) - (a.mSortDate ?? 0)
                // })
                this._sortTransfers()
              }
            }
            const requestTransfersOpenCursor = requestTransaction.objectStore(CONS.DB.STORES.T).openCursor()
            requestTransfersOpenCursor.addEventListener(CONS.EVENTS.SUC, onSuccessTransfersOpenCursor, false)
          }
        }
        const requestStocksOpenCursor = requestTransaction.objectStore(CONS.DB.STORES.S).openCursor()
        requestStocksOpenCursor.addEventListener(CONS.EVENTS.SUC, onSuccessStocksOpenCursor, false)
      })
    },
    async loadStoreIntoDatabase(): Promise<string> {
      console.log('RECORDS: loadStoreIntoDatabase')
      return await new Promise((resolve, reject) => {
        let requestAddStock: IDBRequest
        let requestAddTransfer: IDBRequest
        const onComplete = (): void => {
          notice(['All stocks and transfers are added to the database!'])
          resolve('RECORDS: loadStoreIntoDatabase: all stocks and transfers are added to the database!')
        }
        const onAbort = (): void => {
          notice(['Transaction aborted!', requestTransaction.error as string])
          reject(requestTransaction.error)
        }
        // TODO remove double listeners
        const onSuccessStock = (): void => {
          requestAddStock.addEventListener(CONS.EVENTS.SUC, onSuccessStock, false)
        }
        const onSuccessTransfer = (): void => {
          requestAddTransfer.addEventListener(CONS.EVENTS.SUC, onSuccessTransfer, false)
        }
        const onError = (ev: ErrorEvent): void => {
          requestAddStock.addEventListener(CONS.EVENTS.ERR, onError, false)
          requestAddTransfer.addEventListener(CONS.EVENTS.ERR, onError, false)
          reject(ev.message)
        }
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S, CONS.DB.STORES.T], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.COMP, onComplete, CONS.SYSTEM.ONCE)
        requestTransaction.addEventListener(CONS.EVENTS.ABORT, onAbort, CONS.SYSTEM.ONCE)
        for (let i = 0; i < this._stocks.all.length; i++) {
          const stock: IStock = {...this._stocks.all[i]}
          delete stock.mBuyValue
          delete stock.mRealBuyValue
          delete stock.mPortfolio
          delete stock.mDividendYielda
          delete stock.mDividendYeara
          delete stock.mDividendYieldb
          delete stock.mDividendYearb
          delete stock.mRealDividend
          delete stock.mMin
          delete stock.mMax
          delete stock.mValue
          delete stock.mChange
          delete stock.mEuroChange
          requestAddStock = requestTransaction.objectStore(CONS.DB.STORES.S).add({...stock})
          requestAddStock.addEventListener(CONS.EVENTS.ERR, onError, false)
          requestAddStock.addEventListener(CONS.EVENTS.SUC, onSuccessStock, false)
        }
        for (let i = 0; i < this._transfers.all.length; i++) {
          const transfer: ITransfer = {...this._transfers.all[i]}
          delete transfer.mCompany
          delete transfer.mSortDate
          requestAddTransfer = requestTransaction.objectStore(CONS.DB.STORES.T).add(migrateTransfer({...transfer}))
          requestAddTransfer.addEventListener(CONS.EVENTS.ERR, onError, false)
          requestAddTransfer.addEventListener(CONS.EVENTS.SUC, onSuccessTransfer, false)
        }
      })
    },
    async addStock(record: IAddStock): Promise<string> {
      return await new Promise((resolve, reject) => {
        const onSuccess = (ev: Event): void => {
          requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
          const memRecord: IStock = {
            ...dbRecord,
            cID: (ev.target as IDBRequest).result,
            ...CONS.RECORDS.TEMPLATES.MSTOCK
          }
          this._stocks.all.push(memRecord)
          this._stocks.active.push(memRecord)
          resolve('Stock added')
        }
        const onError = (ev: ErrorEvent): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false)
          requestAdd.removeEventListener(CONS.EVENTS.ERR, onError, false)
          reject(ev.message)
        }
        const rawRecordClone = {...toRaw(record)}
        const dbRecord: IAddStock = {
          cCompany: rawRecordClone.cCompany,
          cISIN: rawRecordClone.cISIN,
          cWKN: rawRecordClone.cWKN,
          cSym: rawRecordClone.cSym,
          cMeetingDay: CONS.RECORDS.TEMPLATES.STOCK.cMeetingDay,
          cQuarterDay: CONS.RECORDS.TEMPLATES.STOCK.cQuarterDay,
          cFadeOut: CONS.RECORDS.TEMPLATES.STOCK.cFadeOut,
          cFirstPage: CONS.RECORDS.TEMPLATES.STOCK.cFirstPage,
          cURL: CONS.RECORDS.TEMPLATES.STOCK.cURL
        }
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false)
        const requestAdd = requestTransaction.objectStore(CONS.DB.STORES.S).add(dbRecord)
        requestAdd.addEventListener(CONS.EVENTS.ERR, onError, false)
        requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
      })
    },
    async updateStock(data: IStock, msg: boolean = false): Promise<string> {
      console.info('RECORDS: updateStock', data)
      const dbRecord = {...data}
      delete dbRecord.mPortfolio
      delete dbRecord.mBuyValue
      delete dbRecord.mRealBuyValue
      delete dbRecord.mDividendYielda
      delete dbRecord.mDividendYeara
      delete dbRecord.mDividendYieldb
      delete dbRecord.mDividendYearb
      delete dbRecord.mRealDividend
      delete dbRecord.mMin
      delete dbRecord.mMax
      delete dbRecord.mValue
      delete dbRecord.mChange
      delete dbRecord.mEuroChange
      const indexOfPassiveStock = this._stocks.passive.findIndex((stock: IStock) => {
        return stock.cID === data.cID
      })
      const indexOfActiveStock = this._stocks.active.findIndex((stock: IStock) => {
        return stock.cID === data.cID
      })
      return await new Promise((resolve, reject) => {
        const onSuccess = (): void => {
          requestUpdate.removeEventListener(CONS.EVENTS.SUC, onSuccess, false)
          if (indexOfPassiveStock > -1) {
            this._stocks.passive.splice(indexOfPassiveStock, 1)
          }
          this._stocks.active.splice(indexOfActiveStock, 0, data)
          this._sortActiveStocks()
          if (msg) {
            notice(['sm_msg_updaterecord'])
          }
          resolve('Stock updated')
        }
        const onError = (ev: ErrorEvent): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false)
          requestUpdate.removeEventListener(CONS.EVENTS.ERR, onError, false)
          notice([ev.message])
          reject(ev.message)
        }
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false)
        const requestUpdate = requestTransaction.objectStore(CONS.DB.STORES.S).put(dbRecord)
        requestUpdate.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
        requestUpdate.addEventListener(CONS.EVENTS.ERR, onError, false)
      })
    },
    async deleteStock(ident: number): Promise<string> {
      const indexOfStock = this._stocks.all.findIndex((stock: IStock) => {
        return stock.cID === ident
      })
      return await new Promise((resolve, reject) => {
        const onSuccess = (): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.SUC, onSuccess, false)
          this._stocks.active.splice(this._stocks.active_index, 1)
          this._stocks.all.splice(indexOfStock, 1)
          resolve('Stock deleted')
        }
        const onError = (ev: ErrorEvent): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false)
          requestDelete.removeEventListener(CONS.EVENTS.ERR, onError, false)
          reject(ev.message)
        }
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false)
        const requestDelete = requestTransaction.objectStore(CONS.DB.STORES.S).delete(ident)
        requestDelete.addEventListener(CONS.EVENTS.ERR, onError, false)
        requestDelete.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
      })
    },
    async addTransfer(record: IAddTransfer): Promise<string> {
      return await new Promise((resolve, reject) => {
        const transfer = {...record}
        transfer.cDate = record.cDate + offset()
        transfer.cExDay = record.cExDay + offset()
        const onError = (ev: ErrorEvent): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false)
          requestAdd.removeEventListener(CONS.EVENTS.ERR, onError, false)
          reject(ev.message)
        }
        const onSuccess = (ev: Event): void => {
          requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
          let sortDate: string | number | undefined = record.cDate
          let cname: string = ''
          if (record.cType === CONS.DB.RECORD_TYPES.DIV) {
            sortDate = record.cExDay
          }
          if (
            record.cType === CONS.DB.RECORD_TYPES.BUY ||
            record.cType === CONS.DB.RECORD_TYPES.SELL ||
            record.cType === CONS.DB.RECORD_TYPES.DIV
          ) {
            cname = this._stocks.active[this._stocks.active_index].cCompany
          }
          const memRecord = {
            ...record,
            cID: (ev.target as IDBRequest).result,
            mCompany: cname,
            mSortDate: sortDate
          }
          this._transfers.all.push(memRecord)
          this._sortTransfers()
          this.evaluateTransfers()
          resolve('Transfer added')
        }
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.T], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false)
        const requestAdd = requestTransaction.objectStore(CONS.DB.STORES.T).add(transfer)
        requestAdd.addEventListener(CONS.EVENTS.ERR, onError, false)
        requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
      })
    },
    async updateTransfer(data: ITransfer, msg: boolean = false): Promise<string> {
      console.log('RECORD:updateTransfer')
      const dbRecord = {...data}
      delete dbRecord.mCompany
      delete dbRecord.mSortDate
      dbRecord.cDate = dbRecord.cDate > 0 ? data.cDate + offset() : 0
      dbRecord.cExDay = dbRecord.cExDay > 0 ? data.cExDay + offset() : 0
      return await new Promise((resolve, reject) => {
        const onSuccess = (): void => {
          requestUpdate.removeEventListener(CONS.EVENTS.SUC, onSuccess, false)
          this._transfers.all[this._transfers.index] = {...data} // important to use sorted transfers
          if (msg) {
            notice([browser.i18n.getMessage('sm_msg_updaterecord')])
          }
          resolve('Transfer updated')
        }
        const onError = (ev: ErrorEvent): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false)
          requestUpdate.removeEventListener(CONS.EVENTS.ERR, onError, false)
          notice([ev.message])
          reject(ev.message)
        }
        const requestTransaction = this._dbi.transaction(['transfers'], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false)
        const requestUpdate = requestTransaction.objectStore('transfers').put(dbRecord)
        requestUpdate.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
        requestUpdate.addEventListener(CONS.EVENTS.ERR, onError, false)
      })
    },
    async deleteTransfer(ident: number, msg: boolean = false): Promise<string> {
      return await new Promise((resolve, reject) => {
        const onSuccess = (): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.SUC, onSuccess, false)
          this._transfers.all.splice(0, 1) // important to use sorted transfers
          if (msg) {
            notice(['sm_msg_removerecord'])
          }
          resolve('Transfer deleted')
        }
        const onError = (ev: ErrorEvent): void => {
          requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false)
          requestDelete.removeEventListener(CONS.EVENTS.ERR, onError, false)
          reject(ev.message)
        }
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.T], 'readwrite')
        requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false)
        const requestDelete = requestTransaction.objectStore(CONS.DB.STORES.T).delete(ident)
        requestDelete.addEventListener(CONS.EVENTS.ERR, onError, false)
        requestDelete.addEventListener(CONS.EVENTS.SUC, onSuccess, false)
      })
    },
    async onDeleteTransfer(): Promise<void> {
      console.log('RECORDS: onDeleteTransfer')
      return await new Promise(async (resolve) => {
        const modaldialog = useModaldialogStore()
        if (this._transfers.index === 0) {
          await this.deleteTransfer(this._transfers.all[0].cID ?? -1)
          this.evaluateTransfers()
          this.updateWrapper(this._stocks.active_page)
        }
        modaldialog.toggleVisibility('')
        resolve()
      })
    }
  }
})

console.log('--- records.js ---')
