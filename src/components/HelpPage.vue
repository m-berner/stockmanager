<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-sheet class="sheet" color="surface-light">
    <v-container>
      <v-row justify="center">
        <v-col cols="8" s="8">
          <v-card color="secondary">
            <v-card-title>
              {{ t('helpPage.requestsTitle') }}
            </v-card-title>
          </v-card>
          <v-card v-for="item in helpPageRequests" v-bind:key="item.title">
            <v-card-title>
              <v-icon v-if="rt(item.icon).length > 0">{{ rt(item.icon) }}</v-icon>
              {{ rt(item.title) }}
            </v-card-title>
            <v-card-text>
              {{ rt(item.content) }}
            </v-card-text>
          </v-card>
          <v-card color="secondary">
            <v-card-title>
              {{ t('helpPage.toolBarTitle') }}
            </v-card-title>
          </v-card>
          <v-card v-for="item in helpPageToolbar" v-bind:key="item.title">
            <v-card-title>
              <v-icon v-if="rt(item.icon).length > 0">{{ rt(item.icon) }}</v-icon>
              {{ rt(item.title) }}
            </v-card-title>
            <v-card-text>
              {{ rt(item.content) }}
            </v-card-text>
          </v-card>
          <v-card color="secondary">
            <v-card-title>
              {{ t('helpPage.companyBarTitle') }}
            </v-card-title>
          </v-card>
          <v-card v-for="item in helpPageCompanybar" v-bind:key="item.title">
            <v-card-title>
              <v-icon v-if="rt(item.icon).length > 0">{{ rt(item.icon) }}</v-icon>
              {{ rt(item.title) }}
            </v-card-title>
            <v-card-text>
              {{ rt(item.subtitle) }}
            </v-card-text>
          </v-card>
          <v-card color="secondary">
            <v-card-title>
              {{ t('helpPage.transferBarTitle') }}
            </v-card-title>
          </v-card>
          <v-card v-for="item in helpPageTransferbar" v-bind:key="item.title">
            <v-card-title v-bind="{ item }">
              <v-icon v-if="rt(item.icon).length > 0">{{ rt(item.icon) }}</v-icon>
              {{ rt(item.title) }}
            </v-card-title>
            <v-card-text>
              {{ rt(item.subtitle) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {rt, t, tm} = useI18n()
const helpPageRequests: Record<string, string>[] = tm('helpPage.requests')
const helpPageToolbar: Record<string, string>[] = tm('helpPage.toolBar')
const helpPageCompanybar: Record<string, string>[] = tm('helpPage.companyBar')
const helpPageTransferbar: Record<string, string>[] = tm('helpPage.transferBar')

console.log('--- HelpPage.vue setup ---')
</script>

<style scoped>
.sheet {
  overflow: auto;
  height: calc(100vh - 300px);
}
</style>
