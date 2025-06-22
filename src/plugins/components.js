import {} from 'vue';
import StocksTable from '@/components/StocksTable.vue';
import TransfersTable from '@/components/TransfersTable.vue';
import HelpContent from '@/components/HelpContent.vue';
import PrivacyContent from '@/components/PrivacyContent.vue';
export default {
    install: (app) => {
        app.component('StocksTable', StocksTable);
        app.component('TransfersTable', TransfersTable);
        app.component('HelpContent', HelpContent);
        app.component('PrivacyContent', PrivacyContent);
    }
};
console.log('--- PLUGINS components.js ---');
