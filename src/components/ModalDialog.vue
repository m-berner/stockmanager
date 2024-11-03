<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-dialog v-model="_visibility" width="500">
    <v-card v-bind:class="_props.classes">
      <v-card-title class="text-center">
        {{ _props.title }}
      </v-card-title>
      <slot></slot>
      <v-card-actions class="pa-5">
        <v-tooltip location="bottom" v-bind:text="t('dialogs.ok')">
          <template v-slot:activator="{ props }">
            <v-btn
              v-if="!_noOk"
              class="ml-auto"
              v-bind="props"
              variant="outlined"
              type="submit"
              v-on:click="_props.ok"
              icon="$check"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip location="bottom" v-bind:text="t('dialogs.cancel')">
          <template v-slot:activator="{ props }">
            <v-btn
              class="ml-auto"
              v-bind="props"
              variant="outlined"
              v-on:click="modaldialog.toggleVisibility"
              icon="$close"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {useModaldialogStore} from '@/stores/modaldialog'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'

interface PropsModalDialog {
  title: string
  classes?: string
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  ok?: Function
}

const {t} = useI18n()
const _props = defineProps<PropsModalDialog>()
const modaldialog = useModaldialogStore()
const {_visibility, _noOk} = storeToRefs(modaldialog)

console.log('--- ModalDialog.vue setup ---')
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.v-btn--icon {
  border: thin solid white;
}
</style>
