<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-bottom-navigation color="primary">
    <v-btn color="secondary">
      <router-link
        activeClass="color-white"
        class="color-white"
        exactActiveClass="color-white"
        to="/help"
        v-on:click="() => { runtime.setPageTitle('help')}">
        <v-icon icon="$help"></v-icon>
      </router-link>
      {{ t('footer.help') }}
    </v-btn>
    <v-btn color="secondary">
      <router-link
        activeClass="color-white"
        class="color-white"
        exactActiveClass="color-white"
        to="/privacy"
        v-on:click="() => { runtime.setPageTitle('privacy')}">
        <v-icon icon="$privacy"></v-icon>
      </router-link>
      {{ t('footer.privacy') }}
    </v-btn>
    <v-btn href="mailto:stockmanager@gmx.de">
      <v-icon icon="$mail"></v-icon>
      {{ t('footer.mail') }}
    </v-btn>
    <v-btn v-bind:disabled="true">
      <v-icon icon="$copyright"></v-icon>
      <div class="nowrap">{{ CONS.SYSTEM.COPYRIGHT }}</div>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import {useRuntimeStore} from '@/stores/runtime'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/composables/useApp'

const {t} = useI18n()
const {CONS} = useApp()
const runtime = useRuntimeStore()

console.log('--- FooterBar.vue setup ---')
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}

.color-white {
  color: white;
}
</style>
