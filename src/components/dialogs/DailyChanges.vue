<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-toolbar class="background-secondary">
        <v-text-field
          v-model="state._search"
          autofocus
          class="background-orange"
          density="compact"
          hide-details
          prepend-inner-icon="$magnify"
          single-line
          v-bind:label="t('transfersTable.search')"
          v-on:update:modelValue="onSearchDailyChanges"
        ></v-text-field>
      </v-toolbar>
      <v-progress-linear color="yellow-darken-2" v-bind:indeterminate="state._progress"></v-progress-linear>
      <v-list v-model="state._tmpChangesWithNoDuplicates" density="compact" height="400">
        <v-list-item v-for="item in state._tmpChangesWithNoDuplicates" v-bind:id="item.key" v-bind:key="item.key">
          <v-list-item-title>
            {{ item.key }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ item.value.percentChange }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-form>
</template>

<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, toRaw} from 'vue'
import {useI18n} from 'vue-i18n'
import {useApp} from '@/background'
import {useRuntimeStore} from '@/stores/runtime'

interface IChange {
  key: string
  value: {
    percentChange: string
    change: number
    stringChange: string
  }
}

interface IDailyChanges {
  _progress: boolean
  _search: string
  _tmpChanges: IChange[];
  _tmpChangesWithNoDuplicates: IChange[];
}

const {t} = useI18n()
const {CONS} = useApp()
const runtime = useRuntimeStore()
const state: IDailyChanges = reactive({
  _progress: true,
  _search: '',
  _tmpChanges: [],
  _tmpChangesWithNoDuplicates: []
})

const onSearchDailyChanges = (): void => {
  if (state._search.length > 3) {
    const matches = state._tmpChangesWithNoDuplicates.filter((item: IChange) => {
      return item.key.includes(state._search.toUpperCase())
    })
    if (matches.length > 0) {
      const elemId: string = matches[0].key
      const elem = document.getElementById(elemId)
      if (elem !== null) {
        elem.scrollIntoView()
      }
    }
  }
}
const getDailyChanges = async (): Promise<void> => {
  console.log('DAILYCHANGES: getDailyChanges')
  state._tmpChanges = []
  state._tmpChangesWithNoDuplicates = []
  state._progress = true
  if (runtime.changesMode === CONS.DIALOGS.DAILYCHANGES) {
    for (let i = 0; i < CONS.SERVICES.tgate.CHS.length; i++) {
      const chsDataResponseString = await browser.runtime.sendMessage(JSON.stringify({
        type: CONS.FETCH_API.ASK__DAILY_CHANGES,
        data: CONS.SERVICES.tgate.CHS[i],
        lastEventId: i.toString()
      }))
      const chsDataResponse = JSON.parse(chsDataResponseString).data
      state._tmpChanges = [...state._tmpChanges, ...chsDataResponse]
    }
  } else {
    for (let i = 0; i < CONS.SERVICES.tgate.CHB.length; i++) {
      const chbDataResponseString = await browser.runtime.sendMessage(JSON.stringify({
        type: CONS.FETCH_API.ASK__DAILY_CHANGES_ALL,
        data: CONS.SERVICES.tgate.CHB[i],
        lastEventId: i.toString()
      }))
      const chbDataResponse = JSON.parse(chbDataResponseString).data
      state._tmpChanges = [...state._tmpChanges, ...chbDataResponse]
    }
  }
  state._tmpChangesWithNoDuplicates = [
    ...toRaw(
      new Map(
        state._tmpChanges.map((obj: IChange) => [obj.key, obj])
      ).values()
    )
  ]
  state._tmpChangesWithNoDuplicates.sort((a: IChange, b: IChange) => {
    return a.value.change - b.value.change
  })
  state._progress = false
}
const title = () => {
  if (runtime.changesMode === CONS.DIALOGS.DAILYCHANGES) {
    return t('dialogs.dailyChanges.title')
  } else {
    return t('dialogs.dailyChangesAll.title')
  }
}
const classes = () => {
  return ''
}
defineExpose({title, classes})

onBeforeMount(async (): Promise<void> => {
  console.log('DAILYCHANGES: onBeforeMount')
  await getDailyChanges()
})

onMounted(() => {
  console.log('DAILYCHANGES: onMounted')
  runtime.setIsOk(false)
})

console.log('--- DailyChanges.vue setup ---')
</script>

<style scoped>
.background-orange {
  background-color: #ff9800;
}

.background-secondary {
  /*noinspection CssUnresolvedCustomProperty*/
  background-color: var(--v-theme-secondary);
}
</style>
