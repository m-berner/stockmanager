<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-form validate-on="submit" v-on:submit.prevent>
    <v-card-text class="pa-5">
      <v-toolbar class="background-secondary">
        <v-text-field
          v-model="_search"
          v-bind:label="t('transfersTable.search')"
          v-on:update:modelValue="dailychanges.searchDailyChanges"
          class="background-orange"
          density="compact"
          prepend-inner-icon="$magnify"
          hide-details
          single-line
          autofocus
        ></v-text-field>
      </v-toolbar>
      <v-progress-linear v-bind:indeterminate="_progress" color="yellow-darken-2"></v-progress-linear>
      <v-list v-model="_changes" density="compact" height="400">
        <v-list-item v-for="item in _changes" v-bind:key="item.key" v-bind:id="item.key">
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
import {useModaldialogStore} from '@/stores/modaldialog'
import {useOnlineStore} from '@/stores/online'
import {useDailychangesStore} from '@/stores/dialogs/dailychanges'
import {storeToRefs} from 'pinia'
import {onBeforeMount, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const online = useOnlineStore()
const dailychanges = useDailychangesStore()
const {_changes} = storeToRefs(online)
const {_search, _progress} = storeToRefs(dailychanges)
const modaldialog = useModaldialogStore()

onBeforeMount(async () => {
  console.log('DAILYCHANGES: onBeforeMount')
  await dailychanges.getDailyChanges(modaldialog.toggle)
})

onMounted(() => {
  console.log('DAILYCHANGES: onMounted')
  modaldialog.setNoOk(true)
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
