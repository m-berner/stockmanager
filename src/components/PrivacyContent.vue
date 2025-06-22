<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="7" sm="7">
        <v-card>
          <v-card-title>
            {{ t('privacyPage.public.title') }}
          </v-card-title>
          <v-card-text>
            {{ t('privacyPage.public.content') }}
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            {{ t('privacyPage.connections.title') }}
          </v-card-title>
          <v-card-text>
            {{ t('privacyPage.connections.content') }}
            <v-list density="compact">
              <v-list-item
                v-for="item in dataList"
                v-bind:key="item"
                v-bind:title="rt(item)"
              >
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {rt, t, tm} = useI18n()
const dataList: string[] = tm('privacyPage.connections.dataList')

console.log('--- PrivacyDocument.vue setup ---')
</script>
