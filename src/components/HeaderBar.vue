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
    <router-link class="router-link-active" to="/">
    <v-tooltip location="top" v-bind:text="t('headerBar.home')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          icon="$home"
          size="large"
          v-bind="props"
          variant="tonal"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    </router-link>
    <v-spacer></v-spacer>
    <router-link class="router-link-active" to="/transfers">
    <v-tooltip location="top" v-bind:text="t('headerBar.transfersTable')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          icon="$transfersTable"
          size="large"
          v-bind="props"
          variant="tonal"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    </router-link>
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
          v-on:click="onIconClick"
        ><v-icon icon="$addStock"></v-icon>
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$fadeinStock"></v-icon
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$cashPlus"></v-icon
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$cashMinus"></v-icon
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$dailyChanges"></v-icon
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$dailyChangesAll"></v-icon
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$exportDatabase"></v-icon
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$importDatabase"></v-icon
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
          v-on:click="onIconClick"
        >
          <v-icon icon="$showAccounting"></v-icon
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
  <DialogPort></DialogPort>
</template>

<script lang="ts" setup>
import {useRuntimeStore} from '@/stores/runtime'
import {useRecordsStore} from '@/stores/records'
import DialogPort from '@/components/DialogPort.vue'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/background'

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

const onIconClick = async (ev: Event): Promise<void> => {
  console.log('HEADER_BAR: onIconClick')
  const parse = async (elem: Element | null, loop = 0): Promise<void> => {
    if (loop > 6 || elem === null) return
    switch (elem!.id) {
      case CONS.DIALOGS.ADDCOMPANY:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.ADDCOMPANY,
          showOkButton: true,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.FADEINSTOCK:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.FADEINSTOCK,
          showOkButton: true,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.DAILYCHANGES:
        runtime.setChangesMode(CONS.DIALOGS.DAILYCHANGES)
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.DAILYCHANGES,
          showOkButton: false,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.DAILYCHANGESALL:
        runtime.setChangesMode(CONS.DIALOGS.DAILYCHANGESALL)
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.DAILYCHANGESALL,
          showOkButton: false,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.ADDDEPOSIT:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.ADDDEPOSIT,
          showOkButton: true,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.ADDWITHDRAWAL:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.ADDWITHDRAWAL,
          showOkButton: true,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.EXPORTDB:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.EXPORTDB,
          showOkButton: true,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.IMPORTDB:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.IMPORTDB,
          showOkButton: true,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.SHOWACCOUNTING:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.SHOWACCOUNTING,
          showOkButton: false,
          showHeaderDialog: true,
          showOptionDialog: false
        })
        break
      case CONS.DIALOGS.SETTING:
        await browser.runtime.openOptionsPage()
        break
      default:
        loop += 1
        console.error(elem!.parentElement)
        await parse(elem!.parentElement, loop)
    }
  }
  if (ev.target instanceof Element) {
    await parse(ev.target)
  }
}

console.log('--- HeaderBar.vue setup ---')
</script>
