import {} from 'vue';
import StocksTable from '@/components/StocksTable.vue';
import TransfersTable from '@/components/TransfersTable.vue';
import HelpContent from '@/components/HelpContent.vue';
import PrivacyContent from '@/components/PrivacyContent.vue';
import ImportDatabase from '@/components/dialogs/ImportDatabase.vue';
import ShowAccounting from '@/components/dialogs/ShowAccounting.vue';
import { useApp } from '@/background';
import ExportDatabase from '@/components/dialogs/ExportDatabase.vue';
import AddCompany from '@/components/dialogs/AddCompany.vue';
import DeleteStock from '@/components/dialogs/DeleteStock.vue';
import DailyChanges from '@/components/dialogs/DailyChanges.vue';
import FadeinStock from '@/components/dialogs/FadeinStock.vue';
import AddDeposit from '@/components/dialogs/AddDeposit.vue';
import AddWithdrawal from '@/components/dialogs/AddWithdrawal.vue';
const { CONS } = useApp();
export default {
    install: (app) => {
        app.component('StocksTable', StocksTable);
        app.component('TransfersTable', TransfersTable);
        app.component('HelpContent', HelpContent);
        app.component('PrivacyContent', PrivacyContent);
        app.component(CONS.DIALOGS.ADDCOMPANY, AddCompany);
        app.component(CONS.DIALOGS.FADEINSTOCK, FadeinStock);
        app.component(CONS.DIALOGS.DELETESTOCK, DeleteStock);
        app.component(CONS.DIALOGS.EXPORTDB, ExportDatabase);
        app.component(CONS.DIALOGS.IMPORTDB, ImportDatabase);
        app.component(CONS.DIALOGS.SHOWACCOUNTING, ShowAccounting);
        app.component(CONS.DIALOGS.DAILYCHANGES, DailyChanges);
        app.component(CONS.DIALOGS.DAILYCHANGESALL, DailyChanges);
        app.component(CONS.DIALOGS.ADDDEPOSIT, AddDeposit);
        app.component(CONS.DIALOGS.ADDWITHDRAWAL, AddWithdrawal);
    }
};
console.log('--- PLUGINS components.js ---');
