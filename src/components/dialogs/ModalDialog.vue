<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-dialog v-model="runtime.isVisible" v-bind:persistent="true" width="500">
    <v-card v-bind:class="dialogClasses">
      <v-card-title class="text-center">
        {{ dialogTitle }}
      </v-card-title>
      <AddCompany
        v-if="runtime.isAddCompany"
        ref="dialogRef"
      ></AddCompany>
      <FadeinStock
        v-if="runtime.isFadeinStock"
        ref="dialogRef"
      ></FadeinStock>
      <AddDeposit
        v-if="runtime.isAddDeposit"
        ref="dialogRef"
      ></AddDeposit>
      <AddWithdrawal
        v-if="runtime.isAddWithdrawal"
        ref="dialogRef"
      ></AddWithdrawal>
      <DailyChanges
        v-if="runtime.isDailyChanges"
        ref="dialogRef"
      ></DailyChanges>
      <ExportDatabase
        v-if="runtime.isExportDb"
        ref="dialogRef"
      ></ExportDatabase>
      <ImportDatabase
        v-if="runtime.isImportDb"
        ref="dialogRef"
      ></ImportDatabase>
      <ShowAccounting
        v-if="runtime.isShowAccounting"
        ref="dialogRef"
      ></ShowAccounting>

      <DeleteTransfer
        v-if="runtime.isDeleteTransfer"
        ref="dialogRef"
      ></DeleteTransfer>
      <UpdateTransfer
        v-if="runtime.isUpdateTransfer"
        ref="dialogRef"
      ></UpdateTransfer>

      <DeleteStock
        v-if="runtime.isDeleteStock"
        ref="dialogRef"
      ></DeleteStock>
      <AddDividend
        v-if="runtime.isAddDividend"
        ref="dialogRef"
      ></AddDividend>
      <ShowDividend
        v-if="runtime.isShowDividend"
        ref="dialogRef"
      ></ShowDividend>
      <BuyStock
        v-if="runtime.isBuyStock"
        ref="dialogRef"
      ></BuyStock>
      <SellStock
        v-if="runtime.isSellStock"
        ref="dialogRef"
      ></SellStock>
      <ConfigCompany
        v-if="runtime.isConfigCompany"
        ref="dialogRef"
      ></ConfigCompany>
      <v-card-actions class="pa-5">
        <v-tooltip location="bottom" v-bind:text="t('dialogs.ok')">
          <template v-slot:activator="{ props }">
            <v-btn
              v-if="runtime.isOk"
              class="ml-auto"
              icon="$check"
              type="submit"
              v-bind="props"
              variant="outlined"
              v-on:click="dialogRef.ok()"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip location="bottom" v-bind:text="t('dialogs.cancel')">
          <template v-slot:activator="{ props }">
            <v-btn
              class="ml-auto"
              icon="$close"
              v-bind="props"
              variant="outlined"
              v-on:click="runtime.toggleVisibility"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import ExportDatabase from '@/components/dialogs/ExportDatabase.vue'
import ImportDatabase from '@/components/dialogs/ImportDatabase.vue'
import ShowAccounting from '@/components/dialogs/ShowAccounting.vue'
import FadeinStock from '@/components/dialogs/FadeinStock.vue'
import DailyChanges from '@/components/dialogs/DailyChanges.vue'
import AddCompany from '@/components/dialogs/AddCompany.vue'
import AddDeposit from '@/components/dialogs/AddDeposit.vue'
import AddWithdrawal from '@/components/dialogs/AddWithdrawal.vue'
import DeleteTransfer from '@/components/dialogs/DeleteTransfer.vue'
import UpdateTransfer from '@/components/dialogs/UpdateTransfer.vue'
import BuyStock from '@/components/dialogs/BuyStock.vue'
import AddDividend from '@/components/dialogs/AddDividend.vue'
import SellStock from '@/components/dialogs/SellStock.vue'
import ShowDividend from '@/components/dialogs/ShowDividend.vue'
import DeleteStock from '@/components/dialogs/DeleteStock.vue'
import ConfigCompany from '@/components/dialogs/ConfigCompany.vue'
import {useRuntimeStore} from '@/stores/runtime'

const dialogRef = ref()
const {t} = useI18n()
const runtime = useRuntimeStore()
const dialogTitle = ref('')
const dialogClasses = ref('')

onMounted(() => {
  console.log('MODALDIALOG: onMounted')
  dialogClasses.value = dialogRef.value.classes()
  dialogTitle.value = dialogRef.value.title()
})

console.log('--- ModalDialog.vue setup ---')
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.v-btn--icon {
  border: thin solid white;
}
</style>
