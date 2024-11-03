import { useConstants } from '@/libraries/useConstants';
export const useAppLibrary = () => {
    const CONS = useConstants();
    const migrateStock = (stock) => {
        delete stock.mPortfolio;
        delete stock.mBuyValue;
        delete stock.mValue;
        delete stock.mMin;
        delete stock.mMax;
        delete stock.mChange;
        delete stock.mEuroChange;
        delete stock.mDividendYielda;
        delete stock.mDividendYeara;
        delete stock.mDividendYieldb;
        delete stock.mDividendYearb;
        delete stock.mRealDividend;
        delete stock.mRealBuyValue;
        delete stock.mDeleteable;
        stock.cFadeOut = stock.cFadeOut ?? 0;
        stock.cNotFirstPage = stock.cNotFirstPage ?? 1;
        stock.cFirstPage = stock.cFirstPage ?? (stock.cNotFirstPage + 1) % 2;
        stock.cQuarterDay = stock.cQuarterDay > 0 ? stock.cQuarterDay - offset() : 0;
        stock.cMeetingDay = stock.cMeetingDay > 0 ? stock.cMeetingDay - offset() : 0;
        const props = Object.keys(stock);
        for (let i = 0; i < props.length; i++) {
            if (!CONS.DB.STORES.SC.includes(props[i])) {
                delete stock[props[i]];
            }
        }
        return stock;
    };
    const migrateTransfer = (transfer) => {
        delete transfer.mCompany;
        delete transfer.mSortDate;
        transfer.cCount = transfer.cNumber ?? transfer.cCount ?? 0;
        transfer.cAmount = transfer.cDeposit ?? transfer.cAmount ?? 0;
        transfer.cTax = transfer.cTaxes ?? transfer.cTax ?? 0;
        transfer.cFTax = transfer.cFTax ?? 0;
        transfer.cSTax = transfer.cSTax ?? 0;
        transfer.cSoli = transfer.cSoli ?? 0;
        transfer.cDate = transfer.cDate > 0 ? transfer.cDate - offset() : 0;
        transfer.cExDay = transfer.cExDay > 0 ? transfer.cExDay - offset() : 0;
        const props = Object.keys(transfer);
        for (let i = 0; i < props.length; i++) {
            if (!CONS.DB.STORES.TC.includes(props[i])) {
                delete transfer[props[i]];
            }
        }
        return transfer;
    };
    const notice = (messages) => {
        const msg = messages.join('\n');
        const notificationOption = {
            type: 'basic',
            iconUrl: '_assets/icon16.png',
            title: 'Stockmanager',
            message: msg
        };
        browser.notifications.create(notificationOption).then(() => {
        }, () => {
        });
    };
    const getUI = () => {
        let code;
        const result = {
            lang: '',
            region: '',
            locale: '',
            cur: '',
            curusd: '',
            cureur: '',
            fontSize: '0'
        };
        const uiLang = browser.i18n.getUILanguage().toLowerCase() ?? CONS.DEFAULTS.LANG;
        if (uiLang.includes('-')) {
            result.lang = uiLang.split('-')[0];
            result.region = uiLang.split('-')[1].toUpperCase();
            result.locale = uiLang;
            code =
                CONS.CURRENCIES.CODE.get(uiLang.split('-')[1]) ?? CONS.DEFAULTS.CURRENCY;
            result.cur = code ?? CONS.DEFAULTS.CURRENCY;
        }
        else {
            result.lang = uiLang;
            result.region = uiLang.toUpperCase();
            result.locale = uiLang + '-' + uiLang.toUpperCase();
            code = CONS.CURRENCIES.CODE.get(uiLang) ?? CONS.DEFAULTS.CURRENCY;
            result.cur = code ?? CONS.DEFAULTS.CURRENCY;
        }
        result.cureur = result.cur + CONS.CURRENCIES.EUR;
        result.curusd = result.cur + CONS.CURRENCIES.USD;
        result.fontSize = window
            .getComputedStyle(document.body, null)
            .getPropertyValue('font-size');
        return result;
    };
    const group = (count, size = 2) => {
        const ar = [];
        const isOdd = count % 2 === 1;
        const part = Math.ceil(count / size);
        for (let i = 0; i < size; i++) {
            if (isOdd && i === size - 1) {
                ar.push(part - 1);
            }
            else {
                ar.push(part);
            }
        }
        return ar;
    };
    const offset = () => {
        return new Date().getTimezoneOffset() * 60000;
    };
    const isoDatePlusSeconds = (iso) => {
        return new Date(iso).getTime() + (Date.now() % 86400);
    };
    const toNumber = (str) => {
        let result = 0;
        if (str !== null && str !== undefined) {
            const a = str.toString().replace(/,$/g, '');
            const b = a.split(',');
            if (b.length === 2) {
                const tmp2 = a
                    .trim()
                    .replace(/\s|\.|\t|%/g, '')
                    .replace(',', '.');
                result = Number.isNaN(Number.parseFloat(tmp2))
                    ? 0
                    : Number.parseFloat(tmp2);
            }
            else if (b.length > 2) {
                let tmp = '';
                for (let i = b.length - 1; i > 0; i--) {
                    tmp += b[i];
                }
                const tmp2 = tmp + '.' + b[0];
                result = Number.isNaN(Number.parseFloat(tmp2))
                    ? 0
                    : Number.parseFloat(tmp2);
            }
            else {
                result = Number.isNaN(parseFloat(b[0])) ? 0 : Number.parseFloat(b[0]);
            }
        }
        return result;
    };
    const mean = (nar) => {
        let sum = 0;
        let len = nar.length;
        let n;
        for (n of nar) {
            if (n !== 0 && !Number.isNaN(n)) {
                sum += n;
            }
            else {
                len--;
            }
        }
        return len > 0 ? sum / len : 0;
    };
    const dateToISO = (value) => {
        return new Date(value).toISOString().substring(0, 10);
    };
    const emptyFunction = () => {
    };
    const initStorageLocal = async () => {
        console.log('BACKGROUND: initStorageLocal');
        const storageLocal = await browser.storage.local.get();
        if (storageLocal.service === undefined) {
            await browser.storage.local.set({
                service: CONS.DEFAULTS.STORAGE.service
            });
        }
        if (storageLocal.skin === undefined) {
            await browser.storage.local.set({ skin: CONS.DEFAULTS.STORAGE.skin });
        }
        if (storageLocal.indexes === undefined) {
            await browser.storage.local.set({
                indexes: CONS.DEFAULTS.STORAGE.indexes
            });
        }
        if (storageLocal.materials === undefined) {
            await browser.storage.local.set({
                materials: CONS.DEFAULTS.STORAGE.materials
            });
        }
        if (storageLocal.markets === undefined) {
            await browser.storage.local.set({
                markets: CONS.DEFAULTS.STORAGE.markets
            });
        }
        if (storageLocal.exchanges === undefined) {
            await browser.storage.local.set({
                exchanges: CONS.DEFAULTS.STORAGE.exchanges
            });
        }
        if (storageLocal.partner === undefined) {
            await browser.storage.local.set({
                partner: CONS.DEFAULTS.STORAGE.partner
            });
        }
        if (storageLocal.items_per_page_stocks === undefined) {
            await browser.storage.local.set({
                items_per_page_stocks: CONS.DEFAULTS.STORAGE.items_per_page_stocks
            });
        }
        if (storageLocal.items_per_page_transfers === undefined) {
            await browser.storage.local.set({
                items_per_page_transfers: CONS.DEFAULTS.STORAGE.items_per_page_transfers
            });
        }
    };
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
    };
};
