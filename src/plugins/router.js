import { createRouter, createWebHashHistory } from 'vue-router';
export default {
    router: createRouter({
        history: createWebHashHistory(),
        routes: [
            {
                path: '/',
                name: 'home',
                components: {
                    default: () => import('@/components/StocksTable.vue'),
                    title: () => import('@/components/TitleBar.vue'),
                    header: () => import('@/components/HeaderBar.vue'),
                    info: () => import('@/components/InfoBar.vue'),
                    footer: () => import('@/components/FooterBar.vue')
                }
            },
            {
                path: '/transfers',
                name: 'transfers',
                components: {
                    default: () => import('@/components/TransfersTable.vue'),
                    title: () => import('@/components/TitleBar.vue'),
                    header: () => import('@/components/HeaderBar.vue'),
                    info: () => import('@/components/InfoBar.vue'),
                    footer: () => import('@/components/FooterBar.vue')
                }
            },
            {
                path: '/help',
                name: 'help',
                components: {
                    default: () => import('@/components/HelpContent.vue'),
                    title: () => import('@/components/TitleBar.vue'),
                    header: () => import('@/components/HeaderBar.vue'),
                    footer: () => import('@/components/FooterBar.vue')
                }
            },
            {
                path: '/privacy',
                name: 'privacy',
                components: {
                    default: () => import('@/components/PrivacyContent.vue'),
                    title: () => import('@/components/TitleBar.vue'),
                    header: () => import('@/components/HeaderBar.vue'),
                    footer: () => import('@/components/FooterBar.vue')
                }
            }
        ]
    })
};
console.log('--- PLUGINS router.js ---');
