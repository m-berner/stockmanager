<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="_props.menuType === 'stocks'"
        v-bind="props"
        icon="$dots"
        v-on:click="records.setActiveStockIndexForGivenId(_props.recordID)"
      ></v-btn>
      <v-btn
        v-if="_props.menuType === 'transfers'"
        v-bind="props"
        icon="$dots"
        v-on:click="records.setTransferIndexForGivenId(_props.recordID)"
      ></v-btn>
    </template>
    <v-list>
      <v-hover v-slot:default="{ props, isHovering }">
        <v-list-item
          v-for="(item, i) in _props.menuItems" v-bind:key="item.title"
          class="pointer"
          v-bind="props"
          v-bind:id="setId(i)"
          v-bind:base-color="isHovering ? 'orange' : ''"
          v-bind:prepend-icon="rt(item.icon)"
          v-bind:title="rt(item.title)"
          v-on:click="selectOption(i)"
        ></v-list-item>
      </v-hover>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'
import {useRecordsStore} from '@/stores/records'
import {useModaldialogStore} from '@/stores/modaldialog'
import {useI18n} from 'vue-i18n'

const {rt} = useI18n()
const CONS = useConstants()
const {notice} = useAppLibrary()
const records = useRecordsStore()
const modaldialog = useModaldialogStore()

interface PropsOptionMenu {
  recordID: number
  menuItems: Record<string, string>[]
  menuType: string
}

const _props = defineProps<PropsOptionMenu>()

const selectOption = (optionIndex = -1): void => {
  console.info('OPTIONMENU selectOption', optionIndex)
  if (_props.menuType === 'stocks') {
    const stockUrl: string = optionIndex === 6 ? records.stocks.active[records.stocks.active_index].cURL : ''
    switch (optionIndex) {
      case 0:
        modaldialog.toggleVisibility(CONS.DIALOGS.DELETESTOCK)
        break
      case 1:
        modaldialog.toggleVisibility(CONS.DIALOGS.BUYSTOCK)
        break
      case 2:
        modaldialog.toggleVisibility(CONS.DIALOGS.SELLSTOCK)
        break
      case 3:
        modaldialog.toggleVisibility(CONS.DIALOGS.ADDDIVIDEND)
        break
      case 4:
        modaldialog.toggleVisibility(CONS.DIALOGS.SHOWDIVIDEND)
        break
      case 5:
        modaldialog.toggleVisibility(CONS.DIALOGS.CONFIGSTOCK)
        break
      case 6:
        if (stockUrl === '') {
          notice(['No URL available'])
        } else {
          window.open(stockUrl, '_blank', 'noreferrer')
        }
        break
      default:
        break
    }
  } else {
    switch (optionIndex) {
      case 0:
        modaldialog.toggleVisibility(CONS.DIALOGS.DELETETRANSFER)
        break
      case 1:
        modaldialog.toggleVisibility(CONS.DIALOGS.UPDATETRANSFER)
        break
      default:
        break
    }
  }
}
const setId = (optionIndex = -1): string => {
  let resultId: string = ''
  if (_props.menuType === 'stocks') {
    switch (optionIndex) {
      case 0:
        resultId = CONS.DIALOGS.DELETESTOCK
        break
      case 1:
        resultId = CONS.DIALOGS.BUYSTOCK
        break
      case 2:
        resultId = CONS.DIALOGS.SELLSTOCK
        break
      case 3:
        resultId = CONS.DIALOGS.ADDDIVIDEND
        break
      case 4:
        resultId = CONS.DIALOGS.SHOWDIVIDEND
        break
      case 5:
        resultId = CONS.DIALOGS.CONFIGSTOCK
        break
      default:
        break
    }
  } else {
    switch (optionIndex) {
      case 0:
        resultId = CONS.DIALOGS.DELETETRANSFER
        break
      case 1:
        resultId = CONS.DIALOGS.UPDATETRANSFER
        break
      default:
        break
    }
  }
  return resultId
}

console.log('--- OptionMenu.vue setup ---')
</script>
