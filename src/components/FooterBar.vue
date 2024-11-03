<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-bottom-navigation v-model="value" color="primary">
    <v-btn color="secondary" v-on:click="runtime.setTable('HelpCards')">
      <v-icon icon="$help"></v-icon>
      {{ t('footer.help') }}
    </v-btn>
    <v-btn color="secondary" v-on:click="runtime.setTable('PrivacyStatement')">
      <v-icon icon="$privacy"></v-icon>
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
import {useI18n} from 'vue-i18n'
import {useConstants} from '@/libraries/useConstants'
import {useRuntimeStore} from '@/stores/runtime'
import {ref} from 'vue'

const {t} = useI18n()
const CONS = useConstants()
const value = ref('')
const runtime = useRuntimeStore()

console.log('--- FooterBar.vue setup ---')
</script>

<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
