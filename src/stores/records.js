import { defineStore } from 'pinia';
import { useOnlineStore } from '@/stores/online';
import { useRuntimeStore } from '@/stores/runtime';
import { useSettingsStore } from '@/stores/settings';
import { useModaldialogStore } from '@/stores/modaldialog';
import { toRaw } from 'vue';
import { useAppLibrary } from '@/libraries/useApp';
import { useConstants } from '@/libraries/useConstants';
const CONS = useConstants();
const { notice, offset, migrateStock, migrateTransfer } = useAppLibrary();
export const useRecordsStore = defineStore('records', {
    state: () => {
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
                stockController: new Map(),
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
            _dividends_per_stock: new Map(),
            _show_dividends: []
        };
    },
    getters: {
        stocks: (state) => {
            return state._stocks;
        },
        transfers: (state) => {
            return state._transfers;
        },
        dbi: (state) => {
            return state._dbi;
        },
        bkupObject: (state) => {
            return state._bkup_object;
        },
        firstYearTransfers(state) {
            const years = state._transfers.all.map((record) => {
                return new Date(record.mSortDate ?? 0).getFullYear();
            });
            return Math.min(...Array.from(new Set(years)));
        },
        yearRangeTransfers(state) {
            const years = state._transfers.all.map((record) => {
                return new Date(record.mSortDate ?? 0).getFullYear();
            });
            const uniqueYears = Array.from(new Set(years));
            uniqueYears.sort((a, b) => {
                return b - a;
            });
            return uniqueYears;
        },
        checkActiveStocksRate(state) {
            const settings = useSettingsStore();
            let result = true;
            if (state._stocks.active.length > 0) {
                for (let i = (state._stocks.active_page - 1) * settings.itemsPerPageStocks; i < (state._stocks.active_page - 1) * settings.itemsPerPageStocks + state._stocks.active_page_count; i++) {
                    if (state._stocks.active[i].mValue !== 0) {
                        result = false;
                    }
                }
            }
            return result;
        }
    },
    actions: {
        _loadStockIntoStore(stock) {
            const memRecord = {
                ...stock,
                ...CONS.RECORDS.TEMPLATES.MSTOCK
            };
            this._stocks.all.push(memRecord);
            if (memRecord.cFadeOut === 1) {
                this._stocks.passive.push(memRecord);
            }
            else if (memRecord.cFadeOut === 0) {
                this._stocks.active.push(memRecord);
            }
        },
        _loadTransferIntoStore(stock, transfer) {
            if (transfer.cType === CONS.DB.RECORD_TYPES.DIV) {
                transfer.mSortDate = transfer.cExDay;
            }
            else {
                transfer.mSortDate = transfer.cDate;
            }
            if (stock.length > 0) {
                transfer.mCompany = toRaw(stock[0]).cCompany;
            }
            else {
                transfer.mCompany = '';
            }
            this._transfers.all.push(transfer);
        },
        _setStocksPortfolio() {
            console.info('RECORDS: _setStocksPortfolio');
            let portfolio = 0;
            let same = false;
            const buySellTransfers = this._transfers.all.filter((transfer) => {
                return transfer.cType === CONS.DB.RECORD_TYPES.BUY || transfer.cType === CONS.DB.RECORD_TYPES.SELL;
            });
            buySellTransfers.sort((a, b) => {
                return a.cStockID - b.cStockID;
            });
            for (let i = 0; i < buySellTransfers.length; i++) {
                if (!same) {
                    portfolio = buySellTransfers[i].cCount;
                }
                if (i < buySellTransfers.length - 1 && buySellTransfers[i].cStockID === buySellTransfers[i + 1].cStockID) {
                    portfolio = portfolio + buySellTransfers[i + 1].cCount;
                    same = true;
                }
                else {
                    const indexByID = this._stocks.all.findIndex((stock) => {
                        return stock.cID === buySellTransfers[i].cStockID;
                    });
                    if (indexByID > -1) {
                        this._stocks.all[indexByID].mPortfolio = portfolio;
                        same = false;
                    }
                }
            }
        },
        _readIsin(p) {
            console.info('RECORDS: _readIsin', p);
            const settings = useSettingsStore();
            const isin = [];
            const rest = this._stocks.active.length % settings.itemsPerPageStocks;
            const lastPage = Math.ceil(this._stocks.active.length / settings.itemsPerPageStocks);
            this._stocks.active_page_count = p < lastPage ? settings.itemsPerPageStocks : rest;
            this._stocks.active_portfolio_count = this._stocks.active.filter((stock) => {
                let portfolio = 0;
                if (stock.mPortfolio !== undefined) {
                    portfolio = stock.mPortfolio;
                }
                return portfolio > 0;
            }).length;
            const portfolioCount = Math.ceil(this._stocks.active_portfolio_count / settings.itemsPerPageStocks);
            let pageStocks = [];
            this._stocks.active_page = p;
            if (this._stocks.active.length > 0) {
                if (portfolioCount > 1 && p <= portfolioCount) {
                    if (p === 1) {
                        pageStocks = this._stocks.active.slice((p - 1) * settings.itemsPerPageStocks, (p - 1) * settings.itemsPerPageStocks + portfolioCount * this._stocks.active_page_count);
                    }
                }
                else {
                    pageStocks = this._stocks.active.slice((p - 1) * settings.itemsPerPageStocks, (p - 1) * settings.itemsPerPageStocks + this._stocks.active_page_count);
                }
                for (let i = 0; i < pageStocks.length; i++) {
                    isin.push({ id: pageStocks[i].cID, isin: pageStocks[i].cISIN, min: '0', rate: '0', max: '0', cur: '' });
                }
            }
            return isin;
        },
        _sortTransfers() {
            return this._transfers.all.sort((a, b) => {
                return (b.mSortDate ?? 0) - (a.mSortDate ?? 0);
            });
        },
        _sortActiveStocks() {
            this._stocks.active.sort((a, b) => {
                return (a.cID ?? 0) - (b.cID ?? 0);
            });
            this._stocks.active.sort((a, b) => {
                return (b.cFirstPage ?? 0) - (a.cFirstPage ?? 0);
            });
            this._stocks.active.sort((a, b) => {
                return (b.mPortfolio ?? 0) - (a.mPortfolio ?? 0);
            });
        },
        _getActiveStocksIndexById(ident) {
            return this._stocks.active.findIndex((stock) => {
                return stock.cID === ident;
            });
        },
        initShowDividends() {
            console.log('RECORDS: initShowDividends', this._dividends_per_stock);
            const dividendTransfersPerStock = this._dividends_per_stock.get(this._stocks.active[this._stocks.active_index].cID) ?? [];
            this._show_dividends = [];
            for (let i = 0; i < dividendTransfersPerStock.length; i++) {
                const transfer = dividendTransfersPerStock[i];
                this._show_dividends.push({
                    year: transfer.cDate,
                    dividend: transfer.cCount * transfer.cUnitQuotation
                });
            }
        },
        setDrawerDepot() {
            console.log('RECORDS: setDrawerDepot');
            const portfolio = this._stocks.active.filter((stock) => {
                return (stock.mPortfolio ?? 0) > 0;
            });
            const total = this._transfers.totalController;
            let depot = 0;
            let buyvalue = 0;
            portfolio.forEach((stock) => {
                depot += (stock.mPortfolio ?? 0) * (stock.mValue ?? 0);
                buyvalue += (stock.mPortfolio ?? 0) * (stock.mBuyValue ?? 0);
            });
            total.depot = depot;
            total.winloss = depot - buyvalue + total.fees + total.taxes + total.dividends + total.earnings;
            total.winlossPercent =
                total.withdrawals + total.deposits - total.account !== 0
                    ? total.winloss / (total.withdrawals + total.deposits - total.account)
                    : 0;
        },
        setActiveStocksValues(index, value, min, max, echange, pchange) {
            this._stocks.active[index].mValue = value;
            this._stocks.active[index].mMin = min;
            this._stocks.active[index].mMax = max;
            this._stocks.active[index].mEuroChange = echange;
            this._stocks.active[index].mChange = pchange;
        },
        resetActiveStocksValues() {
            const records = useRecordsStore();
            const settings = useSettingsStore();
            if (this._stocks.active.length > 0) {
                for (let i = (records.stocks.active_page - 1) * settings.itemsPerPageStocks; i < (records.stocks.active_page - 1) * settings.itemsPerPageStocks + records.stocks.active_page_count; i++) {
                    this._stocks.active[i].mValue = 0;
                    this._stocks.active[i].mMin = 0;
                    this._stocks.active[i].mMax = 0;
                    this._stocks.active[i].mChange = 0;
                    this._stocks.active[i].mEuroChange = 0;
                }
            }
        },
        setBkupObject(value) {
            delete value?.orders;
            this._bkup_object = {
                sm: {
                    cVersion: 0,
                    cDBVersion: 0,
                    cDBCurrency: '',
                    cEngine: ''
                },
                stocks: [],
                transfers: []
            };
            this._bkup_object = value;
        },
        setActiveStocksPage(value) {
            this._stocks.active_page = value;
        },
        setActiveStockIndexForGivenId(value) {
            this._stocks.active_index = this._stocks.active.findIndex((rec) => {
                return rec.cID === value;
            });
        },
        setTransferIndexForGivenId(value) {
            this._transfers.index = this._transfers.all.findIndex((rec) => {
                return rec.cID === value;
            });
        },
        evaluateTransfers(year = CONS.DEFAULTS.YEAR) {
            console.info('RECORDS: evaluateTransfers', year);
            const oldestTransferFirst = [...this._transfers.all];
            oldestTransferFirst.sort((a, b) => {
                return (a.mSortDate ?? 0) - (b.mSortDate ?? 0);
            });
            const allStocksPlusZero = [{ cID: 0 }, ...this._stocks.all];
            const totalController = { ...CONS.RECORDS.CONTROLLER.TOTAL };
            allStocksPlusZero.forEach((stock) => {
                const transfersPerStock = oldestTransferFirst.filter((transfer) => {
                    const currentYear = new Date(transfer.mSortDate ?? 0).getFullYear();
                    return transfer.cStockID === stock.cID && currentYear <= year;
                });
                const dividendController = [];
                const activeStockIndex = this._getActiveStocksIndexById(stock.cID);
                let portfolio = 0;
                let buyCount = 0;
                let invest = 0;
                transfersPerStock.forEach((transfer) => {
                    totalController.fees += transfer.cFees ?? 0;
                    totalController.taxes +=
                        (transfer.cTax ?? 0) + (transfer.cFTax ?? 0) + (transfer.cSTax ?? 0) + (transfer.cSoli ?? 0);
                    switch (transfer.cType) {
                        case CONS.DB.RECORD_TYPES.BUY:
                            totalController.buy += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0);
                            portfolio += transfer.cCount ?? 0;
                            buyCount += transfer.cCount ?? 0;
                            invest += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0);
                            break;
                        case CONS.DB.RECORD_TYPES.SELL:
                            totalController.sell += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0);
                            portfolio += transfer.cCount ?? 0;
                            invest = (portfolio * invest) / buyCount;
                            buyCount = portfolio;
                            if (portfolio < 0.9 && portfolio > -0.9) {
                                portfolio = 0;
                                buyCount = 0;
                                invest = 0;
                            }
                            break;
                        case CONS.DB.RECORD_TYPES.DIV:
                            totalController.dividends += (transfer.cUnitQuotation ?? 0) * (transfer.cCount ?? 0);
                            dividendController.push(transfer);
                            break;
                        case CONS.DB.RECORD_TYPES.DEPOSIT:
                            totalController.deposits += transfer.cAmount ?? 0;
                            break;
                        case CONS.DB.RECORD_TYPES.WITHDRAWAL:
                            totalController.withdrawals += transfer.cAmount ?? 0;
                            break;
                        default:
                            console.error('RECORDS: evaluateTransfers:unknown type', transfer.cType);
                    }
                });
                if (activeStockIndex > -1) {
                    this._stocks.active[activeStockIndex].mPortfolio = portfolio;
                    this._stocks.active[activeStockIndex].mBuyValue = buyCount > 0.9 ? invest / buyCount : 0;
                    this._dividends_per_stock.set(stock.cID, dividendController);
                }
                totalController.depotBuyValue += buyCount > 0.9 ? (portfolio * invest) / buyCount : 0;
            });
            totalController.account =
                totalController.dividends +
                    totalController.deposits -
                    totalController.sell +
                    totalController.withdrawals -
                    totalController.buy +
                    totalController.fees +
                    totalController.taxes;
            totalController.earnings = totalController.depotBuyValue - totalController.sell - totalController.buy;
            if (year === CONS.DEFAULTS.YEAR) {
                this._transfers.totalController = totalController;
            }
            return { ...totalController };
        },
        updatePage(p) {
            console.info('RECORDS: updatePage', p);
            const settings = useSettingsStore();
            const online = useOnlineStore();
            const overPaged = this._stocks.active.filter((rec) => {
                return (rec.mPortfolio ?? 0) > 0;
            }).length;
            for (let i = (this._stocks.active_page - 1) * settings.itemsPerPageStocks; i < Math.max((this._stocks.active_page - 1) * settings.itemsPerPageStocks + this._stocks.active_page_count, overPaged); i++) {
                const id = this._stocks.active[i].cID;
                const { rate, min, max } = online.minRateMax.get(id) ?? { rate: 0, min: 0, max: 0 };
                const buyValue = this._stocks.active[i].mBuyValue ?? 0;
                const portfolio = this._stocks.active[i].mPortfolio ?? 0;
                const euroChange = (rate - buyValue) * portfolio;
                const percentChange = buyValue * portfolio !== 0 ? (euroChange * 100) / (buyValue * portfolio) : 0;
                this.setActiveStocksValues(i, rate, min, max, euroChange, percentChange);
            }
            const rest = this._stocks.active.length % settings.itemsPerPageStocks;
            const lastPage = Math.ceil(this._stocks.active.length / settings.itemsPerPageStocks);
            this._stocks.active_page_count = p < lastPage ? settings.itemsPerPageStocks : rest;
            this._stocks.active_page = p;
            if (this._stocks.active.length > 0) {
                this._stocks.active.slice((p - 1) * settings.itemsPerPageStocks, (p - 1) * settings.itemsPerPageStocks + this._stocks.active_page_count);
            }
        },
        loadBkupObjectIntoStore() {
            let stock;
            let transfer;
            let addStock;
            let newTransfer;
            let currentStock;
            for (stock of this._bkup_object.stocks) {
                addStock = migrateStock({ ...stock });
                this._loadStockIntoStore(addStock);
            }
            for (transfer of this._bkup_object.transfers) {
                newTransfer = migrateTransfer({ ...transfer });
                currentStock = this._stocks.all.filter((stock) => {
                    return stock.cID === newTransfer.cStockID;
                });
                this._loadTransferIntoStore(currentStock, newTransfer);
            }
            this.evaluateTransfers();
            this._sortActiveStocks();
            this.setActiveStocksPage(1);
            this.resetActiveStocksValues();
        },
        updateWrapper(p) {
            console.log('RECORDS: updateWrapper');
            const runtime = useRuntimeStore();
            const isinData = this._readIsin(p);
            this.setActiveStocksPage(p);
            browser.runtime.sendMessage({ type: CONS.FETCH_API.ASK__MIN_RATE_MAX, data: isinData });
            if (runtime.datesForPage[p - 1] === undefined) {
                browser.runtime.sendMessage({ type: CONS.FETCH_API.ASK__DATES_DATA, data: isinData });
            }
        },
        async cleanStoreAndDatabase() {
            console.log('RECORDS: cleanStoreAndDatabase');
            this._stocks.active.splice(0, this._stocks.active.length);
            this._stocks.passive.splice(0, this._stocks.passive.length);
            this._stocks.all.splice(0, this._stocks.all.length);
            this._transfers.totalController = CONS.RECORDS.CONTROLLER.TOTAL;
            this._transfers.stockController = new Map();
            this._transfers.all.splice(0, this._transfers.all.length);
            return new Promise((resolve, reject) => {
                const onError = (ev) => {
                    requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    reject(ev.message);
                };
                const onComplete = () => {
                    requestTransaction.removeEventListener(CONS.EVENTS.COMP, onComplete, false);
                    resolve('Cleared database and records store!');
                };
                const onSuccessClearStocks = () => {
                    requestClearStocks.addEventListener(CONS.EVENTS.SUC, onSuccessClearStocks, false);
                    console.info('RECORDS: dropped stocks');
                };
                const onSuccessClearTransfers = () => {
                    requestClearTransfers.addEventListener(CONS.EVENTS.SUC, onSuccessClearStocks, false);
                    console.info('RECORDS: dropped transfers');
                };
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S, CONS.DB.STORES.T], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.COMP, onComplete, false);
                requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false);
                const requestClearStocks = requestTransaction.objectStore(CONS.DB.STORES.S).clear();
                requestClearStocks.addEventListener(CONS.EVENTS.SUC, onSuccessClearStocks, false);
                const requestClearTransfers = requestTransaction.objectStore(CONS.DB.STORES.T).clear();
                requestClearTransfers.addEventListener(CONS.EVENTS.SUC, onSuccessClearTransfers, false);
            });
        },
        async openDatabase() {
            return new Promise((resolve, reject) => {
                const onError = (err) => {
                    reject(err.message);
                };
                const onSuccess = (ev) => {
                    this._dbi = ev.target.result;
                    resolve('RECORDS: database opened successfully!');
                };
                const openDBRequest = indexedDB.open(CONS.DB.NAME, CONS.DB.VERSION);
                openDBRequest.addEventListener(CONS.EVENTS.SUC, onSuccess, CONS.SYSTEM.ONCE);
                openDBRequest.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE);
            });
        },
        async loadDatabaseIntoStore() {
            console.info('RECORDS: loadDatabaseIntoStore');
            const runtime = useRuntimeStore();
            this._stocks.all.splice(0, this._stocks.all.length);
            this._stocks.active.splice(0, this._stocks.active.length);
            this._stocks.passive.splice(0, this._stocks.passive.length);
            this._transfers.all.splice(0, this._transfers.all.length);
            return new Promise((resolve, reject) => {
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S, CONS.DB.STORES.T], 'readonly');
                const onComplete = () => {
                    console.info('RECORDS: loadDatabaseIntoStore: all records loaded!');
                    this.evaluateTransfers();
                    this._sortActiveStocks();
                    this.setActiveStocksPage(1);
                    this.resetActiveStocksValues();
                    runtime.toggleShowStockTable();
                    resolve('RECORDS: loadDatabaseIntoStore: all records loaded!');
                };
                const onAbort = () => {
                    notice(['Transaction aborted!', requestTransaction.error]);
                    reject(requestTransaction.error);
                };
                requestTransaction.addEventListener(CONS.EVENTS.COMP, onComplete, CONS.SYSTEM.ONCE);
                requestTransaction.addEventListener(CONS.EVENTS.ABORT, onAbort, CONS.SYSTEM.ONCE);
                const onSuccessStocksOpenCursor = (ev) => {
                    const cursor = ev.target.result;
                    if (cursor !== null) {
                        this._loadStockIntoStore(cursor.value);
                        cursor.continue();
                    }
                    else {
                        requestStocksOpenCursor.removeEventListener(CONS.EVENTS.SUC, onSuccessStocksOpenCursor, false);
                        console.info('RECORDS: stocks loaded into memory');
                        const onSuccessTransfersOpenCursor = (ev) => {
                            const cursor = ev.target.result;
                            if (cursor !== null) {
                                const transfer = { ...cursor.value };
                                const newTransfer = migrateTransfer({ ...transfer });
                                const currentStock = this._stocks.all.filter((stock) => {
                                    return stock.cID === newTransfer.cStockID;
                                });
                                this._loadTransferIntoStore(currentStock, newTransfer);
                                cursor.continue();
                            }
                            else {
                                requestTransfersOpenCursor.removeEventListener(CONS.EVENTS.SUC, onSuccessTransfersOpenCursor, false);
                                console.info('RECORDS: transfers loaded into memory');
                                this._sortTransfers();
                            }
                        };
                        const requestTransfersOpenCursor = requestTransaction.objectStore(CONS.DB.STORES.T).openCursor();
                        requestTransfersOpenCursor.addEventListener(CONS.EVENTS.SUC, onSuccessTransfersOpenCursor, false);
                    }
                };
                const requestStocksOpenCursor = requestTransaction.objectStore(CONS.DB.STORES.S).openCursor();
                requestStocksOpenCursor.addEventListener(CONS.EVENTS.SUC, onSuccessStocksOpenCursor, false);
            });
        },
        async loadStoreIntoDatabase() {
            console.log('RECORDS: loadStoreIntoDatabase');
            return new Promise((resolve, reject) => {
                let requestAddStock;
                let requestAddTransfer;
                const onComplete = () => {
                    notice(['All stocks and transfers are added to the database!']);
                    resolve('RECORDS: loadStoreIntoDatabase: all stocks and transfers are added to the database!');
                };
                const onAbort = () => {
                    notice(['Transaction aborted!', requestTransaction.error]);
                    reject(requestTransaction.error);
                };
                const onSuccessStock = () => {
                    requestAddStock.addEventListener(CONS.EVENTS.SUC, onSuccessStock, false);
                };
                const onSuccessTransfer = () => {
                    requestAddTransfer.addEventListener(CONS.EVENTS.SUC, onSuccessTransfer, false);
                };
                const onError = (ev) => {
                    requestAddStock.addEventListener(CONS.EVENTS.ERR, onError, false);
                    requestAddTransfer.addEventListener(CONS.EVENTS.ERR, onError, false);
                    reject(ev.message);
                };
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S, CONS.DB.STORES.T], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.COMP, onComplete, CONS.SYSTEM.ONCE);
                requestTransaction.addEventListener(CONS.EVENTS.ABORT, onAbort, CONS.SYSTEM.ONCE);
                for (let i = 0; i < this._stocks.all.length; i++) {
                    const stock = { ...this._stocks.all[i] };
                    delete stock.mBuyValue;
                    delete stock.mRealBuyValue;
                    delete stock.mPortfolio;
                    delete stock.mDividendYielda;
                    delete stock.mDividendYeara;
                    delete stock.mDividendYieldb;
                    delete stock.mDividendYearb;
                    delete stock.mRealDividend;
                    delete stock.mMin;
                    delete stock.mMax;
                    delete stock.mValue;
                    delete stock.mChange;
                    delete stock.mEuroChange;
                    requestAddStock = requestTransaction.objectStore(CONS.DB.STORES.S).add({ ...stock });
                    requestAddStock.addEventListener(CONS.EVENTS.ERR, onError, false);
                    requestAddStock.addEventListener(CONS.EVENTS.SUC, onSuccessStock, false);
                }
                for (let i = 0; i < this._transfers.all.length; i++) {
                    const transfer = { ...this._transfers.all[i] };
                    delete transfer.mCompany;
                    delete transfer.mSortDate;
                    requestAddTransfer = requestTransaction.objectStore(CONS.DB.STORES.T).add(migrateTransfer({ ...transfer }));
                    requestAddTransfer.addEventListener(CONS.EVENTS.ERR, onError, false);
                    requestAddTransfer.addEventListener(CONS.EVENTS.SUC, onSuccessTransfer, false);
                }
            });
        },
        async addStock(record) {
            return new Promise((resolve, reject) => {
                const onSuccess = (ev) => {
                    requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
                    const memRecord = {
                        ...dbRecord,
                        cID: ev.target.result,
                        ...CONS.RECORDS.TEMPLATES.MSTOCK
                    };
                    this._stocks.all.push(memRecord);
                    this._stocks.active.push(memRecord);
                    resolve('Stock added');
                };
                const onError = (ev) => {
                    requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    requestAdd.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    reject(ev.message);
                };
                const rawRecordClone = { ...toRaw(record) };
                const dbRecord = {
                    cCompany: rawRecordClone.cCompany,
                    cISIN: rawRecordClone.cISIN,
                    cWKN: rawRecordClone.cWKN,
                    cSym: rawRecordClone.cSym,
                    cMeetingDay: CONS.RECORDS.TEMPLATES.STOCK.cMeetingDay,
                    cQuarterDay: CONS.RECORDS.TEMPLATES.STOCK.cQuarterDay,
                    cFadeOut: CONS.RECORDS.TEMPLATES.STOCK.cFadeOut,
                    cFirstPage: CONS.RECORDS.TEMPLATES.STOCK.cFirstPage,
                    cURL: CONS.RECORDS.TEMPLATES.STOCK.cURL
                };
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false);
                const requestAdd = requestTransaction.objectStore(CONS.DB.STORES.S).add(dbRecord);
                requestAdd.addEventListener(CONS.EVENTS.ERR, onError, false);
                requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
            });
        },
        async updateStock(data, msg = false) {
            console.info('RECORDS: updateStock', data);
            const dbRecord = { ...data };
            delete dbRecord.mPortfolio;
            delete dbRecord.mBuyValue;
            delete dbRecord.mRealBuyValue;
            delete dbRecord.mDividendYielda;
            delete dbRecord.mDividendYeara;
            delete dbRecord.mDividendYieldb;
            delete dbRecord.mDividendYearb;
            delete dbRecord.mRealDividend;
            delete dbRecord.mMin;
            delete dbRecord.mMax;
            delete dbRecord.mValue;
            delete dbRecord.mChange;
            delete dbRecord.mEuroChange;
            const indexOfPassiveStock = this._stocks.passive.findIndex((stock) => {
                return stock.cID === data.cID;
            });
            const indexOfActiveStock = this._stocks.active.findIndex((stock) => {
                return stock.cID === data.cID;
            });
            return new Promise((resolve, reject) => {
                const onSuccess = () => {
                    requestUpdate.removeEventListener(CONS.EVENTS.SUC, onSuccess, false);
                    if (indexOfPassiveStock > -1) {
                        this._stocks.passive.splice(indexOfPassiveStock, 1);
                    }
                    else {
                        this._stocks.passive.splice(indexOfPassiveStock, 0, data);
                    }
                    if (indexOfActiveStock > -1) {
                        this._stocks.active.splice(indexOfActiveStock, 1);
                    }
                    else {
                        this._stocks.active.splice(indexOfActiveStock, 0, data);
                    }
                    this._sortActiveStocks();
                    if (msg) {
                        notice(['sm_msg_updaterecord']);
                    }
                    resolve('Stock updated');
                };
                const onError = (ev) => {
                    requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    requestUpdate.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    notice([ev.message]);
                    reject(ev.message);
                };
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false);
                const requestUpdate = requestTransaction.objectStore(CONS.DB.STORES.S).put(dbRecord);
                requestUpdate.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
                requestUpdate.addEventListener(CONS.EVENTS.ERR, onError, false);
            });
        },
        async deleteStock(ident) {
            const indexOfStock = this._stocks.all.findIndex((stock) => {
                return stock.cID === ident;
            });
            return new Promise((resolve, reject) => {
                const onSuccess = () => {
                    requestTransaction.removeEventListener(CONS.EVENTS.SUC, onSuccess, false);
                    this._stocks.active.splice(this._stocks.active_index, 1);
                    this._stocks.all.splice(indexOfStock, 1);
                    resolve('Stock deleted');
                };
                const onError = (ev) => {
                    requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    requestDelete.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    reject(ev.message);
                };
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.S], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false);
                const requestDelete = requestTransaction.objectStore(CONS.DB.STORES.S).delete(ident);
                requestDelete.addEventListener(CONS.EVENTS.ERR, onError, false);
                requestDelete.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
            });
        },
        async addTransfer(record) {
            return new Promise((resolve, reject) => {
                const transfer = { ...record };
                transfer.cDate = record.cDate + offset();
                transfer.cExDay = record.cExDay + offset();
                const onError = (ev) => {
                    requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    requestAdd.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    reject(ev.message);
                };
                const onSuccess = (ev) => {
                    requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
                    let sortDate = record.cDate;
                    let cname = '';
                    if (record.cType === CONS.DB.RECORD_TYPES.DIV) {
                        sortDate = record.cExDay;
                    }
                    if (record.cType === CONS.DB.RECORD_TYPES.BUY ||
                        record.cType === CONS.DB.RECORD_TYPES.SELL ||
                        record.cType === CONS.DB.RECORD_TYPES.DIV) {
                        cname = this._stocks.active[this._stocks.active_index].cCompany;
                    }
                    const memRecord = {
                        ...record,
                        cID: ev.target.result,
                        mCompany: cname,
                        mSortDate: sortDate
                    };
                    this._transfers.all.push(memRecord);
                    this._sortTransfers();
                    this.evaluateTransfers();
                    resolve('Transfer added');
                };
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.T], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false);
                const requestAdd = requestTransaction.objectStore(CONS.DB.STORES.T).add(transfer);
                requestAdd.addEventListener(CONS.EVENTS.ERR, onError, false);
                requestAdd.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
            });
        },
        async updateTransfer(data, msg = false) {
            console.log('RECORD:updateTransfer');
            const dbRecord = { ...data };
            delete dbRecord.mCompany;
            delete dbRecord.mSortDate;
            dbRecord.cDate = dbRecord.cDate > 0 ? data.cDate + offset() : 0;
            dbRecord.cExDay = dbRecord.cExDay > 0 ? data.cExDay + offset() : 0;
            return new Promise((resolve, reject) => {
                const onSuccess = () => {
                    requestUpdate.removeEventListener(CONS.EVENTS.SUC, onSuccess, false);
                    this._transfers.all[this._transfers.index] = { ...data };
                    if (msg) {
                        notice([browser.i18n.getMessage('sm_msg_updaterecord')]);
                    }
                    resolve('Transfer updated');
                };
                const onError = (ev) => {
                    requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    requestUpdate.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    notice([ev.message]);
                    reject(ev.message);
                };
                const requestTransaction = this._dbi.transaction(['transfers'], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false);
                const requestUpdate = requestTransaction.objectStore('transfers').put(dbRecord);
                requestUpdate.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
                requestUpdate.addEventListener(CONS.EVENTS.ERR, onError, false);
            });
        },
        async deleteTransfer(ident, msg = false) {
            return new Promise((resolve, reject) => {
                const onSuccess = () => {
                    requestTransaction.removeEventListener(CONS.EVENTS.SUC, onSuccess, false);
                    this._transfers.all.splice(0, 1);
                    if (msg) {
                        notice(['sm_msg_removerecord']);
                    }
                    resolve('Transfer deleted');
                };
                const onError = (ev) => {
                    requestTransaction.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    requestDelete.removeEventListener(CONS.EVENTS.ERR, onError, false);
                    reject(ev.message);
                };
                const requestTransaction = this._dbi.transaction([CONS.DB.STORES.T], 'readwrite');
                requestTransaction.addEventListener(CONS.EVENTS.ERR, onError, false);
                const requestDelete = requestTransaction.objectStore(CONS.DB.STORES.T).delete(ident);
                requestDelete.addEventListener(CONS.EVENTS.ERR, onError, false);
                requestDelete.addEventListener(CONS.EVENTS.SUC, onSuccess, false);
            });
        },
        async onDeleteTransfer() {
            console.log('RECORDS: onDeleteTransfer');
            return new Promise(async (resolve) => {
                const modaldialog = useModaldialogStore();
                if (this._transfers.index === 0) {
                    await this.deleteTransfer(this._transfers.all[0].cID ?? -1);
                    this.evaluateTransfers();
                    this.updateWrapper(this._stocks.active_page);
                }
                modaldialog.toggleVisibility('');
                resolve();
            });
        }
    }
});
console.log('--- records.js ---');
