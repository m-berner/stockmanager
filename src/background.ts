/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserve
 */
import {useApp} from '@/composables/useApp'

interface IUseListener {
  onClick: () => Promise<void>
  onRemove: (permissions: browser.permissions.Permissions) => void
  onInstall: () => void
  onMessage: (request: object, sender: object, sendResponse: CallableFunction) => Promise<void>
  onConnect: (port: browser.runtime.Port) => void
}

interface IUrlWithId {
  ident: number
  url: string
}

const initStorageLocal = async (): Promise<void> => {
  console.log('BACKGROUND: initStorageLocal')
  const {CONS} = useApp()
  const storageLocal: IStorageLocal = await browser.storage.local.get()
  if (storageLocal.service === undefined) {
    await browser.storage.local.set({
      service: CONS.DEFAULTS.STORAGE.service
    })
  }
  if (storageLocal.skin === undefined) {
    await browser.storage.local.set({skin: CONS.DEFAULTS.STORAGE.skin})
  }
  if (storageLocal.indexes === undefined) {
    await browser.storage.local.set({
      indexes: CONS.DEFAULTS.STORAGE.indexes
    })
  }
  if (storageLocal.materials === undefined) {
    await browser.storage.local.set({
      materials: CONS.DEFAULTS.STORAGE.materials
    })
  }
  if (storageLocal.markets === undefined) {
    await browser.storage.local.set({
      markets: CONS.DEFAULTS.STORAGE.markets
    })
  }
  if (storageLocal.exchanges === undefined) {
    await browser.storage.local.set({
      exchanges: CONS.DEFAULTS.STORAGE.exchanges
    })
  }
  if (storageLocal.partner === undefined) {
    await browser.storage.local.set({
      partner: CONS.DEFAULTS.STORAGE.partner
    })
  }
  if (storageLocal.items_per_page_stocks === undefined) {
    await browser.storage.local.set({
      items_per_page_stocks: CONS.DEFAULTS.STORAGE.items_per_page_stocks
    })
  }
  if (storageLocal.items_per_page_transfers === undefined) {
    await browser.storage.local.set({
      items_per_page_transfers: CONS.DEFAULTS.STORAGE.items_per_page_transfers
    })
  }
}
const useListener = (): IUseListener => {
  const {CONS} = useApp()
  const appUrls = {url: browser.runtime.getURL(CONS.RESOURCES.INDEX) + '*'}
  const onClick = async (): Promise<void> => {
    console.log('BACKGROUND: onClick')
    const {notice} = useApp()
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
    await start()
  }
  const onRemove = (permissions: browser.permissions.Permissions): void => {
    console.warn('BACKGROUND: onRemove')
    const {notice} = useApp()
    notice(['Online data might not be available.', JSON.stringify(permissions)])
  }
  // NOTE: onInstall runs at addon install, addon update and firefox update
  const onInstall = (): void => {
    console.log('BACKGROUND: onInstall')
    const {migrateStock, migrateTransfer} = useApp()
    const onSuccess = (ev: TIDBRequestEvent): void => {
      console.log('BACKGROUND: onInstall: onSuccess')
      ev.target.result.close()
    }
    const onError = (err: ErrorEvent): void => {
      console.error('BACKGROUND: onError: ', err.message)
    }
    const onUpgradeNeeded = async (
      ev: IDBVersionChangeEvent
    ): Promise<void> => {
      console.log('BACKGROUND: onInstall: onUpgradeNeeded')
      const createDB = (): void => {
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
      const updateDB = (): void => {
        console.log('BACKGROUND: onInstall: onUpgradeNeeded: fUpdateDB')
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
      const updateStorageLocal = async () => {
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
        createDB()
      } else {
        updateDB()
        // remove historical values
        await browser.storage.local
          .remove(CONS.SYSTEM.STORAGE_OLD)
      }
      await updateStorageLocal()
    }
    //
    const dbOpenRequest = indexedDB.open(CONS.DB.NAME, CONS.DB.VERSION)
    dbOpenRequest.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE)
    dbOpenRequest.addEventListener(CONS.EVENTS.SUC, onSuccess, CONS.SYSTEM.ONCE)
    dbOpenRequest.addEventListener(CONS.EVENTS.UPG, onUpgradeNeeded, CONS.SYSTEM.ONCE)
  }
  const onMessage = async (ev: MessageEvent): Promise<void> => {
    console.info('BACKGROUND: onMessage', ev)
    const {mean, notice, toNumber} = useApp()
    const fetchMinRateMaxData = async (storageOnline: TFetch[]): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchMinRateMaxData')
      const storageService = await browser.storage.local.get('service')
      const serviceName = storageService.service.name
      const _fnet = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return await Promise.all(
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
        return await Promise.all(
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
        return await Promise.all(
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
            const onlineRates = onlineDocument.querySelectorAll('div.c2 table')
            const onlineMinMax = onlineDocument.querySelectorAll('div.fundamental > div > div.float-start')
            let onlineCurrency = ''
            const onlineRate =
              onlineRates[0]
                ?.querySelectorAll('tr')[1]
                ?.querySelectorAll('td')[1].textContent ?? '0'
            const onlineMax = onlineMinMax[1].textContent?.split('Hoch')[1]
            const onlineMin = onlineMinMax[1].textContent?.split('Hoch')[0].split('WochenTief')[1]
            if (onlineRate.includes('USD')) {
              onlineCurrency = 'USD'
            } else if (onlineRate.includes('EUR')) {
              onlineCurrency = 'EUR'
            }
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
        return await Promise.all(
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
        return await Promise.all(
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
            if (onlineTables.length > 1) {
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
            } else {
              return {
                id: -1,
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
      const _tgate = async (urls: IUrlWithId[]): Promise<TFetch[]> => {
        return await Promise.all(
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
        return mmr
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
      return _changes
    }
    const fetchCompanyData = async (
      isin: string
    ): Promise<TFetch> => {
      console.log('BACKGROUND: fetchCompanyData')
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
      return result
    }
    // TODO ask dates only once a day
    const fetchExchangesData = async (exchangeCodes: string[]): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchExchangesData')
      const fExUrl = (code: string): string => {
        return `${CONS.SERVICES.fx.EXCHANGE}${code.substring(0, 3)}&cp_input=${code.substring(3, 6)}&amount_from=1`
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
      return result
    }
    const fetchMaterialData = async (): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchMaterialData')
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
      return materials
    }
    const fetchIndexData = async (): Promise<TFetch[]> => {
      console.log('BACKGROUND: fetchIndexData')
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
      return indexes
    }
    const fetchDatesData = async (obj: { isin: string, id: number }): Promise<TFetch> => {
      console.log('BACKGROUND: fetchDatesData')
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
      return {key: obj.id, value: gmqf}
    }
    const foundTabs = await browser.tabs.query(appUrls)
    if (foundTabs.length > 0) {
      const appTab = foundTabs[0].id ?? -1
      switch (ev.type) {
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
        case CONS.FETCH_API.ASK__EXCHANGES_BASE_DATA:
          const exchangesBaseData: TFetch[] = await fetchExchangesData(ev.data)
          await browser.tabs.sendMessage(appTab, {
            type: CONS.FETCH_API.ANSWER__EXCHANGES_BASE_DATA,
            data: exchangesBaseData
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
          const responseData: TFetch[] = await fetchMinRateMaxData(ev.data)
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
          if (Number.parseInt(ev.lastEventId) === CONS.SERVICES.tgate.CHS.length - 1) {
            await browser.tabs.sendMessage(appTab, {
              type: CONS.FETCH_API.FINISH__DAILY_CHANGES,
              data: []
            })
          }
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
          if (Number.parseInt(ev.lastEventId) === CONS.SERVICES.tgate.CHB.length - 1) {
            await browser.tabs.sendMessage(appTab, {
              type: CONS.FETCH_API.FINISH__DAILY_CHANGES,
              data: []
            })
          }
          break
        default:
          console.error('BACKGROUND: missing fetchApi event type')
      }
    } else {
      console.info('BACKGROUND: No stockmanager tab found!')
    }
  }
  const onConnect = (aPort: browser.runtime.Port) => {
    console.log('BACKGROUND: onConnect', aPort.name)
    // noinspection JSDeprecatedSymbols
    aPort.onMessage.addListener(onMessage)
    // DO something, next answer
    // aPort.postMessage({greeting: 'hi there content script!'})
  }
  return {onClick, onRemove, onInstall, onMessage, onConnect}
}
const {onClick, onRemove, onInstall, onConnect} = useListener()
if (!browser.runtime.onInstalled.hasListener(onInstall)) {
  // noinspection JSDeprecatedSymbols
  browser.runtime.onInstalled.addListener(onInstall)
}
if (!browser.action.onClicked.hasListener(onClick)) {
  // noinspection JSDeprecatedSymbols
  browser.action.onClicked.addListener(onClick)
}
if (!browser.permissions.onRemoved.hasListener(onRemove)) {
  // noinspection JSDeprecatedSymbols
  browser.permissions.onRemoved.addListener(onRemove)
}
if (!browser.runtime.onConnect.hasListener(onConnect)) {
  // noinspection JSDeprecatedSymbols
  browser.runtime.onConnect.addListener(onConnect)
}
await initStorageLocal()
console.info('--- background.js ---', window.location.href)