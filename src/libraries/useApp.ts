/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * you could obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
 */
import {useConstants} from '@/libraries/useConstants'

export const useAppLibrary = (): IUseAppLibrary => {
  const CONS = useConstants()
  const migrateStock = (stock: IStock): IStock => {
    delete stock.mPortfolio
    delete stock.mBuyValue
    delete stock.mValue
    delete stock.mMin
    delete stock.mMax
    delete stock.mChange
    delete stock.mEuroChange
    delete stock.mDividendYielda
    delete stock.mDividendYeara
    delete stock.mDividendYieldb
    delete stock.mDividendYearb
    delete stock.mRealDividend
    delete stock.mRealBuyValue
    delete stock.mDeleteable
    stock.cFadeOut = stock.cFadeOut ?? 0
    stock.cNotFirstPage = stock.cNotFirstPage ?? 1
    stock.cFirstPage = stock.cFirstPage ?? (stock.cNotFirstPage + 1) % 2
    stock.cQuarterDay = stock.cQuarterDay > 0 ? stock.cQuarterDay - offset() : 0
    stock.cMeetingDay = stock.cMeetingDay > 0 ? stock.cMeetingDay - offset() : 0
    const props: string[] = Object.keys(stock)
    for (let i = 0; i < props.length; i++) {
      if (!CONS.DB.STORES.SC.includes(props[i])) {
        delete stock[props[i]]
      }
    }
    return stock
  }
  const migrateTransfer = (transfer: ITransfer): ITransfer => {
    delete transfer.mCompany
    delete transfer.mSortDate
    transfer.cCount = transfer.cNumber ?? transfer.cCount ?? 0
    transfer.cAmount = transfer.cDeposit ?? transfer.cAmount ?? 0
    transfer.cTax = transfer.cTaxes ?? transfer.cTax ?? 0
    transfer.cFTax = transfer.cFTax ?? 0
    transfer.cSTax = transfer.cSTax ?? 0
    transfer.cSoli = transfer.cSoli ?? 0
    transfer.cDate = transfer.cDate > 0 ? transfer.cDate - offset() : 0
    transfer.cExDay = transfer.cExDay > 0 ? transfer.cExDay - offset() : 0
    const props = Object.keys(transfer)
    for (let i = 0; i < props.length; i++) {
      if (!CONS.DB.STORES.TC.includes(props[i])) {
        delete transfer[props[i]]
      }
    }
    return transfer
  }
  const notice = (messages: string[]): void => {
    const msg = messages.join('\n')
    const notificationOption: browser.notifications.CreateNotificationOptions =
      {
        type: 'basic',
        iconUrl: '_assets/icon16.png',
        title: 'Stockmanager',
        message: msg
      }
    browser.notifications.create(notificationOption).then(
      (): void => {
      },
      (): void => {
      }
    )
  }
  const getUI = (): Record<string, string> => {
    let code: string
    const result: Record<string, string> = {
      lang: '',
      region: '',
      locale: '',
      cur: '',
      curusd: '',
      cureur: '',
      fontSize: '0'
    }
    const uiLang: string =
      browser.i18n.getUILanguage().toLowerCase() ?? CONS.DEFAULTS.LANG
    if (uiLang.includes('-')) {
      result.lang = uiLang.split('-')[0]
      result.region = uiLang.split('-')[1].toUpperCase()
      result.locale = uiLang
      code =
        CONS.CURRENCIES.CODE.get(uiLang.split('-')[1]) ?? CONS.DEFAULTS.CURRENCY
      result.cur = code ?? CONS.DEFAULTS.CURRENCY
    } else {
      result.lang = uiLang
      result.region = uiLang.toUpperCase()
      result.locale = uiLang + '-' + uiLang.toUpperCase()
      code = CONS.CURRENCIES.CODE.get(uiLang) ?? CONS.DEFAULTS.CURRENCY
      result.cur = code ?? CONS.DEFAULTS.CURRENCY
    }
    result.cureur = result.cur + CONS.CURRENCIES.EUR
    result.curusd = result.cur + CONS.CURRENCIES.USD
    result.fontSize = window
      .getComputedStyle(document.body, null)
      .getPropertyValue('font-size')
    return result
  }
  const group = (count: number, size = 2): number[] => {
    const ar: number[] = []
    const isOdd = count % 2 === 1
    const part = Math.ceil(count / size)
    for (let i = 0; i < size; i++) {
      if (isOdd && i === size - 1) {
        ar.push(part - 1)
      } else {
        ar.push(part)
      }
    }
    return ar
  }
  // isEmptyObject: (obj: Record<string, unknown>): boolean => {
  //   let result = false
  //   if (obj === undefined || obj === null) {
  //     result = true
  //   } else if (Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype) {
  //     result = true
  //   }
  //   return result
  // },
  const offset = (): number => {
    return new Date().getTimezoneOffset() * 60000
    // - 7.200.000 we are UTC/GMT + 2
    // DB to store -offset
    // Store to DB +offset
  }
  const isoDatePlusSeconds = (iso: string | number | Date): number => {
    return new Date(iso).getTime() + (Date.now() % 86400)
  }
  const toNumber = (
    str: string | boolean | number | undefined | null
  ): number => {
    let result = 0
    if (str !== null && str !== undefined) {
      const a = str.toString().replace(/,$/g, '')
      const b = a.split(',')
      if (b.length === 2) {
        const tmp2 = a
          .trim()
          .replace(/\s|\.|\t|%/g, '')
          .replace(',', '.')
        result = Number.isNaN(Number.parseFloat(tmp2))
          ? 0
          : Number.parseFloat(tmp2)
      } else if (b.length > 2) {
        let tmp: string = ''
        for (let i = b.length - 1; i > 0; i--) {
          tmp += b[i]
        }
        const tmp2 = tmp + '.' + b[0]
        result = Number.isNaN(Number.parseFloat(tmp2))
          ? 0
          : Number.parseFloat(tmp2)
      } else {
        result = Number.isNaN(parseFloat(b[0])) ? 0 : Number.parseFloat(b[0])
      }
    }
    return result
  }
  const mean = (nar: number[]): number => {
    let sum = 0
    let len: number = nar.length
    let n: number
    for (n of nar) {
      if (n !== 0 && !Number.isNaN(n)) {
        sum += n
      } else {
        len--
      }
    }
    return len > 0 ? sum / len : 0
  }
  const dateToISO = (value: number): string => {
    return new Date(value).toISOString().substring(0, 10)
  }
  const emptyFunction = (): void => {
  }
  // toUTCMilliseconds: (datestr: string | undefined) => {
  //   const today = new Date()
  //   let datear: string[]
  //   let day: number
  //   let month: number
  //   let year: number
  //   let result: number
  //   const region = getUI().region
  //   if (typeof datestr === 'string') {
  //     if (datestr.includes('.')) {
  //       datear = datestr.split('.')
  //       year = Number.parseInt(datear[2], 10) ?? CONS.DATE.FYEAR
  //       month = Number.parseInt(datear[1], 10) ?? 1
  //       day = Number.parseInt(datear[0], 10) ?? 1
  //     } else if (datestr.includes('-')) {
  //       datear = datestr.split('-')
  //       year = Number.parseInt(datear[0], 10) ?? CONS.DATE.FYEAR
  //       month = Number.parseInt(datear[1], 10) ?? 1
  //       day = Number.parseInt(datear[2], 10) ?? 1
  //     } else if (datestr.includes('/')) {
  //       datear = datestr.split('/')
  //       year = Number.parseInt(datear[2], 10) ?? CONS.DATE.FYEAR
  //       day = Number.parseInt(datear[0], 10) ?? 1
  //       month = Number.parseInt(datear[1], 10) ?? 1
  //       if (region === 'us') {
  //         day = Number.parseInt(datear[1], 10) ?? 1
  //         month = Number.parseInt(datear[0], 10) ?? 1
  //       }
  //     } else {
  //       year = CONS.DATE.FYEAR
  //       day = 1
  //       month = 1
  //     }
  //     result = year === CONS.DATE.FYEAR ? CONS.DATE.DEFAULT : Date.UTC(year, month - 1, day, today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds())
  //   } else {
  //     result = CONS.DATE.DEFAULT
  //   }
  //   return result
  // },
  // sleep: async (ms: number): Promise<void> => {
  //   await new Promise((resolve) => setTimeout(resolve, ms))
  // },
  const initStorageLocal = async (): Promise<void> => {
    console.log('BACKGROUND: initStorageLocal')
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
  return {
    CONS,
    migrateStock,
    migrateTransfer,
    notice,
    getUI,
    group,
    isoDatePlusSeconds,
    offset,
    toNumber,
    mean,
    dateToISO,
    emptyFunction,
    initStorageLocal
  }
}