export const useApp = () => {
    const CONS = Object.freeze({
        CURRENCIES: {
            EUR: 'EUR',
            USD: 'USD',
            CODE: new Map([
                ['ar', 'ARS'],
                ['at', 'EUR'],
                ['au', 'AUD'],
                ['be', 'EUR'],
                ['bg', 'BGN'],
                ['bo', 'BOB'],
                ['br', 'BRL'],
                ['bz', 'BZD'],
                ['ca', 'CAD'],
                ['ch', 'CHF'],
                ['cl', 'CLP'],
                ['chs', 'CNY'],
                ['cht', 'CNY'],
                ['co', 'COU'],
                ['cr', 'CRC'],
                ['cs', 'CZK'],
                ['cy', 'EUR'],
                ['da', 'DKK'],
                ['de', 'EUR'],
                ['do', 'DOP'],
                ['ec', 'USD'],
                ['ee', 'EUR'],
                ['el', 'EUR'],
                ['es', 'EUR'],
                ['et', 'EUR'],
                ['fi', 'EUR'],
                ['fr', 'EUR'],
                ['gb', 'GBP'],
                ['gr', 'EUR'],
                ['gt', 'GTQ'],
                ['hk', 'HKD'],
                ['hn', 'HNL'],
                ['hu', 'HUF'],
                ['ie', 'EUR'],
                ['in', 'INR'],
                ['is', 'ISK'],
                ['it', 'EUR'],
                ['ja', 'JPY'],
                ['jm', 'JMD'],
                ['ko', 'KRW'],
                ['li', 'EUR'],
                ['lt', 'EUR'],
                ['lu', 'EUR'],
                ['mc', 'EUR'],
                ['mo', 'MOP'],
                ['mt', 'EUR'],
                ['mx', 'MXN'],
                ['ni', 'NIO'],
                ['nl', 'EUR'],
                ['no', 'NOK'],
                ['nz', 'NZD'],
                ['pa', 'PAB'],
                ['pe', 'PEN'],
                ['ph', 'PHP'],
                ['pl', 'PLN'],
                ['pr', 'USD'],
                ['pt', 'EUR'],
                ['py', 'PYG'],
                ['ro', 'RON'],
                ['ru', 'RUB'],
                ['se', 'SEK'],
                ['sg', 'SGD'],
                ['sk', 'EUR'],
                ['sl', 'EUR'],
                ['sp', 'RSD'],
                ['sv', 'USD'],
                ['tr', 'TRY'],
                ['tt', 'TTD'],
                ['tw', 'TWD'],
                ['uy', 'UYU'],
                ['ve', 'VES'],
                ['za', 'ZAR'],
                ['zw', 'ZWD']
            ])
        },
        DATE: {
            DEFAULT: 0,
            DEFAULTSTR: '1.1.1970',
            FYEAR: 1970,
            MILLIPERDAY: 86400000,
            MILLIPERMIN: 60000
        },
        DB: {
            BKFN: 'stockmanager.json',
            NAME: 'stockmanager.db',
            RECORD_TYPES: {
                BUY: 1,
                CUR: 8,
                DIV: 3,
                DEPOSIT: 4,
                WITHDRAWAL: 5,
                SELL: 2,
                PER: 7,
                UNDEFINED: -1
            },
            STORES: {
                S: 'stocks',
                SC: [
                    'cID',
                    'cCompany',
                    'cISIN',
                    'cWKN',
                    'cSym',
                    'cQuarterDay',
                    'cMeetingDay',
                    'cFadeOut',
                    'cFirstPage',
                    'cURL'
                ],
                T: 'transfers',
                TC: [
                    'cID',
                    'cStockID',
                    'cDate',
                    'cUnitQuotation',
                    'cAmount',
                    'cCount',
                    'cFees',
                    'cTax',
                    'cSTax',
                    'cFTax',
                    'cSoli',
                    'cMarketPlace',
                    'cType',
                    'cExDay',
                    'cDescription'
                ]
            },
            VERSION: 25,
            MINVERSION: 21
        },
        DEFAULTS: {
            CURRENCY: 'EUR',
            LANG: 'de',
            YEAR: 9999,
            STORAGE: {
                sService: { name: 'fnet', url: 'https://www.finanzen.net/aktienkurse/' },
                sSkin: 'ocean',
                sIndexes: ['dax', 'dow'],
                sMaterials: ['au', 'brent'],
                sMarkets: ['Frankfurt', 'XETRA'],
                sExchanges: ['EURUSD'],
                sPartner: false,
                sItemsPerPageStocks: 9,
                sItemsPerPageTransfers: 9
            },
            DRAWER_KEYS: [
                'winloss',
                'earnings',
                'deposits',
                'dividends',
                'withdrawals',
                'fees',
                'taxes',
                'account',
                'depot'
            ],
            DRAWER_CONTROLS: [
                {
                    id: 0,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 1,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 2,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 3,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 4,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 5,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 6,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 7,
                    title: '',
                    value: '0',
                    class: ''
                },
                {
                    id: 8,
                    title: '',
                    value: '0',
                    class: ''
                }
            ]
        },
        DIALOGS: {
            ADDCOMPANY: 'addcompany',
            FADEINSTOCK: 'fadeinstock',
            ADDDEPOSIT: 'adddeposit',
            ADDWITHDRAWAL: 'addwithdrawal',
            DAILYCHANGES: 'dailychanges',
            DAILYCHANGESALL: 'dailychangesall',
            EXPORTDB: 'exportdb',
            IMPORTDB: 'importdb',
            SHOWACCOUNTING: 'showaccouting',
            DELETETRANSFER: 'deletetransfer',
            UPDATETRANSFER: 'updatetransfer',
            DELETESTOCK: 'deletestock',
            BUYSTOCK: 'buystock',
            SELLSTOCK: 'sellstock',
            ADDDIVIDEND: 'adddividend',
            SHOWDIVIDEND: 'showdividend',
            CONFIGSTOCK: 'configstock'
        },
        EVENTS: {
            ABORT: 'abort',
            BEFOREUNLOAD: 'beforeunload',
            CHANGE: 'change',
            CLICK: 'click',
            COMP: 'complete',
            DOM: 'DOMContentLoaded',
            ERR: 'error',
            INP: 'input',
            KEYDOWN: 'keydown',
            LOAD: 'load',
            FOCUS: 'focus',
            BLUR: 'blur',
            SUC: 'success',
            UPG: 'upgradeneeded',
            VERSIONCHANGE: 'versionchange'
        },
        FETCH_API: {
            ASK__DAILY_CHANGES: 'dc',
            ASK__DAILY_CHANGES_ALL: 'dca',
            ASK__DATES_DATA: 'add',
            ASK__INDEX_DATA: 'aid',
            ASK__MATERIAL_DATA: 'amd',
            ASK__MIN_RATE_MAX: 'mrm',
            ASK__COMPANY_DATA: 'cd',
            ASK__EXCHANGES_DATA: 'aed',
            ASK__EXCHANGES_BASE_DATA: 'aebd',
            ASK__SETTINGS: 'as',
            ANSWER__SETTINGS: '_as',
            ANSWER__DAILY_CHANGES: '_dc',
            ANSWER__DAILY_CHANGES_ALL: '_dca',
            ANSWER__DATES_DATA: '_add',
            ANSWER__INDEX_DATA: '_aid',
            ANSWER__MATERIAL_DATA: '_amd',
            ANSWER__MIN_RATE_MAX: '_mrm',
            ANSWER__COMPANY_DATA: '_cd',
            ANSWER__EXCHANGES_DATA: '_aed',
            ANSWER__EXCHANGES_BASE_DATA: '_aebd',
            END__DAILY_CHANGES: 'edc',
            END__DAILY_CHANGES_ALL: 'edca',
            FINISH__DAILY_CHANGES: '_fdc',
            FINISH__DAILY_CHANGES_ALL: '_fdca'
        },
        MESSAGES: {
            SET__SETTINGS_SKIN: 'sss',
            SET__SETTINGS_SERVICE: 'sssrv',
            SET__SETTINGS_MARKETS: 'ssm',
            SET__SETTINGS_MATERIALS: 'ssmat',
            SET__SETTINGS_EXCHANGES: 'sse',
            SET__SETTINGS_INDEXES: 'ssi'
        },
        SETTINGS: {
            MP: '__MP__',
            EX: '__EX__',
            INDEXES: {
                dax: 'DAX',
                dow: 'Dow Jones',
                nasdaq: 'NASDAQ Comp.',
                nikkei: 'NIKKEI 225',
                hang: 'Hang Seng',
                ibex: 'IBEX 35',
                straits: 'Straits Times',
                asx: 'Australia All Ordinaries',
                rts: 'RTS',
                bovespa: 'BOVESPA',
                sensex: 'SENSEX',
                sci: 'Shanghai Composite',
                ftse: 'FTSE 100',
                smi: 'SMI',
                cac: 'CAC 40',
                stoxx: 'Euro Stoxx 50',
                tsx: 'S&P/TSX',
                sp: 'S&P 500'
            },
            MATERIALS: new Map([
                ['Goldpreis', 'au'],
                ['Silberpreis', 'ag'],
                ['Ölpreis (Brent)', 'brent'],
                ['Ölpreis (WTI)', 'wti'],
                ['Kupferpreis', 'cu'],
                ['Platinpreis', 'pt'],
                ['Aluminiumpreis', 'al'],
                ['Nickelpreis', 'ni'],
                ['Zinnpreis', 'sn'],
                ['Bleipreis', 'pb'],
                ['Palladiumpreis', 'pd']
            ]),
            ITEMS_PER_PAGE_OPTIONS: [
                {
                    value: 5,
                    title: '5'
                },
                {
                    value: 7,
                    title: '7'
                },
                {
                    value: 9,
                    title: '9'
                },
                {
                    value: 11,
                    title: '11'
                }
            ]
        },
        PERMISSIONS: {
            origins: [
                'https://www.tradegate.de/*',
                'https://www.goyax.de/*',
                'https://*.finanzen.net/*',
                'https://www.wallstreet-online.de/*',
                'https://*.aktiencheck.de/*',
                'https://www.tagesschau.de/*',
                'https://fx-rate.net/*'
            ]
        },
        RESOURCES: {
            SRC: '_assets',
            OK: 'ok.png',
            OKD: 'ok-dark.png',
            CANCEL: 'cancel.png',
            CANCELD: 'cancel-dark.png',
            ICON32: 'icon32.png',
            LOGO16: 'logo16.png',
            LOGO256: 'logo256.png',
            MAG: 'magnifier.png',
            CALENDAR: 'calendar.png',
            RENEW: 'renew.png',
            FIRST: 'first.png',
            NEXT: 'next.png',
            PREV: 'previous.png',
            LAST: 'last.png',
            CB: 'home.png',
            UP: 'update.png',
            NS: 'addStock.png',
            DS: 'deletestock.png',
            FI: 'fadein.png',
            IT: 'intransfer.png',
            OT: 'outtransfer.png',
            CHS: 'changes.png',
            CHB: 'allchanges.png',
            BK: 'backup.png',
            RE: 'restore.png',
            OB: 'orderbook.png',
            TB: 'transferbook.png',
            PY: 'peryear.png',
            CO: 'clean.png',
            SE: 'settings.png',
            RESET: 'reset.png',
            ADD: 'add.png',
            CHANGE: 'change.png',
            DEL: 'delete.png',
            NO: 'neworder.png',
            BUY: 'buy.png',
            SELL: 'sell.png',
            ND: 'newdividend.png',
            SD: 'showdividends.png',
            CONF: 'config.png',
            HTTP: 'http.png',
            HELP: 'help.json',
            PRIVACY: 'privacy.json',
            LICENSE: 'license.html',
            INDEX: 'app.html',
            ROOT: '/'
        },
        SERVICES: {
            goyax: {
                NAME: 'Goyax',
                HOME: 'https://www.goyax.de/',
                QUOTE: 'https://www.goyax.de/aktien/',
                DELAY: 50
            },
            fnet: {
                NAME: 'Finanzen.Net',
                HOME: 'https://www.finanzen.net/aktienkurse/',
                INDEXES: 'https://www.finanzen.net/indizes/',
                QUOTE: 'https://www.finanzen.net/suchergebnis.asp?_search=',
                DATES: 'https://www.finanzen.net/termine/',
                MATERIALS: 'https://www.finanzen.net/rohstoffe/',
                GM: 'Hauptversammlung',
                QF: 'Quartalszahlen',
                DELAY: 750
            },
            wstreet: {
                NAME: 'Wallstreet-Online',
                HOME: 'https://www.wallstreet-online.de',
                QUOTE: 'https://www.wallstreet-online.de/_rpc/json/search/auto/searchInst/',
                DELAY: 50
            },
            acheck: {
                NAME: 'Aktien Check',
                HOME: 'https://m.aktiencheck.de/',
                QUOTE: 'https://m.aktiencheck.de/quotes/suche/?search=',
                DELAY: 50
            },
            ard: {
                NAME: 'ARD',
                HOME: 'https://www.tagesschau.de/wirtschaft/boersenkurse/',
                QUOTE: 'https://www.tagesschau.de/wirtschaft/boersenkurse/suche/?suchbegriff=',
                DELAY: 50
            },
            fx: {
                NAME: 'fx-rate',
                HOME: 'https://fx-rate.net/qwsaq',
                EXCHANGE: 'https://fx-rate.net/calculator/?c_input=',
                DELAY: 50
            },
            tgate: {
                NAME: 'Tradegate',
                HOME: 'https://www.tradegate.de/',
                QUOTE: 'https://www.tradegate.de/orderbuch.php?isin=',
                CHSURL: 'https://www.tradegate.de/indizes.php?index=',
                CHBURL: 'https://www.tradegate.de/indizes.php?buchstabe=',
                CHS: [
                    'DE000A1EXRV0',
                    'DE000A1EXRY4',
                    'DE000A1EXRW8',
                    'DE000A1EXRX6',
                    'EU0009658145',
                    'DE000A0SNK21',
                    'US0000000002'
                ],
                CHB: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '7',
                    '8',
                    '9',
                    'A',
                    'B',
                    'C',
                    'D',
                    'E',
                    'F',
                    'G',
                    'H',
                    'I',
                    'J',
                    'K',
                    'L',
                    'M',
                    'N',
                    'O',
                    'P',
                    'Q',
                    'R',
                    'S',
                    'T',
                    'U',
                    'V',
                    'W',
                    'X',
                    'Y',
                    'Z',
                    'Ö'
                ],
                CHANGES: {
                    SMALL: 1,
                    BIG: 2,
                    STEP: 8,
                    NAME: 2,
                    VALUE: 7
                },
                DELAY: 50
            }
        },
        STATES: {
            DONE: 'complete',
            SRV: 500,
            SUCCESS: 200,
            PAUSE: 'resting',
            MUTATE: 'mutation',
            NORENDER: 'norender'
        },
        SYSTEM: {
            COPYRIGHT: '2013-2025 Martin Berner',
            FETCHTO: 20,
            DELAY: 600,
            EMAIL: 'mailto:stockmanager@gmx.de',
            GET: 'GET',
            HTMLENTITY: '(&auml;|&Auml;|&ouml;|&Ouml;|&uuml;|&Uuml;|&amp;|&eacute;|&Eacute;|&ecirc;|&Ecirc;|&oacute;|&Oacute;|&aelig;|&Aelig;)',
            ISINLENGTH: 12,
            KEYS: {
                ENTER: 'Enter',
                TAB: 'Tab',
                T: 'T',
                V: 'V',
                Z: 'Z'
            },
            ERRORS: {
                CURR: 'Missing current record!',
                ERR: 'System error!',
                INVALID: 'Invalid Range!',
                NOCASE: 'Missing case!',
                NODEL: 'Deletion off memory failed!',
                REQ: 'Request failed!',
                SRV: 'Remote Server error!',
                WRONGPARAM: 'Wrong parameter!',
                SEND: 'Send message failed!'
            },
            NULL: 0.00001,
            PERCENT: 100,
            PROGRESSBAR: { MAX: 400 },
            ROWS: 10,
            STARTUP: 2,
            STORAGE_OLD: [
                'resetconfig',
                'config',
                'reset',
                'itemsPerPage',
                'cb',
                'tb'
            ],
            TYPE: 599,
            ONCE: { once: true }
        },
        RECORDS: {
            TEMPLATES: {
                STOCK: {
                    cID: 0,
                    cCompany: '',
                    cISIN: '',
                    cWKN: '',
                    cSym: '',
                    cFirstPage: 0,
                    cFadeOut: 0,
                    cQuarterDay: 0,
                    cMeetingDay: 0,
                    cURL: '',
                    mPortfolio: 0,
                    mBuyValue: 0,
                    mValue: 0,
                    mMin: 0,
                    mMax: 0,
                    mChange: 0,
                    mEuroChange: 0,
                    mDividendYielda: 0,
                    mDividendYeara: 0,
                    mDividendYieldb: 0,
                    mDividendYearb: 0,
                    mRealDividend: 0,
                    mRealBuyValue: 0,
                    mDeleteable: true
                },
                MSTOCK: {
                    mPortfolio: 0,
                    mBuyValue: 0,
                    mValue: 0,
                    mMin: 0,
                    mMax: 0,
                    mChange: 0,
                    mEuroChange: 0,
                    mDividendYielda: 0,
                    mDividendYeara: 0,
                    mDividendYieldb: 0,
                    mDividendYearb: 0,
                    mRealDividend: 0,
                    mRealBuyValue: 0,
                    mDeleteable: true,
                    mAskDates: true
                },
                TRANSFER: {
                    cID: 0,
                    cDate: 0,
                    cExDay: 0,
                    cCount: 0,
                    cUnitQuotation: 0,
                    cStockID: 0,
                    cAmount: 0,
                    cFees: 0,
                    cSTax: 0,
                    cFTax: 0,
                    cTax: 0,
                    cSoli: 0,
                    cType: 0,
                    cMarketPlace: '',
                    cDescription: '',
                    mCompany: '',
                    mSortDate: 0
                }
            },
            TYPES: {
                TRANSFER: 11,
                FEE: 12,
                STAX: 13,
                FTAX: 14,
                TAX: 15,
                SOLI: 16
            },
            CONTROLLER: {
                TOTAL: {
                    efficiency: 0,
                    returnRate: 0,
                    buy: 0,
                    sell: 0,
                    dividends: 0,
                    deposits: 0,
                    withdrawals: 0,
                    taxes: 0,
                    fees: 0,
                    earnings: 0,
                    account: 0,
                    depot: 0,
                    winloss: 0,
                    winlossPercent: 0,
                    depotBuyValue: 0
                }
            }
        }
    });
    const offset = () => {
        return new Date().getTimezoneOffset() * 60000;
    };
    return {
        CONS,
        validators: {
            dottedPositiveNumber2: (vstr) => {
                const found = vstr.match(/^0$|^[0-9]\d*(\.?\d{1,2})$/g);
                return found !== null ? true : 'A dot formatted positive number is required.';
            },
            dottedPositiveNumber5: (vstr) => {
                const found = vstr.match(/^0$|^[0-9]\d*(\.?\d{1,5})$/g);
                return found !== null ? true : 'A dot formatted positive number is required.';
            },
            integer: (v) => {
                if (v === null || v === undefined) {
                    return 'Input is required.';
                }
                else {
                    const found = v.match(/^(-?[1-9]\d*|0)$/g);
                    return found !== null ? true : 'Input is required.';
                }
            },
            positiveInteger: (v) => {
                if (v === null || v === undefined) {
                    return 'Input is required.';
                }
                else {
                    const found = v.match(/^[1-9][0-9]*$/g);
                    return found !== null ? true : 'Input is required.';
                }
            },
            isin: (v) => {
                if (v === null || v === undefined) {
                    return 'Input is required.';
                }
                else {
                    const found = v.match(/^[a-zA-Z]{2}[a-zA-Z0-9]{10}$/g);
                    return found !== null ? true : 'Input is required.';
                }
            },
            wkn: (v) => {
                const found = v.match(/^[a-hj-np-zA-HJ-NP-Z0-9]{6}$/g);
                return found !== null ? true : 'Length 6 is required. I,O are not allowed.';
            },
            url: (v) => {
                const found = v.match(/^[htps]{4,5}:\/\/\S*$/g);
                return found !== null ? true : 'Input is required.';
            },
            isoDate: (v) => {
                if (v === null || v === undefined) {
                    return 'Input is required.';
                }
                else {
                    const found = v.match(/^([1-2])?[0-9]{3}-(1[0-2]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])$/g);
                    return found !== null ? true : 'Input is required.';
                }
            },
            notEmpty: (v) => {
                const found = v.length;
                return found > 0 ? true : 'Input is required.';
            },
            positiveNumber: (v) => {
                const found = Number.parseFloat(v);
                return found > 0 ? true : 'Input is required.';
            },
            positiveCurrency: (v) => {
                return v > 0 ? true : 'Input is required.';
            },
            negativeNumber: (v) => {
                const found = Number.parseFloat(v);
                return found < 0 ? true : 'Input is required.';
            }
        },
        appPort: () => {
            return browser.runtime.connect();
        },
        migrateStock: (stock) => {
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
            delete stock.mAskDates;
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
        },
        migrateTransfer: (transfer) => {
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
            transfer.cType = transfer.cCount < 0 ? 2 : transfer.cType;
            const props = Object.keys(transfer);
            for (let i = 0; i < props.length; i++) {
                if (!CONS.DB.STORES.TC.includes(props[i])) {
                    delete transfer[props[i]];
                }
            }
            return transfer;
        },
        notice: async (messages) => {
            const msg = messages.join('\n');
            const notificationOption = {
                type: 'basic',
                iconUrl: '_assets/icon16.png',
                title: 'Stockmanager',
                message: msg
            };
            await browser.notifications.create(notificationOption);
        },
        getUI: () => {
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
        },
        group: (count, size = 2) => {
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
        },
        offset,
        isoDatePlusSeconds: (iso) => {
            return new Date(iso).getTime() + (Date.now() % 86400);
        },
        toNumber: (str) => {
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
        },
        mean: (nar) => {
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
        },
        dateToISO: (value) => {
            return new Date(value).toISOString().substring(0, 10);
        },
        emptyFunction: () => {
        }
    };
};
const { CONS } = useApp();
const appUrls = { url: browser.runtime.getURL(CONS.RESOURCES.INDEX) + '*' };
const onClick = async () => {
    console.log('BACKGROUND: onClick');
    const { notice } = useApp();
    const start = async () => {
        console.log('BACKGROUND: onClick: start');
        const textDetailOn = { text: 'on' };
        const colorDetailGreen = { color: '#008000' };
        const textDetailOff = { text: 'off' };
        const colorDetailRed = { color: '#ff0000' };
        const dataUrls = [];
        const serviceKeys = Object.keys(CONS.SERVICES);
        const foundTabs = await browser.tabs.query(appUrls);
        for (let i = 0; i < serviceKeys.length; i++) {
            dataUrls.push(CONS.SERVICES[serviceKeys[i]].HOME);
        }
        dataUrls.map(async (url) => {
            const resp = await fetch(url);
            if (resp.ok) {
                await browser.action.setBadgeText(textDetailOn);
                await browser.action.setBadgeBackgroundColor(colorDetailGreen);
            }
            else {
                console.error('No connection to ' + url);
                await browser.action.setBadgeText(textDetailOff);
                await browser.action.setBadgeBackgroundColor(colorDetailRed);
            }
        });
        if (foundTabs.length === 0) {
            const extensionTab = await browser.tabs.create({
                url: browser.runtime.getURL(CONS.RESOURCES.INDEX),
                active: true
            });
            const extensionTabIdStr = (extensionTab.id ?? -1).toString();
            sessionStorage.setItem('sExtensionTabId', extensionTabIdStr);
        }
        else {
            await browser.windows.update(foundTabs[0].windowId ?? 0, {
                focused: true
            });
            await browser.tabs.update(foundTabs[0].id ?? 0, { active: true });
        }
    };
    const permit = await browser.permissions.request(CONS.PERMISSIONS);
    if (!permit) {
        console.warn('BACKGROUND: onClick: missing permission');
        notice(['Some online data might not be available!']);
    }
    await start();
};
const onRemove = (permissions) => {
    console.warn('BACKGROUND: onRemove');
    const { notice } = useApp();
    notice(['Online data might not be available.', JSON.stringify(permissions)]);
};
const onInstall = () => {
    console.log('BACKGROUND: onInstall');
    const { migrateStock, migrateTransfer } = useApp();
    const onSuccess = (ev) => {
        console.log('BACKGROUND: onInstall: onSuccess');
        ev.target.result.close();
    };
    const onError = (err) => {
        console.error('BACKGROUND: onError: ', err.message);
    };
    const onUpgradeNeeded = async (ev) => {
        console.log('BACKGROUND: onInstall: onUpgradeNeeded');
        const defaultStorageLocal = async () => {
            console.log('BACKGROUND: initStorageLocal');
            const { CONS } = useApp();
            const storageLocal = await browser.storage.local.get();
            if (storageLocal['sService'] === undefined) {
                await browser.storage.local.set({
                    sService: CONS.DEFAULTS.STORAGE['sService']
                });
            }
            if (storageLocal.skin === undefined) {
                await browser.storage.local.set({
                    sSkin: CONS.DEFAULTS.STORAGE['sSkin']
                });
            }
            if (storageLocal.indexes === undefined) {
                await browser.storage.local.set({
                    sIndexes: CONS.DEFAULTS.STORAGE['sIndexes']
                });
            }
            if (storageLocal.materials === undefined) {
                await browser.storage.local.set({
                    sMaterials: CONS.DEFAULTS.STORAGE['sMaterials']
                });
            }
            if (storageLocal.markets === undefined) {
                await browser.storage.local.set({
                    sMarkets: CONS.DEFAULTS.STORAGE['sMarkets']
                });
            }
            if (storageLocal.exchanges === undefined) {
                await browser.storage.local.set({
                    sExchanges: CONS.DEFAULTS.STORAGE['sExchanges']
                });
            }
            if (storageLocal.partner === undefined) {
                await browser.storage.local.set({
                    sPartner: CONS.DEFAULTS.STORAGE['sPartner']
                });
            }
            if (storageLocal.items_per_page_stocks === undefined) {
                await browser.storage.local.set({
                    sItemsPerPageStocks: CONS.DEFAULTS.STORAGE['sItemsPerPageStocks']
                });
            }
            if (storageLocal.items_per_page_transfers === undefined) {
                await browser.storage.local.set({
                    sItemsPerPageTransfers: CONS.DEFAULTS.STORAGE['sItemsPerPageTransfers']
                });
            }
        };
        const createDB = () => {
            console.log('BACKGROUND: onInstall: onUpgradeNeeded: fCreateDB');
            const optAuto = {
                keyPath: 'cID',
                autoIncrement: true
            };
            const optTrue = { unique: true };
            const optFalse = { unique: false };
            const requestCreateTStore = dbOpenRequest.result.createObjectStore(CONS.DB.STORES.T, optAuto);
            const requestCreateSStore = dbOpenRequest.result.createObjectStore(CONS.DB.STORES.S, optAuto);
            requestCreateSStore.createIndex('stocks_uk1', 'cISIN', optTrue);
            requestCreateSStore.createIndex('stocks_uk2', 'cSym', optTrue);
            requestCreateSStore.createIndex('stocks_k1', 'cFirstPage', optFalse);
            requestCreateSStore.createIndex('stocks_k2', 'cFadeOut', optFalse);
            requestCreateTStore.createIndex('transfers_k1', 'cDate', optFalse);
            requestCreateTStore.createIndex('transfers_k2', 'cType', optFalse);
            requestCreateTStore.createIndex('transfers_k3', 'cStockID', optFalse);
        };
        const updateDB = () => {
            console.log('BACKGROUND: onInstall: onUpgradeNeeded: fUpdateDB');
            const optFalse = { unique: false };
            const onSuccessStocks = (ev) => {
                console.log('BACKGROUND: onInstall: onUpgradeNeeded: fCreateDB: onSuccessStocks');
                const cursor = ev.target.result;
                if (cursor !== null) {
                    const stock = cursor.value;
                    cursor.update(migrateStock({ ...stock }));
                    cursor.continue();
                }
                else {
                    stocksOpenCursorRequest?.removeEventListener(CONS.EVENTS.SUC, onSuccessStocks, false);
                    const onSuccessTransfers = (ev) => {
                        console.log('BACKGROUND: onUpgradeNeeded: fCreateDB: onSuccessTransfers');
                        const cursor = ev.target.result;
                        if (cursor !== null) {
                            const transfer = cursor.value;
                            cursor.update(migrateTransfer({ ...transfer }));
                            cursor.continue();
                        }
                        else {
                            stocksOpenCursorRequest?.removeEventListener(CONS.EVENTS.SUC, onSuccessTransfers, false);
                        }
                    };
                    if (dbOpenRequest?.transaction === null) {
                        console.error('BACKGROUND: open database error');
                    }
                    else if (!dbOpenRequest.transaction
                        ?.objectStore(CONS.DB.STORES.S)
                        .indexNames.contains('stocks_k2')) {
                        dbOpenRequest.transaction
                            ?.objectStore(CONS.DB.STORES.S)
                            .createIndex('stocks_k2', 'cFadeOut', optFalse);
                    }
                    const requestTransfersOpenCursor = dbOpenRequest.transaction?.objectStore(CONS.DB.STORES.T).openCursor();
                    requestTransfersOpenCursor?.addEventListener(CONS.EVENTS.SUC, onSuccessTransfers, false);
                }
            };
            const onErrorStocks = (err) => {
                stocksOpenCursorRequest?.removeEventListener(CONS.EVENTS.ERR, onError, false);
                console.error(err.message);
            };
            const stocksOpenCursorRequest = dbOpenRequest?.transaction?.objectStore(CONS.DB.STORES.S).openCursor();
            stocksOpenCursorRequest?.addEventListener(CONS.EVENTS.ERR, onErrorStocks, false);
            stocksOpenCursorRequest?.addEventListener(CONS.EVENTS.SUC, onSuccessStocks, false);
            for (let i = 0; i < dbOpenRequest.result.objectStoreNames.length; i++) {
                if (dbOpenRequest.result.objectStoreNames[i] !== CONS.DB.STORES.S &&
                    dbOpenRequest.result.objectStoreNames[i] !== CONS.DB.STORES.T) {
                    dbOpenRequest.result.deleteObjectStore(dbOpenRequest.result.objectStoreNames[i]);
                }
            }
        };
        if (ev.oldVersion === 0) {
            createDB();
        }
        else {
            updateDB();
            await browser.storage.local
                .remove(CONS.SYSTEM.STORAGE_OLD);
        }
        await defaultStorageLocal();
    };
    const dbOpenRequest = indexedDB.open(CONS.DB.NAME, CONS.DB.VERSION);
    dbOpenRequest.addEventListener(CONS.EVENTS.ERR, onError, CONS.SYSTEM.ONCE);
    dbOpenRequest.addEventListener(CONS.EVENTS.SUC, onSuccess, CONS.SYSTEM.ONCE);
    dbOpenRequest.addEventListener(CONS.EVENTS.UPG, onUpgradeNeeded, CONS.SYSTEM.ONCE);
};
const onAppMessage = async (msg) => {
    console.info('BACKGROUND: onMessage', msg);
    const request = JSON.parse(msg.toString());
    const { mean, notice, toNumber } = useApp();
    const fetchMinRateMaxData = async (storageOnline) => {
        console.log('BACKGROUND: fetchMinRateMaxData');
        const storageService = await browser.storage.local.get('sService');
        const serviceName = storageService['sService'].name;
        const _fnet = async (urls) => {
            return await Promise.all(urls.map(async (urlObj) => {
                const firstResponse = await fetch(urlObj.url);
                const secondResponse = await fetch(firstResponse.url);
                const secondResponseText = await secondResponse.text();
                const onlineDocument = new DOMParser().parseFromString(secondResponseText, 'text/html');
                const onlineNodes = onlineDocument.querySelectorAll('#snapshot-value-fst-current-0 > span');
                const onlineArticleNodes = onlineDocument.querySelectorAll('main div[class=accordion__content]');
                let onlineMin = '0';
                let onlineMax = '0';
                let onlineCurrency = 'EUR';
                let onlineRate = '0';
                if (onlineArticleNodes.length > 0) {
                    const onlineMmNodes = onlineArticleNodes[0].querySelectorAll('table > tbody > tr');
                    for (let i = 0; i < onlineMmNodes.length; i++) {
                        if (onlineMmNodes[i].textContent?.includes('1 Jahr')) {
                            const tr = onlineMmNodes[i].querySelectorAll('td');
                            onlineMin =
                                tr[3].textContent ?? '0';
                            onlineMax =
                                tr[4].textContent ?? '0';
                        }
                    }
                }
                if (onlineNodes.length > 1) {
                    onlineCurrency = onlineNodes[1].textContent ?? '';
                    onlineRate = onlineNodes[0].textContent ?? '';
                }
                return {
                    id: urlObj.ident,
                    isin: '',
                    rate: onlineRate,
                    min: onlineMin,
                    max: onlineMax,
                    cur: onlineCurrency
                };
            }));
        };
        const _ard = async (urls) => {
            return await Promise.all(urls.map(async (urlObj) => {
                const firstResponse = await fetch(urlObj.url);
                const firstResponseText = await firstResponse.text();
                const firstResponseDocument = new DOMParser().parseFromString(firstResponseText, 'text/html');
                const firstResponseRows = firstResponseDocument.querySelectorAll('#desktopSearchResult > table > tbody > tr');
                if (firstResponseRows.length > 0) {
                    const url = firstResponseRows[0].getAttribute('onclick') ?? '';
                    const secondResponse = await fetch(url.replace('document.location=\'', '').replace('\';', ''));
                    const secondResponseText = await secondResponse.text();
                    const onlineDocument = new DOMParser().parseFromString(secondResponseText, 'text/html');
                    const onlineCurrency = 'EUR';
                    const ardRows = onlineDocument.querySelectorAll('#USFkursdaten table > tbody tr');
                    const onlineRate = (ardRows[0].cells[1].textContent ?? '0').replace('€', '');
                    const onlineMin = (ardRows[6].cells[1].textContent ?? '0').replace('€', '');
                    const onlineMax = (ardRows[7].cells[1].textContent ?? '0').replace('€', '');
                    return {
                        id: urlObj.ident,
                        isin: '',
                        rate: onlineRate,
                        min: onlineMin,
                        max: onlineMax,
                        cur: onlineCurrency
                    };
                }
                else {
                    return {
                        id: urlObj.ident,
                        isin: '',
                        rate: '0',
                        min: '0',
                        max: '0',
                        cur: 'EUR'
                    };
                }
            }));
        };
        const _wstreet = async (urls, homeUrl) => {
            return await Promise.all(urls.map(async (urlObj) => {
                const firstResponse = await fetch(urlObj.url);
                const firstResponseJson = await firstResponse.json();
                const url2 = homeUrl + firstResponseJson.result[0].link;
                const secondResponse = await fetch(url2);
                const secondResponseText = await secondResponse.text();
                const onlineDocument = new DOMParser().parseFromString(secondResponseText, 'text/html');
                const onlineRates = onlineDocument.querySelectorAll('div.c2 table');
                const onlineMinMax = onlineDocument.querySelectorAll('div.fundamental > div > div.float-start');
                let onlineCurrency = '';
                const onlineRate = onlineRates[0]
                    ?.querySelectorAll('tr')[1]
                    ?.querySelectorAll('td')[1].textContent ?? '0';
                const onlineMax = onlineMinMax[1].textContent?.split('Hoch')[1];
                const onlineMin = onlineMinMax[1].textContent?.split('Hoch')[0].split('WochenTief')[1];
                if (onlineRate.includes('USD')) {
                    onlineCurrency = 'USD';
                }
                else if (onlineRate.includes('EUR')) {
                    onlineCurrency = 'EUR';
                }
                return {
                    id: urlObj.ident ?? 0,
                    isin: '',
                    rate: onlineRate,
                    min: onlineMin,
                    max: onlineMax,
                    cur: onlineCurrency
                };
            }));
        };
        const _goyax = async (urls) => {
            return await Promise.all(urls.map(async (urlObj) => {
                const firstResponse = await fetch(urlObj.url);
                const secondResponse = await fetch(firstResponse.url);
                const secondResponseText = await secondResponse.text();
                const onlineDocument = new DOMParser().parseFromString(secondResponseText, 'text/html');
                const onlineNodes = onlineDocument.querySelectorAll('div#instrument-ueberblick > div');
                const onlineRateNodes = onlineNodes[1].querySelectorAll('ul.list-rows');
                const onlineRateAll = onlineRateNodes[1].querySelectorAll('li')[3].textContent ?? '0';
                const onlineRate = onlineRateAll.split(')')[1] ?? '0';
                const onlineStatisticRows = onlineNodes[0]
                    .querySelectorAll('table')[1]
                    .querySelectorAll('tr');
                const onlineMax = onlineStatisticRows[4].querySelectorAll('td')[3].textContent ??
                    '0';
                const onlineMin = onlineStatisticRows[5].querySelectorAll('td')[3].textContent ??
                    '0';
                const onlineCurrency = 'EUR';
                return {
                    id: urlObj.ident,
                    isin: '',
                    rate: onlineRate,
                    min: onlineMin,
                    max: onlineMax,
                    cur: onlineCurrency
                };
            }));
        };
        const _acheck = async (urls) => {
            return await Promise.all(urls.map(async (urlObj) => {
                const firstResponse = await fetch(urlObj.url);
                let onlineCurrency = '';
                const secondResponse = await fetch(firstResponse.url);
                const secondResponseText = await secondResponse.text();
                const onlineDocument = new DOMParser().parseFromString(secondResponseText, 'text/html');
                const onlineTables = onlineDocument.querySelectorAll('#content table');
                if (onlineTables.length > 1) {
                    const onlineRate = onlineTables[0]
                        .querySelectorAll('tr')[1]
                        .querySelectorAll('td')[1].textContent ?? '0';
                    const findCurrency = onlineTables[0]
                        .querySelectorAll('tr')[1]
                        .querySelectorAll('td')[2].textContent ?? '0';
                    const onlineMin = onlineTables[2]
                        .querySelectorAll('tr')[3]
                        .querySelectorAll('td')[2].textContent ?? '0';
                    const onlineMax = onlineTables[2]
                        .querySelectorAll('tr')[3]
                        .querySelectorAll('td')[1].textContent ?? '0';
                    if (findCurrency.includes('$')) {
                        onlineCurrency = 'USD';
                    }
                    else if (findCurrency.includes('€')) {
                        onlineCurrency = 'EUR';
                    }
                    return {
                        id: urlObj.ident,
                        isin: '',
                        rate: onlineRate,
                        min: onlineMin,
                        max: onlineMax,
                        cur: onlineCurrency
                    };
                }
                else {
                    return {
                        id: -1,
                        isin: '',
                        rate: '0',
                        min: '0',
                        max: '0',
                        cur: 'EUR'
                    };
                }
            }));
        };
        const _tgate = async (urls) => {
            return await Promise.all(urls.map(async (urlObj) => {
                const firstResponse = await fetch(urlObj.url);
                const onlineCurrency = 'EUR';
                const onlineMax = '0';
                const onlineMin = '0';
                const onlineDocument = new DOMParser().parseFromString(await firstResponse.text(), 'text/html');
                const resultask = onlineDocument.querySelector('#ask') !== null
                    ? onlineDocument.querySelector('#ask')?.textContent
                    : '0';
                const resultbid = onlineDocument.querySelector('#bid') !== null
                    ? onlineDocument.querySelector('#bid')?.textContent
                    : '0';
                const quote = mean([toNumber(resultbid), toNumber(resultask)]);
                const onlineRate = quote.toString();
                return {
                    id: urlObj.ident,
                    isin: '',
                    rate: onlineRate,
                    min: onlineMin,
                    max: onlineMax,
                    cur: onlineCurrency
                };
            }));
        };
        const _select = async (urls) => {
            let mmr;
            switch (serviceName) {
                case 'fnet':
                    mmr = await _fnet(urls);
                    break;
                case 'ard':
                    mmr = await _ard(urls);
                    break;
                case 'wstreet':
                    mmr = await _wstreet(urls, CONS.SERVICES[serviceName].HOME);
                    break;
                case 'goyax':
                    mmr = await _goyax(urls);
                    break;
                case 'acheck':
                    mmr = await _acheck(urls);
                    break;
                case 'tgate':
                    mmr = await _tgate(urls);
                    break;
                default:
                    throw new Error('ONLINE: fetchMinRateMaxData: unknown service!');
            }
            return mmr;
        };
        const urls = [];
        if (storageOnline.length > 0) {
            for (let i = 0; i < storageOnline.length; i++) {
                urls.push({
                    url: CONS.SERVICES[serviceName].QUOTE + storageOnline[i].isin,
                    ident: storageOnline[i].id ?? -1
                });
            }
        }
        return await _select(urls);
    };
    const fetchDailyChangesData = async (table, mode = CONS.SERVICES.tgate.CHANGES.SMALL) => {
        console.log('BACKGROUND: fetchDailyChangesData');
        let valuestr;
        let company;
        let sDocument;
        let trCollection;
        let url = CONS.SERVICES.tgate.CHBURL + table;
        let selector = '#kursliste_abc > tr';
        if (mode === CONS.SERVICES.tgate.CHANGES.SMALL) {
            url = CONS.SERVICES.tgate.CHSURL + table;
            selector = '#kursliste_daten > tr';
        }
        const convertHTMLEntities = (str) => {
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
            ]);
            const fMatch = (match) => {
                return entities.get(match.substring(1, 4)) ?? '';
            };
            let result = '';
            if (str !== null) {
                result = str
                    .trim()
                    .replace(new RegExp(CONS.SYSTEM.HTMLENTITY, 'g'), fMatch);
            }
            return result;
        };
        const entry = {
            key: '',
            value: {
                percentChange: '',
                change: 0,
                stringChange: ''
            }
        };
        const firstResponse = await fetch(url);
        const _changes = [];
        if (firstResponse.url.length === 0 ||
            !firstResponse.ok ||
            firstResponse.status >= CONS.STATES.SRV ||
            (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)) {
            notice(['Request failed']);
        }
        else {
            const firstResponseText = await firstResponse.text();
            sDocument = new DOMParser().parseFromString(firstResponseText, 'text/html');
            trCollection = sDocument.querySelectorAll(selector);
            for (let i = 0; i < trCollection.length; i++) {
                valuestr = trCollection[i].childNodes[11].textContent ?? '';
                company = convertHTMLEntities(trCollection[i].childNodes[1].textContent ?? '').replace('<wbr>', '');
                entry.key = company.toUpperCase();
                entry.value = {
                    percentChange: valuestr.replace(/\t/g, ''),
                    change: toNumber(valuestr),
                    stringChange: toNumber(valuestr).toString()
                };
                _changes.push({ ...entry });
            }
        }
        return _changes;
    };
    const fetchCompanyData = async (isin) => {
        console.log('BACKGROUND: fetchCompanyData');
        let sDocument;
        let company = '';
        let child;
        let wkn;
        let symbol;
        let tables;
        let result = {
            company: '',
            isin: '',
            wkn: '',
            symbol: ''
        };
        if (isin.length === 12) {
            const firstResponse = await fetch(CONS.SERVICES.tgate.QUOTE + isin);
            if (firstResponse.url.length === 0 ||
                !firstResponse.ok ||
                firstResponse.status >= CONS.STATES.SRV ||
                (firstResponse.status > 0 &&
                    firstResponse.status < CONS.STATES.SUCCESS)) {
                notice(['Already first request failed']);
            }
            else {
                const secondResponse = await fetch(firstResponse.url);
                if (!secondResponse.ok ||
                    secondResponse.status >= CONS.STATES.SRV ||
                    (secondResponse.status > 0 &&
                        secondResponse.status < CONS.STATES.SUCCESS)) {
                    notice(['Second request failed']);
                }
                else {
                    const secondResponseText = await secondResponse.text();
                    sDocument = new DOMParser().parseFromString(secondResponseText, 'text/html');
                    tables = sDocument.querySelectorAll('table > tbody tr');
                    child = sDocument?.querySelector('#col1_content')?.childNodes[1];
                    company =
                        child?.textContent !== null
                            ? child?.textContent.split(',')[0].trim() ?? ''
                            : '';
                    if (!company.includes('Die Gattung wird') &&
                        tables[1].cells !== null &&
                        tables.length > 0) {
                        wkn = tables[1].cells[0].textContent ?? '';
                        symbol = tables[1].cells[1].textContent ?? '';
                        result = {
                            company,
                            isin,
                            wkn,
                            symbol
                        };
                    }
                }
            }
        }
        else {
            result = {
                company: '',
                isin: '',
                wkn: '',
                symbol: ''
            };
        }
        return result;
    };
    const fetchExchangesData = async (exchangeCodes) => {
        console.log('BACKGROUND: fetchExchangesData');
        const fExUrl = (code) => {
            return `${CONS.SERVICES.fx.EXCHANGE}${code.substring(0, 3)}&cp_input=${code.substring(3, 6)}&amount_from=1`;
        };
        const result = [];
        for (let i = 0; i < exchangeCodes.length; i++) {
            const firstResponse = await fetch(fExUrl(exchangeCodes[i]));
            if (!firstResponse.ok ||
                firstResponse.status >= CONS.STATES.SRV ||
                (firstResponse.status > 0 &&
                    firstResponse.status < CONS.STATES.SUCCESS)) {
                notice([firstResponse.statusText]);
            }
            const firstResponseText = await firstResponse.text();
            const resultDocument = new DOMParser().parseFromString(firstResponseText, 'text/html');
            const resultTr = resultDocument.querySelector('form#formcalculator.formcalculator > div');
            if (resultTr !== undefined && resultTr !== null) {
                const resultString = resultTr.getAttribute('data-rate');
                const resultMatchArray = resultString?.match(/[0-9]*\.?[0-9]+/g) ?? ['1'];
                const exchangeRate = Number.parseFloat(resultMatchArray[0]);
                result.push({ key: exchangeCodes[i], value: exchangeRate });
            }
        }
        return result;
    };
    const fetchMaterialData = async () => {
        console.log('BACKGROUND: fetchMaterialData');
        const materials = [];
        const firstResponse = await fetch(CONS.SERVICES.fnet.MATERIALS);
        if (!firstResponse.ok ||
            firstResponse.status >= CONS.STATES.SRV ||
            (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)) {
            notice([firstResponse.statusText]);
        }
        const firstResponseText = await firstResponse.text();
        const resultDocument = new DOMParser().parseFromString(firstResponseText, 'text/html');
        const resultTr = resultDocument.querySelectorAll('#commodity_prices > table > tbody tr');
        for (let i = 0; i < resultTr.length; i++) {
            if (resultTr[i].children[0].tagName === 'TD' &&
                CONS.SETTINGS.MATERIALS.get(resultTr[i].children[0].textContent ?? '') !== undefined) {
                materials.push({
                    key: CONS.SETTINGS.MATERIALS.get(resultTr[i].children[0].textContent ?? ''),
                    value: toNumber(resultTr[i].children[1].textContent)
                });
            }
        }
        return materials;
    };
    const fetchIndexData = async () => {
        console.log('BACKGROUND: fetchIndexData');
        const indexes = [];
        const indexesKeys = Object.keys(CONS.SETTINGS.INDEXES);
        const indexesValues = Object.values(CONS.SETTINGS.INDEXES);
        const firstResponse = await fetch(CONS.SERVICES.fnet.INDEXES);
        if (!firstResponse.ok ||
            firstResponse.status >= CONS.STATES.SRV ||
            (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)) {
            notice([firstResponse.statusText]);
        }
        const firstResponseText = await firstResponse.text();
        const resultDocument = new DOMParser().parseFromString(firstResponseText, 'text/html');
        const resultTr = resultDocument.querySelectorAll('.index-world-map a');
        for (let i = 0; i < indexesKeys.length; i++) {
            for (let j = 0; j < resultTr.length; j++) {
                if (indexesValues[i].includes(resultTr[j].getAttribute('title') ?? '') &&
                    resultTr[j].children[0].textContent !== undefined) {
                    indexes.push({
                        key: indexesKeys[i],
                        value: toNumber(resultTr[j].children[0].textContent)
                    });
                }
            }
        }
        return indexes;
    };
    const fetchDatesData = async (obj) => {
        console.log('BACKGROUND: fetchDatesData');
        const gmqf = { gm: 0, qf: 0 };
        const parseGermanDate = (germanDateString) => {
            const parts = germanDateString.match(/(\d+)/g) ?? ['01', '01', '1970'];
            const year = parts.length === 3 && parts[2].length === 4 ? parts[2] : '1970';
            const month = parts.length === 3 ? parts[1].padStart(2, '0') : '01';
            const day = parts.length === 3 ? parts[0].padStart(2, '0') : '01';
            return new Date(`${year}-${month}-${day}`).getTime();
        };
        const firstResponse = await fetch('https://www.finanzen.net/suchergebnis.asp?_search=' + obj.isin);
        if (firstResponse.url.length === 0 ||
            !firstResponse.ok ||
            firstResponse.status >= CONS.STATES.SRV ||
            (firstResponse.status > 0 && firstResponse.status < CONS.STATES.SUCCESS)) {
            console.error('BACKGROUND: fetchDatesData: First request failed');
        }
        else {
            const atoms = firstResponse.url.split('/');
            const stockName = atoms[atoms.length - 1].replace('-aktie', '');
            const secondResponse = await fetch('https://www.finanzen.net/termine/' + stockName);
            if (!secondResponse.ok ||
                secondResponse.status >= CONS.STATES.SRV ||
                (secondResponse.status > 0 &&
                    secondResponse.status < CONS.STATES.SUCCESS)) {
                console.error('BACKGROUND: fetchDatesData: Second request failed');
            }
            else {
                const secondResponseText = await secondResponse.text();
                const qfgmDocument = new DOMParser().parseFromString(secondResponseText, 'text/html');
                const tables = qfgmDocument.querySelectorAll('.table');
                const rows = tables[1].querySelectorAll('tr');
                let stopGm = false;
                let stopQf = false;
                const gmqfString = { gm: '01.01.1970', qf: '01.01.1970' };
                for (let j = 0; j < rows.length && !!(rows[j].cells[3]); j++) {
                    const row = rows[j].cells[3].textContent?.replaceAll('(e)*', '').trim() ?? '01.01.1970';
                    if (rows[j].cells[0].textContent === 'Quartalszahlen' &&
                        row !== '01.01.1970' &&
                        row.length === 10 &&
                        !stopQf) {
                        gmqfString.qf = row;
                        stopQf = true;
                    }
                    else if (rows[j].cells[0].textContent === 'Hauptversammlung' &&
                        row !== '01.01.1970' &&
                        row.length === 10 &&
                        !stopGm) {
                        gmqfString.gm = row;
                        stopGm = true;
                    }
                    if (stopQf && stopGm)
                        break;
                }
                gmqf.qf =
                    gmqfString.qf !== undefined && gmqfString.qf !== ''
                        ? parseGermanDate(gmqfString.qf)
                        : 0;
                gmqf.gm =
                    gmqfString.gm !== undefined && gmqfString.gm !== ''
                        ? parseGermanDate(gmqfString.gm)
                        : 0;
            }
        }
        return { key: obj.id, value: gmqf };
    };
    return new Promise(async (resolve) => {
        let response;
        if (request.type === CONS.MESSAGES.SET__SETTINGS_SKIN ||
            request.type === CONS.MESSAGES.SET__SETINGS_SERVICE ||
            request.type === CONS.MESSAGES.SET__SETTINGS_INDEXES ||
            request.type === CONS.MESSAGES.SET__SETTINGS_MATERIALS ||
            request.type === CONS.MESSAGES.SET__SETTINGS_MARKETS ||
            request.type === CONS.MESSAGES.SET__SETTINGS_EXCHANGES) {
            return;
        }
        switch (request.type) {
            case CONS.FETCH_API.ASK__DATES_DATA:
                const datesData = [];
                for (let i = 0; i < request.data.length; i++) {
                    datesData.push(await fetchDatesData(request.data[i]));
                }
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__DATES_DATA,
                    data: datesData
                });
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__INDEX_DATA:
                const indexData = await fetchIndexData();
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__INDEX_DATA,
                    data: indexData
                });
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__MATERIAL_DATA:
                const materialData = await fetchMaterialData();
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__MATERIAL_DATA,
                    data: materialData
                });
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__EXCHANGES_BASE_DATA:
                const exchangesBaseData = await fetchExchangesData(request.data);
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__EXCHANGES_BASE_DATA,
                    data: exchangesBaseData
                });
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__EXCHANGES_DATA:
                const exchangesData = await fetchExchangesData(request.data);
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__EXCHANGES_DATA,
                    data: exchangesData
                });
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__COMPANY_DATA:
                const companyData = await fetchCompanyData(request.data);
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__COMPANY_DATA,
                    data: companyData
                });
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__MIN_RATE_MAX:
                const responseData = await fetchMinRateMaxData(request.data);
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__MIN_RATE_MAX,
                    data: responseData
                });
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__DAILY_CHANGES:
                const dailyChangesData = await fetchDailyChangesData(request.data);
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__DAILY_CHANGES,
                    data: dailyChangesData
                });
                if (Number.parseInt(request.lastEventId) === CONS.SERVICES.tgate.CHS.length - 1) {
                    response = JSON.stringify({
                        type: CONS.FETCH_API.FINISH__DAILY_CHANGES,
                        data: []
                    });
                }
                resolve(response);
                break;
            case CONS.FETCH_API.ASK__DAILY_CHANGES_ALL:
                const dailyChangesDataAll = await fetchDailyChangesData(request.data, CONS.SERVICES.tgate.CHANGES.BIG);
                response = JSON.stringify({
                    type: CONS.FETCH_API.ANSWER__DAILY_CHANGES_ALL,
                    data: dailyChangesDataAll
                });
                if (Number.parseInt(request.lastEventId) === CONS.SERVICES.tgate.CHB.length - 1) {
                    response = JSON.stringify({
                        type: CONS.FETCH_API.FINISH__DAILY_CHANGES_ALL,
                        data: []
                    });
                }
                resolve(response);
                break;
            default:
                console.error('BACKGROUND: Missing message type');
        }
    });
};
const onStorageChange = async (change) => {
    console.info('APP: onStorageChange', change);
    const tabId = Number.parseInt(sessionStorage.getItem('sExtensionTabId') ?? '-1');
    if (tabId > 0) {
        switch (Object.keys(change)[0]) {
            case 'sService':
                browser.tabs.sendMessage(tabId, JSON.stringify({
                    type: CONS.MESSAGES.SET__SETTINGS_SERVICE,
                    data: {
                        name: change['sService'].newValue.name,
                        url: change['sService'].newValue.url
                    }
                }));
                break;
            case 'sSkin':
                browser.tabs.sendMessage(tabId, JSON.stringify({
                    type: CONS.MESSAGES.SET__SETTINGS_SKIN,
                    data: change['sSkin'].newValue
                }));
                break;
            case 'sMarkets':
                browser.tabs.sendMessage(tabId, JSON.stringify({
                    type: CONS.MESSAGES.SET__SETTINGS_MARKETS,
                    data: change['sMarkets'].newValue
                }));
                break;
            case 'sIndexes':
                browser.tabs.sendMessage(tabId, JSON.stringify({
                    type: CONS.MESSAGES.SET__SETTINGS_INDEXES,
                    data: change['sIndexes'].newValue
                }));
                break;
            case 'sMaterials':
                browser.tabs.sendMessage(tabId, JSON.stringify({
                    type: CONS.MESSAGES.SET__SETTINGS_MATERIALS,
                    data: change['sMaterials'].newValue
                }));
                break;
            case 'sExchanges':
                browser.tabs.sendMessage(tabId, JSON.stringify({
                    type: CONS.MESSAGES.SET__SETTINGS_EXCHANGES,
                    data: change['sExchanges'].newValue
                }));
                break;
            default:
        }
    }
};
if (!browser.storage.onChanged.hasListener(onStorageChange)) {
    browser.storage.onChanged.addListener(onStorageChange);
}
if (!browser.runtime.onMessage.hasListener(onAppMessage)) {
    browser.runtime.onMessage.addListener(onAppMessage);
}
if (!browser.runtime.onInstalled.hasListener(onInstall)) {
    browser.runtime.onInstalled.addListener(onInstall);
}
if (!browser.action.onClicked.hasListener(onClick)) {
    browser.action.onClicked.addListener(onClick);
}
if (!browser.permissions.onRemoved.hasListener(onRemove)) {
    browser.permissions.onRemoved.addListener(onRemove);
}
console.info('--- background.js ---', window.location.href);
