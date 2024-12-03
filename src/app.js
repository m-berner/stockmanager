import PagesLayout from '@/layouts/PagesLayout.vue';
import StocksTable from '@/components/StocksTable.vue';
import TransfersTable from '@/components/TransfersTable.vue';
import BareLayout from '@/layouts/BareLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomePage from '@/views/HomePage.vue';
import IndexPage from '@/App.vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { mdiBasketFill, mdiBasketMinus, mdiBasketPlus, mdiCalculator, mdiCashMinus, mdiCashPlus, mdiChartTimelineVariant, mdiChartTimelineVariantShimmer, mdiCheck, mdiClose, mdiCog, mdiCopyright, mdiCurrencyEur, mdiDatabaseExport, mdiDatabaseImport, mdiDelete, mdiDomain, mdiDomainPlus, mdiDomainRemove, mdiDotsVertical, mdiEmail, mdiFileCog, mdiFileDocumentEdit, mdiFileDocumentMinus, mdiGiftOutline, mdiHandshake, mdiHelpCircle, mdiHome, mdiImage, mdiInfinity, mdiMagnify, mdiPlus, mdiReload, mdiShieldAccount, mdiTableLargeRemove, mdiTransfer } from '@mdi/js';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { useApp } from '@/composables/useApp';
const { getUI } = useApp();
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/options',
            name: 'options',
            component: () => import('@/views/OptionsPage.vue'),
            meta: {
                layout: 'Bare',
            }
        },
        {
            path: '/help',
            name: 'help',
            component: () => import('@/views/HelpPage.vue'),
            meta: {
                layout: 'Pages',
            }
        },
        {
            path: '/privacy',
            name: 'privacy',
            component: () => import('@/views/PrivacyPage.vue'),
            meta: {
                layout: 'Pages',
            }
        }
    ]
});
const vuetify = createVuetify({
    theme: {
        defaultTheme: 'ocean',
        themes: {
            light: {
                dark: false,
                colors: {
                    background: '#e0e0e0',
                    primary: '#eeeeee',
                    surface: '#eeeeee',
                    secondary: '#e0e0e0',
                    warning: 'orange',
                    error: 'orange',
                    info: 'yellow',
                    success: 'green'
                }
            },
            dark: {
                dark: true,
                colors: {
                    background: '#e0e0e0',
                    primary: '#23222B',
                    surface: '#23222B',
                    secondary: '#e0e0e0',
                    warning: 'orange',
                    error: 'orange',
                    info: 'yellow',
                    success: 'green'
                }
            },
            sky: {
                dark: false,
                colors: {
                    background: '#e0e0e0',
                    primary: '#3282f6',
                    surface: '#3282f6',
                    secondary: '#e0e0e0',
                    warning: 'orange',
                    error: 'orange',
                    info: 'yellow',
                    success: 'green'
                }
            },
            ocean: {
                dark: false,
                colors: {
                    background: '#e0e0e0',
                    primary: '#194f7d',
                    surface: '#194f7d',
                    secondary: '#e0e0e0',
                    warning: 'orange',
                    error: 'orange',
                    info: 'yellow',
                    success: 'green'
                }
            },
            earth: {
                dark: false,
                colors: {
                    background: '#e0e0e0',
                    primary: '#780e12',
                    surface: '#780e12',
                    secondary: '#e0e0e0',
                    warning: 'orange',
                    error: 'orange',
                    info: 'yellow',
                    success: 'green'
                }
            },
            meadow: {
                dark: false,
                colors: {
                    background: '#e0e0e0',
                    primary: '#378222',
                    surface: '#378D22',
                    secondary: '#e0e0e0',
                    topbar: '#37bb22',
                    warning: 'orange',
                    error: 'orange',
                    info: 'yellow',
                    success: 'green'
                }
            }
        }
    },
    icons: {
        sets: {
            mdi
        },
        defaultSet: 'mdi',
        aliases: {
            ...aliases,
            sm: mdiImage,
            home: mdiHome,
            euro: mdiCurrencyEur,
            reload: mdiReload,
            addStock: mdiDomainPlus,
            deleteStock: mdiDomainRemove,
            fadeinStock: mdiDomain,
            cashPlus: mdiCashPlus,
            cashMinus: mdiCashMinus,
            dailyChanges: mdiChartTimelineVariant,
            dailyChangesAll: mdiChartTimelineVariantShimmer,
            exportDatabase: mdiDatabaseExport,
            importDatabase: mdiDatabaseImport,
            transfersTable: mdiTransfer,
            showAccounting: mdiCalculator,
            settings: mdiCog,
            copyright: mdiCopyright,
            buyStock: mdiBasketPlus,
            sellStock: mdiBasketMinus,
            addDividend: mdiBasketFill,
            showDividend: mdiGiftOutline,
            configs: mdiFileCog,
            link: mdiInfinity,
            close: mdiClose,
            add: mdiPlus,
            remove: mdiDelete,
            check: mdiCheck,
            dots: mdiDotsVertical,
            tableRemove: mdiTableLargeRemove,
            removeDocument: mdiFileDocumentMinus,
            editDocument: mdiFileDocumentEdit,
            help: mdiHelpCircle,
            privacy: mdiShieldAccount,
            partner: mdiHandshake,
            mail: mdiEmail,
            magnify: mdiMagnify
        }
    }
});
const i18n = createI18n({
    locale: getUI().locale,
    fallbackLocale: 'en-US',
    legacy: false,
    globalInjection: true,
    messages,
    datetimeFormats: {
        'de-DE': {
            numeric: {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            },
            short: {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            },
            long: {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric'
            }
        },
        'en-US': {
            numeric: {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            },
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric'
            }
        }
    },
    numberFormats: {
        'de-DE': {
            currency5: {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
                notation: 'standard'
            },
            currency3: {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
                notation: 'standard'
            },
            currency: {
                style: 'currency',
                currency: 'EUR',
                notation: 'standard'
            },
            currencyUSD: {
                style: 'currency',
                currency: 'USD',
                notation: 'standard'
            },
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            },
            decimal3: {
                style: 'decimal',
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            },
            integer: {
                style: 'decimal',
                maximumFractionDigits: 0
            },
            year: {
                style: 'decimal',
                maximumFractionDigits: 0,
                useGrouping: false
            },
            percent: {
                style: 'percent',
                minimumFractionDigits: 1,
                maximumFractionDigits: 2,
                useGrouping: false
            }
        },
        'en-US': {
            currency: {
                style: 'currency',
                currency: 'USD',
                notation: 'standard'
            },
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            },
            percent: {
                style: 'percent',
                useGrouping: false
            }
        }
    }
});
const pinia = createPinia();
const app = createApp(IndexPage);
app.config.errorHandler = (err) => {
    console.error(err);
};
app.config.warnHandler = (msg) => {
    console.warn(msg);
};
app.component('DefaultLayout', DefaultLayout);
app.component('StocksTable', StocksTable);
app.component('TransfersTable', TransfersTable);
app.component('BareLayout', BareLayout);
app.component('PagesLayout', PagesLayout);
app.use(router);
app.use(vuetify);
app.use(i18n);
app.use(pinia);
app.mount('#app');
console.log('--- app.js ---');
