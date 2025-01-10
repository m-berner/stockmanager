<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-app-bar :flat="true" app v-bind:height="75">
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.home')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          icon="$home"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.setTable('StocksTable')"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.transfersTable')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          icon="$transfersTable"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.setTable('TransfersTable')"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.reload')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          icon="$reload"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="onUpdate()"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.addStock')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.ADDCOMPANY"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$addStock"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.fadeinStock')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.FADEINSTOCK"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$fadeinStock"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.cashPlus')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.ADDDEPOSIT"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$cashPlus"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.cashMinus')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.ADDWITHDRAWAL"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$cashMinus"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.dailyChanges')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.DAILYCHANGES"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$dailyChanges"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.dailyChangesAll')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.DAILYCHANGESALL"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$dailyChangesAll"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.exportDatabase')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.EXPORTDB"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$exportDatabase"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.importDatabase')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.IMPORTDB"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$importDatabase"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.showAccounting')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind:id="CONS.DIALOGS.SHOWACCOUNTING"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="runtime.toggleVisibility"
        >
          <v-icon class="put-into-background" icon="$showAccounting"></v-icon
          >
        </v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.settings')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          icon="$settings"
          size="large"
          v-bind="props"
          variant="tonal"
          v-on:click="onToggleSettings"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script lang="ts" setup>
import {useRuntimeStore} from '@/stores/runtime'
import {useRecordsStore} from '@/stores/records'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/composables/useApp'

const {t} = useI18n()
const {CONS} = useApp()
const runtime = useRuntimeStore()
const records = useRecordsStore()

const onUpdate = async (): Promise<void> => {
  console.log('HEADERBAR: onUpdate')
  records.resetActiveStocksValues()
  await records.updateWrapper()
}
const onToggleSettings = async (): Promise<void> => {
  await browser.runtime.openOptionsPage()
}

console.log('--- HeaderBar.vue setup ---')
</script>

<style scoped>
.put-into-background {
  z-index: -500;
}
</style>
