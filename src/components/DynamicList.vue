<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-card v-bind:title="_props.title">
    <v-list v-model="props.list">
      <v-list-item
        v-for="(item, i) in _props.list"
        v-bind:key="JSON.stringify(item)"
        v-bind:title="item"
        hide-details>
        <template v-slot:prepend>
          <v-btn
            class="mr-3"
            icon="$close"
            v-on:click="mRemoveItem(i)"></v-btn>
        </template>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-text-field
        v-model="newItem"
        type="text"
        v-bind:placeholder="_props.placeholder"
        v-bind:clearable="true"
        v-bind:label="_props.label"
        v-bind:autofocus="true">
        <template v-slot:append>
          <v-btn
            class="ml-3"
            icon="$add"
            v-on:click="mAddItem(newItem)"></v-btn>
        </template>
      </v-text-field>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {useSettingsStore} from '@/stores/settings'
import {reactive, ref, toRaw} from 'vue'
import {useConstants} from '@/libraries/useConstants'
import {useOnlineStore} from '@/stores/online'

interface PropsDynamicList {
  title: string
  list: Array<string | number | undefined>
  label: string
  store: string
  hint?: string
  counter?: number
  placeholder?: string
  toUpperCase?: boolean
}

const CONS = useConstants()
const settings = useSettingsStore()
const online = useOnlineStore()
const _props = defineProps<PropsDynamicList>()
const newItem = ref('')
const props = reactive({..._props})

const mAddItem = async (item: string): Promise<void> => {
  console.log('DYNAMICLIST: mAddItem')
  return await new Promise(async (resolve) => {
    if (!_props.list.includes(item)) {
      if (_props.toUpperCase) {
        props.list.push(item.toUpperCase())
      } else {
        props.list.push(item)
      }
    }
    const _ar = toRaw(_props.list)
    if (_props.store === CONS.SETTINGS.EX) {
      await settings.setExchanges(_ar)
      await browser.storage.local.set({exchanges: _ar})
    } else if (_props.store === CONS.SETTINGS.MP) {
      await settings.setMarkets(_ar)
      await browser.storage.local.set({markets: _ar})
    }
    newItem.value = ''
    resolve()
  })
}
const mRemoveItem = async (n: number): Promise<void> => {
  console.log('DYNAMICLIST: mRemoveItem')
  return await new Promise(async (resolve)=>{
    if (n > 0) {
      if (_props.store === CONS.SETTINGS.EX) {
        const toRemove = _props.list[n]
        props.list.splice(n, 1)
        await settings.setExchanges(toRaw(_props.list))
        online.exchanges.delete(toRemove)
        await browser.storage.local.set({exchanges: toRaw(_props.list)})
      } else if (_props.store === CONS.SETTINGS.MP) {
        props.list.splice(n, 1)
        await settings.setMarkets(toRaw(_props.list))
        await browser.storage.local.set({markets: toRaw(_props.list)})
      }
    }
    resolve()
  })
}

console.log('--- DynamicList.vue setup ---')
</script>
