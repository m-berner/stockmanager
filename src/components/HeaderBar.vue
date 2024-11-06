<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-app-bar v-bind:height="75" :flat="true" app>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.home')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind="props"
          v-on:click="runtime.setTable('StocksTable')"
          variant="tonal"
          size="large"
          icon="$home"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.transfersTable')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind="props"
          v-on:click="runtime.setTable('TransfersTable')"
          variant="tonal"
          size="large"
          icon="$transfersTable"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.reload')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind="props"
          v-on:click.prevent="onUpdate()"
          variant="tonal"
          size="large"
          icon="$reload"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-tooltip location="top" v-bind:text="t('headerBar.addStock')">
      <template v-slot:activator="{ props }">
        <v-app-bar-nav-icon
          v-bind="props"
          v-bind:id="CONS.DIALOGS.ADDSTOCK"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.FADEINSTOCK"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.ADDDEPOSIT"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.ADDWITHDRAWAL"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.DAILYCHANGES"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.DAILYCHANGESALL"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.EXPORTDB"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.IMPORTDB"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-bind:id="CONS.DIALOGS.SHOWACCOUNTING"
          v-on:click="modaldialog.toggleVisibility"
          variant="tonal"
          size="large"
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
          v-bind="props"
          v-on:click="onToggleSettings"
          variant="tonal"
          size="large"
          icon="$settings"
        ></v-app-bar-nav-icon>
      </template>
    </v-tooltip>
    <v-spacer></v-spacer>
  </v-app-bar>

  <ModalDialog
    v-if="modaldialog.addStock"
    v-bind:title="t('dialogs.addStock.title')"
    v-bind:ok="addstock.add"
  >
    <AddStock></AddStock>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.fadeinStock"
    v-bind:title="t('dialogs.fadeinStock.title')"
    v-bind:ok="async () => { await fadeinstock.onOk() }"
  >
    <FadeinStock></FadeinStock>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.addDeposit"
    v-bind:title="t('dialogs.addDeposit.title')"
    v-bind:ok="adddeposit.add"
  >
    <AddDeposit></AddDeposit>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.addWithdrawal"
    v-bind:title="t('dialogs.addWithdrawal.title')"
    v-bind:ok="addwithdrawal.add"
  >
    <AddWithdrawal></AddWithdrawal>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.dailyChanges"
    v-bind:title="t('dialogs.dailyChanges.title')"
  >
    <DailyChanges></DailyChanges>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.exportDb"
    v-bind:title="t('dialogs.exportDatabase.title')"
    v-bind:ok="exportdatabase.export"
  >
    <ExportDatabase></ExportDatabase>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.importDb"
    v-bind:title="t('dialogs.importDatabase.title')"
    v-bind:ok="importdatabase.import"
  >
    <ImportDatabase></ImportDatabase>
  </ModalDialog>
  <ModalDialog
    v-if="modaldialog.showAccounting"
    v-bind:title="t('dialogs.showAccounting.title')"
  >
    <ShowAccounting></ShowAccounting>
  </ModalDialog>
</template>

<script lang="ts" setup>
import AddStock from '@/components/dialogs/AddStock.vue'
import FadeinStock from '@/components/dialogs/FadeinStock.vue'
import AddDeposit from '@/components/dialogs/AddDeposit.vue'
import AddWithdrawal from '@/components/dialogs/AddWithdrawal.vue'
import DailyChanges from '@/components/dialogs/DailyChanges.vue'
import ExportDatabase from '@/components/dialogs/ExportDatabase.vue'
import ImportDatabase from '@/components/dialogs/ImportDatabase.vue'
import ShowAccounting from '@/components/dialogs/ShowAccounting.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import {useRuntimeStore} from '@/stores/runtime'
import {useRecordsStore} from '@/stores/records'
import {useAddstockStore} from '@/stores/dialogs/addstock'
import {useFadeinstockStore} from '@/stores/dialogs/fadeinstock'
import {useAdddepositStore} from '@/stores/dialogs/adddeposit'
import {useAddwithdrawalStore} from '@/stores/dialogs/addwithdrawal'
import {useExportdatabaseStore} from '@/stores/dialogs/exportdatabase'
import {useImportdatabaseStore} from '@/stores/dialogs/importdatabase'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/useApp'
import {useModaldialogStore} from '@/stores/modaldialog'

const {t} = useI18n()
const { CONS } = useApp()
const runtime = useRuntimeStore()
const records = useRecordsStore()
const addstock = useAddstockStore()
const fadeinstock = useFadeinstockStore()
const adddeposit = useAdddepositStore()
const addwithdrawal = useAddwithdrawalStore()
const exportdatabase = useExportdatabaseStore()
const importdatabase = useImportdatabaseStore()
const modaldialog = useModaldialogStore()

const onUpdate = (): void => {
  console.log('HEADERBAR: onUpdate')
  records.updateWrapper(records.stocks.active_page)
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
