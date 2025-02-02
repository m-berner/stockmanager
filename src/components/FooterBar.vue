<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-bottom-navigation color="primary">
    <v-btn color="white" v-on:click="runtime.setTable('HelpPage')">
      <v-icon icon="$help"></v-icon>
      <span>{{ t('footer.help') }}</span>
    </v-btn>
    <v-btn color="white" v-on:click="runtime.setTable('PrivacyPage')">
      <v-icon icon="$privacy"></v-icon>
      <span>{{ t('footer.privacy') }}</span>
    </v-btn>
    <v-btn color="white" href="mailto:stockmanager@gmx.de">
      <v-icon icon="$mail"></v-icon>
      <span>{{ t('footer.mail') }}</span>
    </v-btn>
    <v-btn color="white" v-bind:disabled="true">
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
</style>
