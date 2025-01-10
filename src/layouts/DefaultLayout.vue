<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-layout>
    <TitleBar/>
    <HeaderBar/>
    <InfoBar/>
    <v-main>
      <router-view></router-view>
    </v-main>
    <FooterBar/>
    <ModalDialog
      v-if="runtime.isAddCompany || runtime.isFadeinStock || runtime.isAddDeposit ||
      runtime.isAddWithdrawal || runtime.isDailyChanges || runtime.isExportDb ||
      runtime.isImportDb || runtime.isShowAccounting || runtime.isDeleteTransfer ||
runtime.isUpdateTransfer || runtime.isDeleteStock || runtime.isBuyStock || runtime.isSellStock ||
runtime.isAddDividend || runtime.isShowDividend || runtime.isConfigCompany"
    ></ModalDialog>
  </v-layout>
</template>

<script lang="ts" setup>
import HeaderBar from '@/components/HeaderBar.vue'
import InfoBar from '@/components/InfoBar.vue'
import TitleBar from '@/components/TitleBar.vue'
import FooterBar from '@/components/FooterBar.vue'
import ModalDialog from '@/components/dialogs/ModalDialog.vue'
import {useRuntimeStore} from '@/stores/runtime'

const runtime = useRuntimeStore()

console.log('--- DefaultLayout.vue setup ---')
</script>
