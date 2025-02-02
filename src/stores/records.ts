/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {defineStore, type StoreDefinition} from 'pinia'
import {useRuntimeStore} from '@/stores/runtime'
import {useSettingsStore} from '@/stores/settings'
import {toRaw} from 'vue'
import {useApp} from '@/composables/useApp'

interface IRecordsStore {
  _dbi: IDBDatabase | null
  _stocks: IRecordStoreStocks
  _transfers: IRecordStoreTransfers
  _bkup_object: IBackup
}

interface IRecordStoreTransfers {
  all: ITransfer[]
  dividend_transfers_per_stock: Map<number, ITransfer[]>
  total_controller: ITotalController
  selected_index: number
}

interface IRecordStoreStocks {
  all: IStock[]
  active: IStock[]
  passive: IStock[]
  active_page: number
  active_index: number
  active_page_count: number
}

interface IOnlineStockValues {
  index: number
  value: number
  min: number
  max: number
  echange: number
  pchange: number
}

const {appPort, CONS, notice, offset, migrateStock, migrateTransfer} = useApp()

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
        active_index: -1
      },
      _transfers: {
        all: [],
        dividend_transfers_per_stock: new Map<number, ITransfer[]>(),
        total_controller: CONS.RECORDS.CONTROLLER.TOTAL,
        selected_index: -1
      },
      _bkup_object: {
        sm: {
          cVersion: 0,
          cDBVersion: 0,
          cDBCurrency: '',
          cEngine: ''
        },
        stocks: [],
        transfers: [],
      }
    }
  },
  getters: {
    stocks(state: IRecordsStore): IRecordStoreStocks {
      return state._stocks
    },
    transfers(state: IRecordsStore): IRecordStoreTransfers {
      return state._transfers
    },
    dbi(state: IRecordsStore): IDBDatabase | null {
      return state._dbi
    },
    dividendsPerStock(state: IRecordsStore): Map<number, ITransfer[]> {
      return state._transfers.dividend_transfers_per_stock
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
    _setActiveStocksValues(val: IOnlineStockValues): void {
      this._stocks.active[val.index].mValue = val.value
      this._stocks.active[val.index].mMin = val.min
      this._stocks.active[val.index].mMax = val.max
      this._stocks.active[val.index].mEuroChange = val.echange
      this._stocks.active[val.index].mChange = val.pchange
    },
    initialYearTransfers(): number {
      const years: number[] = this._transfers.all.map((record: ITransfer) => {
        return new Date(record.mSortDate ?? 0).getFullYear()
      })
      return Math.min(...Array.from(new Set(years)))
    },
    yearRangeTransfers(): number[] {
      const years: number[] = this._transfers.all.map((record: ITransfer) => {
        return new Date(record.mSortDate ?? 0).getFullYear()
      })
      const uniqueYears = Array.from(new Set(years))
      uniqueYears.sort((a: number, b: number): number => {
        return b - a
      })
      return uniqueYears
    },
    setDates(i: number, d): void {
      this._stocks.active[i].cMeetingDay = d.gm
      this._stocks.active[i].cQuarterDay = d.qf
    },
    setDrawerDepot(): void {
      console.log('RECORDS: setDrawerDepot')
      const portfolio = this._stocks.active.filter((stock: IStock) => {
        return (stock.mPortfolio ?? 0) > 0
      })
      const total = this._transfers.total_controller
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
      this._transfers.selected_index = this._transfers.all.findIndex((rec: ITransfer) => {
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
        const dividendTransfersPerStock: ITransfer[] = []
        const activeStockIndex = this._getActiveStocksIndexById(stock.cID)
        let portfolio = 0
        let buyCount = 0
        let invest = 0
        transfersPerStock.forEach((transfer: ITransfer) => {
          totalController.fees += transfer.cFees ?? 0
          totalController.taxes +=
            (transfer.cTax ?? 0) + (transfer.cFTax ?? 0) + (transfer.cSTax ?? 0) + (transfer.cSoli ?? 0)
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
              dividendTransfersPerStock.push(transfer)
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
          this._transfers.dividend_transfers_per_stock.set(stock.cID, dividendTransfersPerStock)
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
      totalController.winloss = totalController.winloss === undefined ? 0 : totalController.winloss
      totalController.depot = totalController.depot === undefined ? 0 : totalController.depot
      if (year === CONS.DEFAULTS.YEAR) {
        this._transfers.total_controller = totalController
      }
      return {...totalController}
    },
    updatePage(data: TFetch[]): void {
      console.info('RECORDS: updatePage', data)
      const {toNumber} = useApp()
      const settings = useSettingsStore()
      const runtime = useRuntimeStore()
      let factor = 1
      let top = settings.itemsPerPageStocks
      const rest = this._stocks.active.length % settings.itemsPerPageStocks
      const lastPage = Math.ceil(this._stocks.active.length / settings.itemsPerPageStocks)
      const dataPageCount = Math.ceil(data.length / settings.itemsPerPageStocks)
      if (lastPage === this._stocks.active_page) {
        top = (this._stocks.active_page - 1) * settings.itemsPerPageStocks + rest
      } else {
        top = (this._stocks.active_page - 1) * settings.itemsPerPageStocks + dataPageCount * this._stocks.active_page_count
      }
      for (let i = (this._stocks.active_page - 1) * settings.itemsPerPageStocks; i < top; i++) {
        const id = this._stocks.active[i].cID as number
        const idValues: TFetch[] = data.filter((obj: TFetch) => {
          return obj.id === id
        })
        const buyValue = this._stocks.active[i].mBuyValue ?? 0
        const portfolio = this._stocks.active[i].mPortfolio ?? 0
        const euroChange = (toNumber(idValues[0].rate) - buyValue) * portfolio
        const percentChange = buyValue * portfolio !== 0 ? (euroChange * 100) / (buyValue * portfolio) : 0
        if (idValues.length > 0) {
          if (idValues[0].cur?.includes('USD')) {
            factor = runtime.exchangesCurUsd
          } else if (idValues[0].cur?.includes('EUR')) {
            factor = runtime.exchangesCurEur
          }
          const stockValues: IOnlineStockValues = {
            index: i,
            value: toNumber(idValues[0].rate) / factor,
            min: toNumber(idValues[0].min) / factor,
            max: toNumber(idValues[0].max) / factor,
            echange: euroChange,
            pchange: percentChange
          }
          this._setActiveStocksValues(stockValues)
        }
      }
    },
    loadBkupObjectIntoStore(): void {
      console.log('RECORDS: loadBkupObjectIntoStore')
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
    async updateWrapper(): Promise<void> {
      console.log('RECORDS: updateWrapper')
      const readIsin = () => {
        console.log('RECORDS: readIsin')
        const settings = useSettingsStore()
        const isin: TFetch[] = []
        const isinDates: TFetch[] = []
        const rest = this._stocks.active.length % settings.itemsPerPageStocks
        const lastPage = Math.ceil(this._stocks.active.length / settings.itemsPerPageStocks)
        const activePortfolioCount = this._stocks.active.filter((stock: IStock) => {
          let portfolio = 0
          if (stock.mPortfolio !== undefined) {
            portfolio = stock.mPortfolio
          }
          return portfolio > 0
        }).length
        const portfolioCount = Math.ceil(activePortfolioCount / settings.itemsPerPageStocks)
        let pageStocks: IStock[] = []
        this._stocks.active_page_count = this._stocks.active_page < lastPage ? settings.itemsPerPageStocks : rest
        if (this._stocks.active.length > 0) {
          if (portfolioCount > 1 && this._stocks.active_page <= portfolioCount) {
            if (this._stocks.active_page === 1) {
              pageStocks = this._stocks.active.slice(
                (this._stocks.active_page - 1) * settings.itemsPerPageStocks,
                (this._stocks.active_page - 1) * settings.itemsPerPageStocks + portfolioCount * this._stocks.active_page_count
              )
            }
          } else {
            pageStocks = this._stocks.active.slice(
              (this._stocks.active_page - 1) * settings.itemsPerPageStocks,
              (this._stocks.active_page - 1) * settings.itemsPerPageStocks + this._stocks.active_page_count
            )
          }
          for (let i = 0; i < pageStocks.length; i++) {
            if (pageStocks[i].mValue === 0) {
              isin.push({id: pageStocks[i].cID, isin: pageStocks[i].cISIN, min: '0', rate: '0', max: '0', cur: ''})
            }
            if ((pageStocks[i].cMeetingDay === 0 || pageStocks[i].cQuarterDay === 0) && pageStocks[i].mAskDates) {
              isinDates.push({
                id: pageStocks[i].cID,
                isin: pageStocks[i].cISIN,
                gm: pageStocks[i].cMeetingDay,
                qf: pageStocks[i].cQuarterDay
              })
              pageStocks[i].mAskDates = false
            }
          }
        }
        return {isin, isinDates}
      }
      const runtime = useRuntimeStore()
      const readISIN = readIsin()
      if (readISIN.isin.length > 0) {
        runtime.setIsStocksLoading(true)
        appPort().postMessage({type: CONS.FETCH_API.ASK__MIN_RATE_MAX, data: readISIN.isin})
      }
      if (readISIN.isinDates.length > 0) {
        appPort().postMessage({type: CONS.FETCH_API.ASK__DATES_DATA, data: readISIN.isinDates})
      }
    },
    async cleanStoreAndDatabase(): Promise<string> {
      console.log('RECORDS: cleanStoreAndDatabase')
      this._stocks.active.splice(0, this._stocks.active.length)
      this._stocks.passive.splice(0, this._stocks.passive.length)
      this._stocks.all.splice(0, this._stocks.all.length)
      this._transfers.total_controller = CONS.RECORDS.CONTROLLER.TOTAL
      this._transfers.all.splice(0, this._transfers.all.length)
      return new Promise((resolve, reject) => {
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
      return new Promise((resolve, reject) => {
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
      return new Promise((resolve, reject) => {
        const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S, CONS.DB.STORES.T], 'readonly')
        const onComplete = async (): Promise<void> => {
          console.info('RECORDS: loadDatabaseIntoStore: all records loaded!')
          this.evaluateTransfers()
          this._sortActiveStocks()
          this.setActiveStocksPage(1)
          this.resetActiveStocksValues()
          runtime.setTable('StocksTable')
          await this.updateWrapper()
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
    async storeIntoDatabase(store = 'load'): Promise<string> {
      console.info('RECORDS: storeIntoDatabase', store)
      return new Promise((resolve, reject) => {
        let requestAddStock: IDBRequest
        let requestAddTransfer: IDBRequest
        const onComplete = (): void => {
          requestAddStock.removeEventListener(CONS.EVENTS.ERR, onError, false)
          if (store === 'load') {
            requestAddTransfer.removeEventListener(CONS.EVENTS.ERR, onError, false)
            notice(['All stocks and transfers are added to the database!'])
            resolve('RECORDS: storeIntoDatabase: all stocks and transfers are added to the database!')
          } else {
            // notice(['Stocks updated in database!'])
            resolve('RECORDS: storeIntoDatabase: stocks updated in database!')
          }
        }
        const onAbort = (): void => {
          notice(['Transaction aborted!', requestTransaction.error as string])
          reject(requestTransaction.error)
        }
        const onError = (ev: ErrorEvent): void => {
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
          if (store === 'load') {
            requestAddStock = requestTransaction.objectStore(CONS.DB.STORES.S).add({...stock})
          } else {
            requestAddStock = requestTransaction.objectStore(CONS.DB.STORES.S).put({...stock})
          }
          requestAddStock.addEventListener(CONS.EVENTS.ERR, onError, false)
        }
        if (store === 'load') {
          for (let i = 0; i < this._transfers.all.length; i++) {
            const transfer: ITransfer = {...this._transfers.all[i]}
            delete transfer.mCompany
            delete transfer.mSortDate
            requestAddTransfer = requestTransaction.objectStore(CONS.DB.STORES.T).add({...transfer})
            requestAddTransfer.addEventListener(CONS.EVENTS.ERR, onError, false)
          } 
        }
      })
    },
    // async updateStocksStoreIntoDatabase(): Promise<string> {
    //   console.log('RECORDS: updateStocksStoreIntoDatabase')
    //   return new Promise((resolve, reject) => {
    //     let requestAddStock: IDBRequest
    //     const onComplete = (): void => {
    //       requestAddStock.removeEventListener(CONS.EVENTS.ERR, onError, false)
    //       resolve('RECORDS: updateStocksStoreIntoDatabase: stocks updated in database!')
    //     }
    //     const onAbort = (): void => {
    //       notice(['Transaction aborted!', requestTransaction.error as string])
    //       reject(requestTransaction.error)
    //     }
    //     const onError = (ev: ErrorEvent): void => {
    //       reject(ev.message)
    //     }
    //     const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S], 'readwrite')
    //     requestTransaction.addEventListener(CONS.EVENTS.COMP, onComplete, CONS.SYSTEM.ONCE)
    //     requestTransaction.addEventListener(CONS.EVENTS.ABORT, onAbort, CONS.SYSTEM.ONCE)
    //     for (let i = 0; i < this._stocks.all.length; i++) {
    //       const stock: IStock = {...this._stocks.all[i]}
    //       delete stock.mBuyValue
    //       delete stock.mRealBuyValue
    //       delete stock.mPortfolio
    //       delete stock.mDividendYielda
    //       delete stock.mDividendYeara
    //       delete stock.mDividendYieldb
    //       delete stock.mDividendYearb
    //       delete stock.mRealDividend
    //       delete stock.mMin
    //       delete stock.mMax
    //       delete stock.mValue
    //       delete stock.mChange
    //       delete stock.mEuroChange
    //       requestAddStock = requestTransaction.objectStore(CONS.DB.STORES.S).put({...stock})
    //       requestAddStock.addEventListener(CONS.EVENTS.ERR, onError, false)
    //     }
    //   })
    // },
    async addStock(record: IAddedStock): Promise<string> {
      return new Promise((resolve, reject) => {
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
        const dbRecord: IAddedStock = {
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
      delete dbRecord.mDeleteable
      delete dbRecord.mAskDates

      return new Promise((resolve, reject) => {
        const onSuccess = (): void => {
          requestUpdate.removeEventListener(CONS.EVENTS.SUC, onSuccess, false)
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
      return new Promise((resolve, reject) => {
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
      return new Promise((resolve, reject) => {
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
      return new Promise((resolve, reject) => {
        const onSuccess = (): void => {
          requestUpdate.removeEventListener(CONS.EVENTS.SUC, onSuccess, false)
          this._transfers.all[this._transfers.selected_index] = {...data} // important to use sorted transfers
          this._sortTransfers()
          this.evaluateTransfers()
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
      return new Promise((resolve, reject) => {
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
    }
  }
})

console.log('--- records.js ---')
