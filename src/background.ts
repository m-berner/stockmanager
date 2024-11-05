/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserve
 */
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'

declare global {
  type TIDBRequestEvent = Event & { target: IDBRequest }
  type TFetch = Partial<{
    id: number
    isin: string
    min: string
    rate: string
    max: string
    cur: string
    company: string
    wkn: string
    symbol: string
    key: string | number
    value: string | number | Record<string, string | number>
  }>

  interface Date {
    toISOString: () => string
  }

  interface IUrlWithId {
    ident: number
    url: string
  }

  interface IUrlWithName {
    name: string
    url: string
  }

  interface IService {
    name: string
    url: string
  }

  // interface IIsinWithId {
  //   id: number
  //   isin: string
  // }

  // interface IUrlPart {
  //   sIsin: IIsinWithId[]
  //   quoteUrl: string
  //   homeUrl: string
  // }

  interface IChange {
    key: string
    value: {
      percentChange: string
      change: number
      stringChange: string
    }
  }

  // interface INewCompany {
  //   company: string
  //   isin: string
  //   wkn: string
  //   symbol: string
  // }

  interface IGmQfDates {
    gm: number
    qf: number
  }

  interface IAddTransfer {
    cStockID: number
    cDate: number
    cUnitQuotation: number
    cAmount: number
    cDeposit?: number
    cCount: number
    cNumber?: number
    cFees: number
    cTaxes?: number
    cTax: number
    cSTax: number
    cFTax: number
    cSoli: number
    cExDay: number
    cDescription: string
    cMarketPlace: string
    cType: number
  }

  interface ITransfer extends IAddTransfer {
    cID: number
    mCompany?: string
    mSortDate?: number
  }

  interface IAddStock {
    cCompany: string
    cISIN: string
    cWKN: string
    cSym: string
    cQuarterDay: number
    cMeetingDay: number
    cFadeOut: number
    cFirstPage: number
    cURL: string
  }

  interface IYearController {
    buy: number
    sell: number
    dividends: number
    deposits: number
    withdrawals: number
    taxes: number
    fees: number
    earnings: number
  }

  interface IStockController extends IYearController {
    invest: number
    portfolio: number
    buyCount: number
  }

  interface ITotalController extends IYearController {
    account: number
    depot: number
    winloss: number
    winlossPercent: number
    depotBuyValue: number
  }

  interface IStock {
    cID: number
    cCompany: string
    cISIN: string
    cWKN: string
    cSym: string
    cQuarterDay: number
    cMeetingDay: number
    cFadeOut: number
    cFirstPage: number
    cNotFirstPage?: number
    cURL: string
    mSortDate?: number
    mPortfolio?: number
    mBuyValue?: number
    mValue?: number
    mMin?: number
    mMax?: number
    mChange?: number
    mEuroChange?: number
    mDividendYielda?: number
    mDividendYeara?: number
    mDividendYieldb?: number
    mDividendYearb?: number
    mRealDividend?: number
    mRealBuyValue?: number
    mDeleteable?: boolean
  }

  interface IBackupSm {
    cVersion: number
    cDBVersion: number
    cDBCurrency: string
    cEngine: string
  }

  interface IBackup {
    sm: IBackupSm
    stocks: IStock[]
    transfers: ITransfer[]
    orders?: unknown[]
  }

  interface IStorageLocal {
    service?: IService
    skin?: string
    indexes?: string[]
    materials?: string[]
    markets?: string[]
    exchanges?: string[]
    partner?: boolean
    items_per_page_stocks?: number
    items_per_page_transfers?: number
  }

  interface IUseConstants {
    CURRENCIES: {
      EUR: string
      USD: string
      CODE: Map<string, string>
    }
    DATE: {
      DEFAULT: number
      DEFAULTSTR: string
      FYEAR: number
      MILLIPERDAY: number
      MILLIPERMIN: number
    }
    DB: {
      BKFN: string
      NAME: string
      RECORD_TYPES: {
        // do not change! (part of database records)
        BUY: number
        CUR: number
        DIV: number
        DEPOSIT: number
        WITHDRAWAL: number
        SELL: number
        PER: number
        UNDEFINED: number
        // do not change! (part of database records)
      }
      STORES: {
        // do not change! (part of database records)
        S: string
        SC: string[]
        T: string
        TC: string[]
        // do not change! (part of database records)
      }
      VERSION: number
      MINVERSION: number
    }
    DEFAULTS: {
      CURRENCY: string
      LANG: string
      YEAR: number
      STORAGE: {
        service: { name: string, url: string }
        skin: string
        indexes: string[]
        materials: string[]
        markets: string[]
        exchanges: string[]
        partner: boolean
        items_per_page_stocks: number
        items_per_page_transfers: number
      }
    }
    DIALOGS: Record<string, string>
    EVENTS: Record<string, string>
    FETCH_API: Record<string, string>
    SETTINGS: {
      MP: string
      EX: string
      INDEXES: Record<string, string>
      MATERIALS: Map<string, string>
      ITEMS_PER_PAGE_OPTIONS: Array<{
        value: number
        title: string
      }>
    }
    SEND_API: Record<string, string>
    PERMISSIONS: {
      origins: string[]
    }
    RESOURCES: Record<string, string>
    SERVICES: {
      goyax: {
        NAME: string
        HOME: string
        QUOTE: string
        DELAY: number
      }
      fnet: {
        NAME: string
        HOME: string
        INDEXES: string
        QUOTE: string
        DATES: string
        MATERIALS: string
        GM: string
        QF: string
        DELAY: number
      }
      wstreet: {
        NAME: string
        HOME: string
        QUOTE: string
        DELAY: number
      }
      acheck: {
        NAME: string
        HOME: string
        QUOTE: string
        DELAY: number
      }
      ard: {
        NAME: string
        HOME: string
        QUOTE: string
        DELAY: number
      }
      fx: {
        NAME: string
        HOME: string
        EXCHANGE: string
        DELAY: number
      }
      tgate: {
        NAME: string
        HOME: string
        QUOTE: string
        CHSURL: string
        CHBURL: string
        CHS: string[]
        CHB: string[]
        CHANGES: Record<string, number>
        DELAY: number
      }
    }
    STATES: {
      DONE: string
      SRV: number
      SUCCESS: number
      PAUSE: string
      MUTATE: string
      NORENDER: string
    }
    SYSTEM: {
      COPYRIGHT: string
      FETCHTO: number
      DELAY: number
      EMAIL: string
      GET: string
      HTMLENTITY: string
      ISINLENGTH: number
      KEYS: Record<string, string>
      ERRORS: Record<string, string>
      NULL: number
      PERCENT: number
      PROGRESSBAR: { MAX: number }
      ROWS: number
      STARTUP: number
      TYPE: number
      ONCE: { once: boolean }
    }
    RECORDS: {
      TEMPLATES: {
        STOCK: IStock
        MSTOCK: Record<string, number | boolean>
        TRANSFER: ITransfer
      }
      TYPES: Record<string, number>
      CONTROLLER: {
        TOTAL: ITotalController
      }
    }
  }

  interface IUseListener {
    onClick: () => Promise<void>
    onRemove: (permissions: browser.permissions.Permissions) => void
    onInstall: () => void
    onMessage: (ev: MessageEvent<unknown>) => Promise<void>
  }

  interface IUseFetchApi {
    fetchCompanyData: (isin: string) => Promise<TFetch>
    fetchDailyChangesData: (table: string, mode?: number) => Promise<TFetch[]>
    fetchDatesData: (obj: { isin: string, id: number }) => Promise<TFetch>
    fetchExchangesData: (exchangesCodes: string[]) => Promise<TFetch[]>
    fetchIndexData: () => Promise<TFetch[]>
    fetchMaterialData: () => Promise<TFetch[]>
    fetchMinRateMaxData: (serviceName: string, storageonline: TFetch[]) => Promise<TFetch[]>
  }

  interface IUseAppLibrary {
    CONS: IUseConstants
    migrateStock: (stock: IStock) => IStock
    migrateTransfer: (transfer: ITransfer) => ITransfer
    notice: (messages: string[]) => void
    getUI: () => Record<string, string>
    group: (count: number, size?: number) => number[]
    offset: () => number
    isoDatePlusSeconds: (iso: string | number | Date) => number
    toNumber: (
      str: string | boolean | number | undefined | null
    ) => number
    mean: (nar: number[]) => number
    dateToISO: (value: number) => string
    emptyFunction: () => void
    initStorageLocal: () => Promise<void>
  }
}
// TODO what is required???
if (window.location.href.includes('background')) {
  const useFetchApi = (): IUseFetchApi => {
    const CONS = useConstants()
    const {mean, notice, toNumber} = useAppLibrary()
    const fetchMinRateMaxData = async (
      serviceName: string,
      storageOnline: TFetch[]
    ): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchMinRateMaxData')
      const _fnet = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return Promise.all(
          urls.map(async (urlObj: IUrlWithId): Promise<TFetch> => {
            const firstResponse = await fetch(urlObj.url) // .then(async (firstResponse) => {
            const secondResponse = await fetch(firstResponse.url)
            const secondResponseText = await secondResponse.text()
            const onlineDocument = new DOMParser().parseFromString(
              secondResponseText,
              'text/html'
            )
            const onlineNodes = onlineDocument.querySelectorAll(
              '#snapshot-value-fst-current-0 > span'
            )
            const onlineArticleNodes = onlineDocument.querySelectorAll(
              'main > div > aside article'
            )
            let onlineMin = '0'
            let onlineMax = '0'
            let onlineCurrency = 'EUR'
            let onlineRate = '0'
            if (onlineArticleNodes.length > 1) {
              const onlineMmNodes =
                onlineArticleNodes[1].querySelectorAll('table > tbody > tr')
              onlineMin =
                onlineMmNodes[6].childNodes[1].textContent?.split(' ')[0] ?? '0'
              onlineMax =
                onlineMmNodes[7].childNodes[1].textContent?.split(' ')[0] ?? '0'
            }
            if (onlineNodes.length > 1) {
              onlineCurrency = onlineNodes[1].textContent ?? ''
              onlineRate = onlineNodes[0].textContent ?? ''
            }
            return {
              id: urlObj.ident,
              isin: '',
              rate: onlineRate,
              min: onlineMin,
              max: onlineMax,
              cur: onlineCurrency
            }
          })
        )
      }
      const _ard = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return Promise.all(
          urls.map(async (urlObj: IUrlWithId): Promise<TFetch> => {
            const firstResponse = await fetch(urlObj.url) // .then(async (firstResponse) => {
            const firstResponseText = await firstResponse.text()
            const firstResponseDocument = new DOMParser().parseFromString(
              firstResponseText,
              'text/html'
            )
            const firstResponseRows = firstResponseDocument.querySelectorAll(
              '#desktopSearchResult > table > tbody > tr'
            )
            if (firstResponseRows.length > 0) {
              const url = firstResponseRows[0].getAttribute('onclick') ?? ''
              const secondResponse = await fetch(
                url.replace('document.location=\'', '').replace('\';', '')
              )
              const secondResponseText = await secondResponse.text()
              const onlineDocument = new DOMParser().parseFromString(
                secondResponseText,
                'text/html'
              )
              const onlineCurrency = 'EUR'
              const ardRows: NodeListOf<HTMLTableRowElement> =
                onlineDocument.querySelectorAll(
                  '#USFkursdaten table > tbody tr'
                )
              const onlineRate = (
                ardRows[0].cells[1].textContent ?? '0'
              ).replace('€', '')
              const onlineMin = (
                ardRows[6].cells[1].textContent ?? '0'
              ).replace('€', '')
              const onlineMax = (
                ardRows[7].cells[1].textContent ?? '0'
              ).replace('€', '')
              return {
                id: urlObj.ident,
                isin: '',
                rate: onlineRate,
                min: onlineMin,
                max: onlineMax,
                cur: onlineCurrency
              }
            } else {
              return {
                id: urlObj.ident,
                isin: '',
                rate: '0',
                min: '0',
                max: '0',
                cur: 'EUR'
              }
            }
          })
        )
      }
      const _wstreet = async (
        urls: IUrlWithId[],
        homeUrl: string
      ): Promise<TFetch[]> => {
        return Promise.all(
          urls.map(async (urlObj: IUrlWithId): Promise<TFetch> => {
            const firstResponse = await fetch(urlObj.url)
            const firstResponseJson = await firstResponse.json()
            const url2 = homeUrl + firstResponseJson.result[0].link
            const secondResponse = await fetch(url2)
            const secondResponseText = await secondResponse.text()
            const onlineDocument = new DOMParser().parseFromString(
              secondResponseText,
              'text/html'
            )
            const onlineTables = onlineDocument.querySelectorAll('div.c2 table')
            const onlineCurrency = 'EUR'
            const onlineRate =
              onlineTables[0]
                ?.querySelectorAll('tr')[1]
                ?.querySelectorAll('td')[1].textContent ?? '0'
            const onlineMax =
              onlineTables[1]
                ?.querySelectorAll('tr')[2]
                ?.querySelectorAll('td')[1].textContent ?? '0'
            const onlineMin =
              onlineTables[1]
                ?.querySelectorAll('tr')[3]
                ?.querySelectorAll('td')[1].textContent ?? '0'
            return {
              id: urlObj.ident ?? 0,
              isin: '',
              rate: onlineRate,
              min: onlineMin,
              max: onlineMax,
              cur: onlineCurrency
            }
          })
        )
      }
      const _goyax = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return Promise.all(
          urls.map(async (urlObj: IUrlWithId): Promise<TFetch> => {
            const firstResponse = await fetch(urlObj.url) // .then(async (firstResponse) => {
            const secondResponse = await fetch(firstResponse.url)
            const secondResponseText = await secondResponse.text()
            const onlineDocument = new DOMParser().parseFromString(
              secondResponseText,
              'text/html'
            )
            const onlineNodes = onlineDocument.querySelectorAll(
              'div#instrument-ueberblick > div'
            )
            const onlineRateNodes =
              onlineNodes[1].querySelectorAll('ul.list-rows')
            const onlineRateAll =
              onlineRateNodes[1].querySelectorAll('li')[3].textContent ?? '0'
            const onlineRate = onlineRateAll.split(')')[1] ?? '0'
            const onlineStatisticRows = onlineNodes[0]
              .querySelectorAll('table')[1]
              .querySelectorAll('tr')
            const onlineMax =
              onlineStatisticRows[4].querySelectorAll('td')[3].textContent ??
              '0'
            const onlineMin =
              onlineStatisticRows[5].querySelectorAll('td')[3].textContent ??
              '0'
            const onlineCurrency = 'EUR'
            return {
              id: urlObj.ident,
              isin: '',
              rate: onlineRate,
              min: onlineMin,
              max: onlineMax,
              cur: onlineCurrency
            }
          })
        )
      }
      const _acheck = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return Promise.all(
          urls.map(async (urlObj: IUrlWithId): Promise<TFetch> => {
            const firstResponse = await fetch(urlObj.url) // .then(async (firstResponse) => {
            let onlineCurrency = ''
            const secondResponse = await fetch(firstResponse.url)
            const secondResponseText = await secondResponse.text()
            const onlineDocument = new DOMParser().parseFromString(
              secondResponseText,
              'text/html'
            )
            const onlineTables =
              onlineDocument.querySelectorAll('#content table')
            const onlineRate =
              onlineTables[0]
                .querySelectorAll('tr')[1]
                .querySelectorAll('td')[1].textContent ?? '0'
            const findCurrency =
              onlineTables[0]
                .querySelectorAll('tr')[1]
                .querySelectorAll('td')[2].textContent ?? '0'
            const onlineMin =
              onlineTables[2]
                .querySelectorAll('tr')[3]
                .querySelectorAll('td')[2].textContent ?? '0'
            const onlineMax =
              onlineTables[2]
                .querySelectorAll('tr')[3]
                .querySelectorAll('td')[1].textContent ?? '0'
            if (findCurrency.includes('$')) {
              onlineCurrency = 'USD'
            } else if (findCurrency.includes('€')) {
              onlineCurrency = 'EUR'
            }
            return {
              id: urlObj.ident,
              isin: '',
              rate: onlineRate,
              min: onlineMin,
              max: onlineMax,
              cur: onlineCurrency
            }
          })
        )
      }
      const _tgate = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return Promise.all(
          urls.map(async (urlObj: IUrlWithId): Promise<TFetch> => {
            const firstResponse = await fetch(urlObj.url)
            const onlineCurrency = 'EUR'
            const onlineMax = '0'
            const onlineMin = '0'
            const onlineDocument = new DOMParser().parseFromString(
              await firstResponse.text(),
              'text/html'
            )
            const resultask =
              onlineDocument.querySelector('#ask') !== null
                ? onlineDocument.querySelector('#ask')?.textContent
                : '0'
            const resultbid =
              onlineDocument.querySelector('#bid') !== null
                ? onlineDocument.querySelector('#bid')?.textContent
                : '0'
            const quote = mean([toNumber(resultbid), toNumber(resultask)])
            const onlineRate = quote.toString()
            return {
              id: urlObj.ident,
              isin: '',
              rate: onlineRate,
              min: onlineMin,
              max: onlineMax,
              cur: onlineCurrency
            }
          })
        )
      }
      const _select = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return new Promise(async (resolve) => {
          let mmr: TFetch[]
          switch (serviceName) {
            case 'fnet':
              mmr = await _fnet(urls)
              break
            case 'ard':
              mmr = await _ard(urls)
              break
            case 'wstreet':
              mmr = await _wstreet(urls, CONS.SERVICES[serviceName].HOME)
              break
            case 'goyax':
              mmr = await _goyax(urls)
              break
            case 'acheck':
              mmr = await _acheck(urls)
              break
            case 'tgate':
              mmr = await _tgate(urls)
              break
            default:
              throw new Error('ONLINE: fetchMinRateMaxData: unknown service!')
          }
          resolve(mmr)
        })
      }
      const urls: IUrlWithId[] = []
      if (storageOnline.length > 0) {
        for (let i = 0; i < storageOnline.length; i++) {
          urls.push({
            url: CONS.SERVICES[serviceName].QUOTE + storageOnline[i].isin,
            ident: storageOnline[i].id ?? -1
          })
        }
      }
      return await _select(urls)
    }
    const fetchDailyChangesData = async (
      table: string,
      mode = CONS.SERVICES.tgate.CHANGES.SMALL
    ): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchDailyChangesData')
      return new Promise(async (resolve) => {
        let valuestr: string
        let company: string
        let sDocument: Document
        let trCollection: NodeListOf<HTMLTableRowElement>
        let url = CONS.SERVICES.tgate.CHBURL + table
        let selector = '#kursliste_abc > tr'
        if (mode === CONS.SERVICES.tgate.CHANGES.SMALL) {
          url = CONS.SERVICES.tgate.CHSURL + table
          selector = '#kursliste_daten > tr'
        }
        const convertHTMLEntities = (str: string | null): string => {
          const entities = new Map([
            ['aum', 'ä'],
            ['Aum', 'Ä'],
            ['oum', 'ö'],
            ['Oum', 'Ö'],
            ['uum', 'ü'],
            ['Uum', 'Ü'],
            ['amp', '&'],
            ['eac', 'é'],
            ['Eac', 'É'],
            ['eci', 'ê'],
            ['Eci', 'Ê'],
            ['oac', 'ó'],
            ['Oac', 'Ó'],
            ['ael', 'æ'],
            ['Ael', 'Æ']
          ])
          const fMatch = (match: string): string => {
            return entities.get(match.substring(1, 4)) ?? ''
          }
          let result = ''
          if (str !== null) {
            result = str
              .trim()
              .replace(new RegExp(CONS.SYSTEM.HTMLENTITY, 'g'), fMatch)
          }
          return result
        }
        const entry: TFetch = {
          key: '',
          value: {
            percentChange: '',
            change: 0,
            stringChange: ''
          }
        }
        const firstResponse = await fetch(url)
        const _changes: TFetch[] = []
        if (
          firstResponse.url.length === 0 ||
          !firstResponse.ok ||
          firstResponse.status >= CONS.STATES.SRV ||
          (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)
        ) {
          notice(['Request failed'])
        } else {
          const firstResponseText = await firstResponse.text()
          sDocument = new DOMParser().parseFromString(
            firstResponseText,
            'text/html'
          )
          trCollection = sDocument.querySelectorAll(selector)
          for (let i = 0; i < trCollection.length; i++) {
            valuestr = trCollection[i].childNodes[11].textContent ?? ''
            company = convertHTMLEntities(
              trCollection[i].childNodes[1].textContent ?? ''
            ).replace('<wbr>', '')
            entry.key = company.toUpperCase()
            entry.value = {
              percentChange: valuestr.replace(/\t/g, ''),
              change: toNumber(valuestr),
              stringChange: toNumber(valuestr).toString()
            }
            _changes.push({...entry})
          }
        }
        resolve(_changes)
      })
    }
    const fetchCompanyData = async (
      isin: string
    ): Promise<TFetch> => {
      console.log('BACKGROUND: fetchCompanyData')
      return new Promise(async (resolve) => {
        let sDocument: Document
        let company = ''
        let child: ChildNode | undefined
        let wkn: string
        let symbol: string
        let tables: NodeListOf<HTMLTableRowElement>
        let result: TFetch = {
          company: '',
          isin: '',
          wkn: '',
          symbol: ''
        }
        if (isin.length === 12) {
          const firstResponse = await fetch(CONS.SERVICES.tgate.QUOTE + isin)
          if (
            firstResponse.url.length === 0 ||
            !firstResponse.ok ||
            firstResponse.status >= CONS.STATES.SRV ||
            (firstResponse.status > 0 &&
              firstResponse.status < CONS.STATES.SUCCESS)
          ) {
            notice(['Already first request failed'])
          } else {
            const secondResponse = await fetch(firstResponse.url)
            if (
              !secondResponse.ok ||
              secondResponse.status >= CONS.STATES.SRV ||
              (secondResponse.status > 0 &&
                secondResponse.status < CONS.STATES.SUCCESS)
            ) {
              notice(['Second request failed'])
            } else {
              const secondResponseText = await secondResponse.text()
              sDocument = new DOMParser().parseFromString(
                secondResponseText,
                'text/html'
              )
              tables = sDocument.querySelectorAll('table > tbody tr')
              child = sDocument?.querySelector('#col1_content')?.childNodes[1]
              company =
                child?.textContent !== null
                  ? child?.textContent.split(',')[0].trim() ?? ''
                  : ''
              if (
                !company.includes('Die Gattung wird') &&
                tables[1].cells !== null &&
                tables.length > 0
              ) {
                wkn = tables[1].cells[0].textContent ?? ''
                symbol = tables[1].cells[1].textContent ?? ''
                result = {
                  company,
                  isin,
                  wkn,
                  symbol
                }
              }
            }
          }
        } else {
          result = {
            company: '',
            isin: '',
            wkn: '',
            symbol: ''
          }
        }
        resolve(result)
      })
    }
    const fetchExchangesData = async (
      exchangeCodes: string[]
    ): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchExchangesData')
      return new Promise(async (resolve) => {
        const fExUrl = (code: string): string => {
          return `${CONS.SERVICES.fx.EXCHANGE}${code.substring(
            0,
            3
          )}&cp_input=${code.substring(3, 6)}&amount_from=1`
        }
        const result: TFetch[] = []
        for (let i = 0; i < exchangeCodes.length; i++) {
          const firstResponse = await fetch(fExUrl(exchangeCodes[i]))
          if (
            !firstResponse.ok ||
            firstResponse.status >= CONS.STATES.SRV ||
            (firstResponse.status > 0 &&
              firstResponse.status < CONS.STATES.SUCCESS)
          ) {
            notice([firstResponse.statusText])
          }
          const firstResponseText = await firstResponse.text()
          const resultDocument: Document = new DOMParser().parseFromString(
            firstResponseText,
            'text/html'
          )
          const resultTr = resultDocument.querySelectorAll(
            '#formcalculator > table > tbody tr'
          )[2]
          const resultString = resultTr.querySelector('div')?.textContent ?? ''
          const resultMatchArray = resultString.match(/[0-9]*\.?[0-9]+/g) ?? ['1']
          const exchangeRate = Number.parseFloat(resultMatchArray[0])
          // noinspection JSUnresolvedReference
          result.push({key: exchangeCodes[i], value: exchangeRate})
        }
        resolve(result)
      })
    }
    const fetchMaterialData = async (): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchMaterialData')
      return new Promise(async (resolve) => {
        const materials: TFetch[] = []
        const firstResponse = await fetch(CONS.SERVICES.fnet.MATERIALS)
        if (
          !firstResponse.ok ||
          firstResponse.status >= CONS.STATES.SRV ||
          (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)
        ) {
          notice([firstResponse.statusText])
        }
        const firstResponseText = await firstResponse.text()
        const resultDocument: Document = new DOMParser().parseFromString(
          firstResponseText,
          'text/html'
        )
        const resultTr = resultDocument.querySelectorAll(
          '#commodity_prices > table > tbody tr'
        )
        for (let i = 0; i < resultTr.length; i++) {
          if (
            resultTr[i].children[0].tagName === 'TD' &&
            CONS.SETTINGS.MATERIALS.get(
              resultTr[i].children[0].textContent ?? ''
            ) !== undefined
          ) {
            materials.push({
              key: CONS.SETTINGS.MATERIALS.get(
                resultTr[i].children[0].textContent ?? ''
              ),
              value: toNumber(resultTr[i].children[1].textContent)
            })
          }
        }
        resolve(materials)
      })

      // TODO price arrives in USD
      // TODO check foreign exchange norwegian crones
    }
    const fetchIndexData = async (): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchIndexData')
      return new Promise(async (resolve) => {
        const indexes: TFetch[] = []
        const indexesKeys = Object.keys(CONS.SETTINGS.INDEXES)
        const indexesValues: string[] = Object.values(CONS.SETTINGS.INDEXES)
        const firstResponse = await fetch(CONS.SERVICES.fnet.INDEXES)
        if (
          !firstResponse.ok ||
          firstResponse.status >= CONS.STATES.SRV ||
          (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)
        ) {
          notice([firstResponse.statusText])
        }
        const firstResponseText = await firstResponse.text()
        const resultDocument: Document = new DOMParser().parseFromString(
          firstResponseText,
          'text/html'
        )
        const resultTr = resultDocument.querySelectorAll('.index-world-map a')
        for (let i = 0; i < indexesKeys.length; i++) {
          for (let j = 0; j < resultTr.length; j++) {
            if (
              indexesValues[i].includes(
                resultTr[j].getAttribute('title') ?? ''
              ) &&
              resultTr[j].children[0].textContent !== undefined
            ) {
              indexes.push({
                key: indexesKeys[i],
                value: toNumber(resultTr[j].children[0].textContent)
              })
            }
          }
        }
        resolve(indexes)
      })
    }
    const fetchDatesData = async (obj: {
      isin: string
      id: number
    }): Promise<TFetch> => {
      console.log('BACKGROUND: fetchDatesData')
      return new Promise(async (resolve) => {
        const gmqf = {gm: 0, qf: 0}
        const parseGermanDate = (germanDateString: string): number => {
          const parts = germanDateString.match(/(\d+)/g) ?? ['01', '01', '1970']
          const year =
            parts.length === 3 && parts[2].length === 4 ? parts[2] : '1970'
          const month = parts.length === 3 ? parts[1].padStart(2, '0') : '01'
          const day = parts.length === 3 ? parts[0].padStart(2, '0') : '01'
          return new Date(`${year}-${month}-${day}`).getTime()
        }
        const firstResponse = await fetch(
          'https://www.finanzen.net/suchergebnis.asp?_search=' + obj.isin
        )
        if (
          firstResponse.url.length === 0 ||
          !firstResponse.ok ||
          firstResponse.status >= CONS.STATES.SRV ||
          (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)
        ) {
          console.error('BACKGROUND: fetchDatesData: First request failed')
        } else {
          const atoms = firstResponse.url.split('/')
          const stockName = atoms[atoms.length - 1].replace('-aktie', '')
          const secondResponse = await fetch(
            'https://www.finanzen.net/termine/' + stockName
          )
          if (
            !secondResponse.ok ||
            secondResponse.status >= CONS.STATES.SRV ||
            (secondResponse.status > 0 &&
              secondResponse.status < CONS.STATES.SUCCESS)
          ) {
            console.error('BACKGROUND: fetchDatesData: Second request failed')
          } else {
            const secondResponseText = await secondResponse.text()
            const qfgmDocument = new DOMParser().parseFromString(secondResponseText, 'text/html')
            const tables = qfgmDocument.querySelectorAll('.table')
            const rows = tables[1].querySelectorAll('tr')
            let stopGm = false
            let stopQf = false
            const gmqfString = {gm: '01.01.1970', qf: '01.01.1970'}
            for (let j = 0; j < rows.length && !!(rows[j].cells[3]); j++) {
              const row = rows[j].cells[3].textContent?.replaceAll('(e)*', '').trim() ?? '01.01.1970'
              if (
                rows[j].cells[0].textContent === 'Quartalszahlen' &&
                row !== '01.01.1970' &&
                row.length === 10 &&
                !stopQf
              ) {
                gmqfString.qf = row
                stopQf = true
              } else if (
                rows[j].cells[0].textContent === 'Hauptversammlung' &&
                row !== '01.01.1970' &&
                row.length === 10 &&
                !stopGm
              ) {
                gmqfString.gm = row
                stopGm = true
              }
              if (stopQf && stopGm) break
            }
            gmqf.qf =
              gmqfString.qf !== undefined && gmqfString.qf !== ''
                ? parseGermanDate(gmqfString.qf)
                : 0
            gmqf.gm =
              gmqfString.gm !== undefined && gmqfString.gm !== ''
                ? parseGermanDate(gmqfString.gm)
                : 0
          }
        }
        resolve({key: obj.id, value: gmqf})
      })
    }
    return {
      fetchMinRateMaxData,
      fetchDailyChangesData,
      fetchCompanyData,
      fetchExchangesData,
      fetchMaterialData,
      fetchIndexData,
      fetchDatesData
    }
  }
  const useListener = (): IUseListener => {
    const CONS = useConstants()
    const appUrls = {url: browser.runtime.getURL(CONS.RESOURCES.INDEX) + '*'}
    let storageService = CONS.DEFAULTS.STORAGE.service
    const onClick = async (): Promise<void> => {
      console.log('BACKGROUND: onClick')
      return await new Promise(async (resolve): Promise<void> => {
        const CONS = useConstants()
        const {notice} = useAppLibrary()
        const start = async (): Promise<void> => {
          console.log('BACKGROUND: onClick: start')
          const textDetailOn = {text: 'on'}
          const colorDetailGreen = {color: '#008000'}
          const textDetailOff = {text: 'off'}
          const colorDetailRed = {color: '#ff0000'}
          const dataUrls: string[] = []
          const serviceKeys: string[] = Object.keys(CONS.SERVICES)
          const foundTabs = await browser.tabs.query(appUrls)
          for (let i = 0; i < serviceKeys.length; i++) {
            dataUrls.push(CONS.SERVICES[serviceKeys[i]].HOME as string)
          }
          dataUrls.map(async (url: string): Promise<void> => {
            const resp = await fetch(url)
            if (resp.ok) {
              await browser.action.setBadgeText(textDetailOn)
              await browser.action.setBadgeBackgroundColor(colorDetailGreen)
            } else {
              console.error('No connection to ' + url)
              await browser.action.setBadgeText(textDetailOff)
              await browser.action.setBadgeBackgroundColor(colorDetailRed)
            }
          })
          // NOTE: any async webextension API call which triggers a corresponding event listener will reload background.js.
          if (foundTabs.length === 0) {
            await browser.tabs.create({
              url: browser.runtime.getURL(CONS.RESOURCES.INDEX),
              active: true
            })
          } else {
            await browser.windows.update(foundTabs[0].windowId ?? 0, {
              focused: true
            })
            await browser.tabs.update(foundTabs[0].id ?? 0, {active: true})
          }
        }
        // Make aware in case of a missing permission
        const permit = await browser.permissions.request(CONS.PERMISSIONS)
        if (!permit) {
          console.warn('BACKGROUND: onClick: missing permission')
          notice(['Some online data might not be available!'])
        }
        resolve(await start())
      })
    }
    const onRemove = (permissions: browser.permissions.Permissions): void => {
      console.warn('BACKGROUND: onRemove')
      const {notice} = useAppLibrary()
      notice(['Some online data might not be available!', JSON.stringify(permissions)])
    }
    // TODO: onInstall runs at install addon, update addon, firefox update
    const onInstall = (): void => {
      console.log('BACKGROUND: onInstall')
      const CONS = useConstants()
      const {migrateStock, migrateTransfer} = useAppLibrary()
      const onSuccess = (ev: TIDBRequestEvent): void => {
        console.log('BACKGROUND onInstall: onSuccess')
        const onVersionChange = (ev: TIDBRequestEvent): void => {
          console.info(
            'BACKGROUND onInstall:onSuccess:onVersionChange: ',
            ev.target.result
          )
        }
        ev.target.result.addEventListener(
          CONS.EVENTS.VERSIONCHANGE,
          onVersionChange,
          CONS.SYSTEM.ONCE
        )
        ev.target.result.close()
      }
      const onError = (err: ErrorEvent): void => {
        console.error(err.message)
      }
      const onUpgradeNeeded = async (
        ev: IDBVersionChangeEvent
      ): Promise<void> => {
        console.log('BACKGROUND: onInstall: onUpgradeNeeded')
        const fCreateDB = (): void => {
          console.log('BACKGROUND: onInstall: onUpgradeNeeded: fCreateDB')
          const optAuto: IDBObjectStoreParameters = {
            keyPath: 'cID',
            autoIncrement: true
          }
          const optTrue: IDBIndexParameters = {unique: true}
          const optFalse: IDBIndexParameters = {unique: false}
          const requestCreateTStore = dbOpenRequest.result.createObjectStore(
            CONS.DB.STORES.T,
            optAuto
          )
          const requestCreateSStore = dbOpenRequest.result.createObjectStore(
            CONS.DB.STORES.S,
            optAuto
          )
          requestCreateSStore.createIndex('stocks_uk1', 'cISIN', optTrue)
          requestCreateSStore.createIndex('stocks_uk2', 'cSym', optTrue)
          requestCreateSStore.createIndex('stocks_k1', 'cFirstPage', optFalse)
          requestCreateSStore.createIndex('stocks_k2', 'cFadeOut', optFalse)
          requestCreateTStore.createIndex('transfers_k1', 'cDate', optFalse)
          requestCreateTStore.createIndex('transfers_k2', 'cType', optFalse)
          requestCreateTStore.createIndex('transfers_k3', 'cStockID', optFalse)
        }
        const fUpdateDB = (): void => {
          console.log('BACKGROUND: onInstall: onUpgradeNeeded: fUpdateDB')
          // if (!upgradeDb.objectStoreNames.contains('store3')) {
          //   upgradeDb.createObjectStore('store3')
          // }
          const optFalse: IDBIndexParameters = {unique: false}
          const onSuccessStocks = (ev: TIDBRequestEvent): void => {
            console.log(
              'BACKGROUND: onInstall: onUpgradeNeeded: fCreateDB: onSuccessStocks'
            )
            const cursor: IDBCursorWithValue | null = ev.target.result
            if (cursor !== null) {
              const stock: IStock = cursor.value
              cursor.update(migrateStock({...stock}))
              cursor.continue()
            } else {
              stocksOpenCursorRequest?.removeEventListener(
                CONS.EVENTS.SUC,
                onSuccessStocks,
                false
              )
              const onSuccessTransfers = (ev: TIDBRequestEvent): void => {
                console.log(
                  'BACKGROUND: onUpgradeNeeded: fCreateDB: onSuccessTransfers'
                )
                const cursor: IDBCursorWithValue | null = ev.target.result
                if (cursor !== null) {
                  const transfer: ITransfer = cursor.value
                  cursor.update(migrateTransfer({...transfer}))
                  cursor.continue()
                } else {
                  stocksOpenCursorRequest?.removeEventListener(
                    CONS.EVENTS.SUC,
                    onSuccessTransfers,
                    false
                  )
                }
              }
              if (dbOpenRequest?.transaction === null) {
                console.error('BACKGROUND: open database error')
              } else if (
                !dbOpenRequest.transaction
                  ?.objectStore(CONS.DB.STORES.S)
                  .indexNames.contains('stocks_k2')
              ) {
                dbOpenRequest.transaction
                  ?.objectStore(CONS.DB.STORES.S)
                  .createIndex('stocks_k2', 'cFadeOut', optFalse)
              }
              const requestTransfersOpenCursor:
                | IDBRequest<IDBCursorWithValue | null>
                | undefined = dbOpenRequest.transaction?.objectStore(CONS.DB.STORES.T).openCursor()
              requestTransfersOpenCursor?.addEventListener(
                CONS.EVENTS.SUC,
                onSuccessTransfers,
                false
              )
            }
          }
          const onErrorStocks = (err: ErrorEvent): void => {
            stocksOpenCursorRequest?.removeEventListener(
              CONS.EVENTS.ERR,
              onError,
              false
            )
            console.error(err.message)
          }
          const stocksOpenCursorRequest:
            | IDBRequest<IDBCursorWithValue | null>
            | undefined = dbOpenRequest?.transaction?.objectStore(CONS.DB.STORES.S).openCursor()
          stocksOpenCursorRequest?.addEventListener(
            CONS.EVENTS.ERR,
            onErrorStocks,
            false
          )
          stocksOpenCursorRequest?.addEventListener(
            CONS.EVENTS.SUC,
            onSuccessStocks,
            false
          )
          // delete all objectStores but stocks and transfers.
          for (
            let i = 0;
            i < dbOpenRequest.result.objectStoreNames.length;
            i++
          ) {
            if (
              dbOpenRequest.result.objectStoreNames[i] !== CONS.DB.STORES.S &&
              dbOpenRequest.result.objectStoreNames[i] !== CONS.DB.STORES.T
            ) {
              dbOpenRequest.result.deleteObjectStore(
                dbOpenRequest.result.objectStoreNames[i]
              )
            }
          }
        }
        const initStorage = async () => {
          const CONS = useConstants()
          const storageKeys = Object.keys(CONS.DEFAULTS.STORAGE)
          const storageValues = Object.values(CONS.DEFAULTS.STORAGE)
          const storage: IStorageLocal = await browser.storage.local.get(
            storageKeys
          )
          for (let i = 0; i < storageKeys.length; i++) {
            if (storage[storageKeys[i]] === undefined) {
              await browser.storage.local.set({
                [storageKeys[i]]: storageValues[i]
              })
            }
          }
        }
        if (ev.oldVersion === 0) {
          fCreateDB()
        } else {
          fUpdateDB()
          // remove historical values
          browser.storage.local
            .remove([
              'resetconfig',
              'config',
              'reset',
              'itemsPerPage',
              'cb',
              'tb'
            ])
            .catch((err: ErrorEvent) => {
              console.error(err.message)
            })
        }
        await initStorage()
      }
      //
      const dbOpenRequest = indexedDB.open(CONS.DB.NAME, CONS.DB.VERSION)
      dbOpenRequest.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE)
      dbOpenRequest.addEventListener(
        CONS.EVENTS.SUC,
        onSuccess,
        CONS.SYSTEM.ONCE
      )
      dbOpenRequest.addEventListener(
        CONS.EVENTS.UPG,
        onUpgradeNeeded,
        CONS.SYSTEM.ONCE
      )
    }
    const onMessage = async (ev: MessageEvent): Promise<void> => {
      console.info('BACKGROUND: onMessage', ev)
      return await new Promise(async (resolve, reject) => {
        const CONS = useConstants()
        const {
          fetchMinRateMaxData,
          fetchDailyChangesData,
          fetchCompanyData,
          fetchExchangesData,
          fetchMaterialData,
          fetchIndexData,
          fetchDatesData
        } = useFetchApi()
        const foundTabs = await browser.tabs.query(appUrls)
        if (foundTabs.length > 0) {
          const appTab = foundTabs[0].id ?? -1
          switch (ev.type) {
            case CONS.SEND_API.PUT__SERVICE:
              storageService = ev.data
              break
            case CONS.FETCH_API.ASK__DATES_DATA:
              const datesData: TFetch[] = []
              for (let i = 0; i < ev.data.length; i++) {
                datesData.push(await fetchDatesData(ev.data[i]))
              }
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__DATES_DATA,
                data: datesData
              })
              break
            case CONS.FETCH_API.ASK__INDEX_DATA:
              const indexData: TFetch[] = await fetchIndexData()
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__INDEX_DATA,
                data: indexData
              })
              break
            case CONS.FETCH_API.ASK__MATERIAL_DATA:
              const materialData: TFetch[] = await fetchMaterialData()
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__MATERIAL_DATA,
                data: materialData
              })
              break
            case CONS.FETCH_API.ASK__EXCHANGES_DATA:
              const exchangesData: TFetch[] = await fetchExchangesData(ev.data)
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__EXCHANGES_DATA,
                data: exchangesData
              })
              break
            case CONS.FETCH_API.ASK__COMPANY_DATA:
              const companyData: TFetch = await fetchCompanyData(ev.data)
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__COMPANY_DATA,
                data: companyData
              })
              break
            case CONS.FETCH_API.ASK__MIN_RATE_MAX:
              const responseData: TFetch[] = await fetchMinRateMaxData(
                storageService.name,
                ev.data
              )
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__MIN_RATE_MAX,
                data: responseData
              })
              break
            case CONS.FETCH_API.ASK__DAILY_CHANGES:
              const dailyChangesData: TFetch[] = await fetchDailyChangesData(ev.data)
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__DAILY_CHANGES,
                data: dailyChangesData
              })
              break
            case CONS.FETCH_API.END__DAILY_CHANGES:
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.FINISH__DAILY_CHANGES,
                data: []
              })
              break
            case CONS.FETCH_API.ASK__DAILY_CHANGES_ALL:
              const dailyChangesDataAll: TFetch[] = await fetchDailyChangesData(
                ev.data,
                CONS.SERVICES.tgate.CHANGES.BIG
              )
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.ANSWER__DAILY_CHANGES_ALL,
                data: dailyChangesDataAll
              })
              break
            case CONS.FETCH_API.END__DAILY_CHANGES_ALL:
              await browser.tabs.sendMessage(appTab, {
                type: CONS.FETCH_API.FINISH__DAILY_CHANGES_ALL,
                data: []
              })
              break
          }
          resolve()
        } else {
          reject('Missing tab!')
        }
      })
    }
    return {onClick, onRemove, onInstall, onMessage}
  }
  const {initStorageLocal} = useAppLibrary()
  const {onClick, onRemove, onInstall, onMessage} = useListener()
  if (!browser.permissions.onRemoved.hasListener(onRemove)) {
    // noinspection JSDeprecatedSymbols
    browser.permissions.onRemoved.addListener(onRemove)
  }
  if (!browser.runtime.onInstalled.hasListener(onInstall)) {
    // noinspection JSDeprecatedSymbols
    browser.runtime.onInstalled.addListener(onInstall)
  }
  if (!browser.action.onClicked.hasListener(onClick)) {
    // noinspection JSDeprecatedSymbols
    browser.action.onClicked.addListener(onClick)
  }
  if (!browser.runtime.onMessage.hasListener(onMessage)) {
    // noinspection JSDeprecatedSymbols
    browser.runtime.onMessage.addListener(onMessage)
  }
  await initStorageLocal()
}

console.log('--- background.js ---', window.location.href)
