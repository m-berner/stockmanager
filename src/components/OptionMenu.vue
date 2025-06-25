<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        v-if="_props.menuType === 'stocks'"
        icon="$dots"
        v-bind="props"
        v-on:click="records.setActiveStockIndexForGivenId(_props.recordID)"
      ></v-btn>
      <v-btn
        v-if="_props.menuType === 'transfers'"
        icon="$dots"
        v-bind="props"
        v-on:click="records.setTransferIndexForGivenId(_props.recordID)"
      ></v-btn>
    </template>
    <v-list>
      <v-hover v-slot:default="{ props, isHovering }">
        <v-list-item
          v-for="item in _props.menuItems"
          v-bind:id="rt(item.id)"
          v-bind:key="rt(item.title)"
          class="pointer"
          v-bind="props"
          v-bind:base-color="isHovering ? 'orange' : ''"
          v-bind:prepend-icon="rt(item.icon)"
          v-bind:title="rt(item.title)"
          v-on:click="onIconClick"
        ></v-list-item>
      </v-hover>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import {useApp} from '@/background'
import {useRecordsStore} from '@/stores/records'
import {useI18n} from 'vue-i18n'
import {useRuntimeStore} from '@/stores/runtime'

interface PropsOptionMenu {
  recordID: number
  menuItems: Record<string, string>[]
  menuType: string
}

const _props = defineProps<PropsOptionMenu>()
const {rt} = useI18n()
const {CONS} = useApp()
const records = useRecordsStore()
const runtime = useRuntimeStore()

const onIconClick = async (ev: Event): Promise<void> => {
  console.log('OPTION_MENU: onIconClick', {info: ev.target})
  const parse = async (elem: Element | null, loop = 0): Promise<void> => {
    if (loop > 6 || elem === null) return
    switch (elem!.id) {
      case CONS.DIALOGS.DELETESTOCK:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.DELETESTOCK,
          showOkButton: true,
          showOptionDialog: true,
          showHeaderDialog: false
        })
        break
      case CONS.DIALOGS.BUYSTOCK:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.BUYSTOCK,
          showOkButton: true,
          showOptionDialog: true,
          showHeaderDialog: false
        })
        break
      case CONS.DIALOGS.ADDDIVIDEND:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.ADDDIVIDEND,
          showOkButton: true,
          showOptionDialog: true,
          showHeaderDialog: false
        })
        break
      case CONS.DIALOGS.SHOWDIVIDEND:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.SHOWDIVIDEND,
          showOkButton: false,
          showOptionDialog: true,
          showHeaderDialog: false
        })
        break
      case CONS.DIALOGS.CONFIGSTOCK:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.CONFIGSTOCK,
          showOkButton: true,
          showOptionDialog: true,
          showHeaderDialog: false
        })
        break
      case CONS.DIALOGS.DELETETRANSFER:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.DELETETRANSFER,
          showOkButton: true,
          showOptionDialog: true,
          showHeaderDialog: false
        })
        break
      case CONS.DIALOGS.UPDATETRANSFER:
        runtime.setTeleport({
          dialogName: CONS.DIALOGS.UPDATETRANSFER,
          showOkButton: true,
          showOptionDialog: true,
          showHeaderDialog: false
        })
        break
      case 'ExternalLink':
        console.error('SFDSDFSFSFSFSF-----------')
        break
      default:
        loop += 1
        await parse(elem!.parentElement, loop)
    }
  }
  if (ev.target instanceof Element) {
    await parse(ev.target)
  }
}

console.log('--- OptionMenu.vue setup ---')
</script>
