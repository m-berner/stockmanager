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
const { CONS } = useApp();
export default {
    install: (app) => {
        app.component('StocksTable', StocksTable);
        app.component('TransfersTable', TransfersTable);
        app.component('HelpContent', HelpContent);
        app.component('PrivacyContent', PrivacyContent);
        app.component(CONS.DIALOGS.ADDCOMPANY, AddCompany);
        app.component(CONS.DIALOGS.DELETESTOCK, DeleteStock);
        app.component(CONS.DIALOGS.EXPORTDB, ExportDatabase);
        app.component(CONS.DIALOGS.IMPORTDB, ImportDatabase);
        app.component(CONS.DIALOGS.SHOWACCOUNTING, ShowAccounting);
    }
};
console.log('--- PLUGINS components.js ---');
