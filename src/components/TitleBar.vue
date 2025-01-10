<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-app-bar app color="secondary" v-bind:flat="true">
    <v-app-bar-title>
      {{ t('titleBar.title') }}
      <v-btn target="_blank" v-bind:href="settings.service.url">
        <template v-slot:prepend>
          <CustomIcon v-bind:name="settings.service.name"></CustomIcon>
        </template>
        {{ settings.service.name }}
      </v-btn>
    </v-app-bar-title>
    <v-spacer v-if="!settings.partner"></v-spacer>
    <div v-if="settings.partner" class="cssPartnerLinks">
      <v-btn
        v-for="item in (tm('titleBar.linkData') as Record<string, VueMessageType>[])"
        v-bind:key="rt(item.icon)"
        target="_blank"
        v-bind:href="rt(item.url)"
      >
        <CustomIcon v-bind:name="rt(item.icon)"></CustomIcon>
      </v-btn>
    </div>
    <v-btn>
      <v-switch
        v-model="settings.partner"
        color="primary"
        hide-details
        label="Partner"
        v-on:click="settings.togglePartner()"
      ></v-switch>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import CustomIcon from '@/components/CustomIcon.vue'
import {useRecordsStore} from '@/stores/records'
import {useSettingsStore} from '@/stores/settings'
import {useI18n, type VueMessageType} from 'vue-i18n'
import {watch} from 'vue'

const {rt, t, tm} = useI18n()
const settings = useSettingsStore()
const records = useRecordsStore()

watch(
  () => settings.service,
  () => {
    console.log('TITLEBAR: watch')
    records.resetActiveStocksValues()
  }
)

console.log('--- TitleBar.vue setup ---')
</script>

<style scoped>
.cssPartnerLinks {
  width: 525px;
}
</style>
