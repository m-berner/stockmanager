<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-layout>
    <v-app-bar app color="secondary" v-bind:flat="true">
      <v-app-bar-title>
        Stockmanager - {{ title }}
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer
      permanent
      v-bind:witdh="250"
    >
      <v-list nav>
        <v-list-item link prepend-icon="$home" to="/" v-bind:title="t('headerBar.home')"></v-list-item>
        <v-list-item link prepend-icon="$help" to="/help" v-bind:title="t('footer.help')"
                     v-on:click="() => title=t('footer.help')"></v-list-item>
        <v-list-item link prepend-icon="$privacy" to="/privacy" v-bind:title="t('footer.privacy')"
                     v-on:click="() => title=t('footer.privacy')"></v-list-item>
        <v-list-item href="mailto:stockmanager@gmx.de" link prepend-icon="$mail"
                     v-bind:title="t('footer.mail')"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useRuntimeStore} from '@/stores/runtime'
import {ref, watchEffect} from 'vue'

const {t} = useI18n()
const runtime = useRuntimeStore()
const title = ref('')

watchEffect(
  () => {
    title.value = t(`footer.${runtime.pageTitle}`)
  }
)

console.log('--- PagesLayout.vue setup ---')
</script>
