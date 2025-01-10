<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2025, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-container>
    <v-tabs v-model="state._tab" show-arrows>
      <v-row class="pa-2" justify="space-between">
        <v-tab v-for="i in state._tabs_length" v-bind:key="i" v-bind:value="i">
          {{ t(`optionsPage.tabs[${i - 1}].title`) }}
        </v-tab>
      </v-row>
    </v-tabs>
    <v-window v-model="state._tab" class="pa-5">
      <v-window-item v-bind:value="1">
        <v-row>
          <v-col cols="12" md="6" sm="6">
            <v-radio-group v-model="settings.skin" column>
              <h2>{{ t('optionsPage.capitals.skins') }}</h2>
              <v-radio
                v-for="i in state._theme_keys.length"
                v-bind:key="i"
                v-bind:label="t(`optionsPage.themeNames.${state._theme_keys[i - 1]}`)"
                v-bind:value="state._theme_keys[i - 1]"
                v-on:click="settings.setSkin(state._theme_keys[i - 1], theme)"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-radio-group v-model="settings.service.name" column>
              <h2>{{ t('optionsPage.capitals.services') }}</h2>
              <v-radio
                v-for="i in state._service_keys.length"
                v-bind:key="i"
                v-bind:label="CONS.SERVICES[state._service_keys[i - 1]].NAME"
                v-bind:value="state._service_keys[i - 1]"
                v-on:click="settings.setService(service(i))"
              ></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item v-bind:value="2">
        <v-row class="pa-10" justify="center">
          <v-col cols="12" md="10" sm="10">
            <DynamicList
              v-bind:_label="t('optionsPage.markets.label')"
              v-bind:_list="settings.markets"
              v-bind:_store="CONS.SETTINGS.MP"
              v-bind:_title="t('optionsPage.markets.title')"
            ></DynamicList>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item v-bind:value="3">
        <v-row>
          <v-col>
            <v-checkbox
              v-for="i in group(state._index_keys.length)[0]"
              v-bind:key="i"
              v-model="_indexes"
              hide-details
              v-bind:label="CONS.SETTINGS.INDEXES[state._index_keys[i - 1]]"
              v-bind:value="state._index_keys[i - 1]"
              v-on:click="settings.toggleIndexes(state._index_keys, i - 1)"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-for="i in group(state._index_keys.length)[1]"
              v-bind:key="i"
              v-model="_indexes"
              hide-details
              v-bind:label="
                    CONS.SETTINGS.INDEXES[state._index_keys[i - 1 + group(state._index_keys.length)[1]]]
                  "
              v-bind:value="state._index_keys[i - 1 + group(state._index_keys.length)[1]]"
              v-on:click="
                    settings.toggleIndexes(state._index_keys, i - 1 + group(state._index_keys.length)[1])
                  "
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item v-bind:value="4">
        <v-row>
          <v-col>
            <v-checkbox
              v-for="i in group(state._material_keys.length)[0]"
              v-bind:key="i"
              v-model="_materials"
              hide-details
              v-bind:label="t(`optionsPage.materials.${state._material_keys[i - 1]}`)"
              v-bind:value="state._material_keys[i - 1]"
              v-on:click="settings.toggleMaterials(state._material_keys, i - 1)"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-for="i in group(state._material_keys.length)[1]"
              v-bind:key="i"
              v-model="_materials"
              hide-details
              v-bind:label="
                    t(
                      `optionsPage.materials.${
                        state._material_keys[i - 1 + group(state._material_keys.length)[0]]
                      }`
                    )
                  "
              v-bind:value="state._material_keys[i - 1 + group(state._material_keys.length)[0]]"
              v-on:click="
                    settings.toggleMaterials(
                      state._material_keys,
                      i - 1 + group(state._material_keys.length)[0]
                    )
                  "
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item v-bind:value="5">
        <v-row class="pa-12" justify="center">
          <v-col cols="12" md="10" sm="10">
            <DynamicList
              v-bind:_label="t('optionsPage.exchanges.label')"
              v-bind:_list="settings.exchanges"
              v-bind:_placeholder="CONS.DEFAULTS.STORAGE.exchanges[0]"
              v-bind:_store="CONS.SETTINGS.EX"
              v-bind:_title="t('optionsPage.exchanges.title')"
              v-bind:_toUpperCase="true"
            ></DynamicList>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts" setup>
import DynamicList from '@/components/DynamicList.vue'
import {useSettingsStore} from '@/stores/settings'
import {useI18n} from 'vue-i18n'
import {useTheme} from 'vuetify'
import {storeToRefs} from 'pinia'
import {useApp} from '@/composables/useApp'
import {onMounted, reactive, toRaw} from 'vue'

interface IOptionsPage {
  _tab: number
  _tabs_length: number
  _theme_keys: string[]
  _service_keys: string[]
  _index_keys: string[]
  _material_keys: string[]
}

const {t, tm} = useI18n()
const {CONS} = useApp()
const {group} = useApp()
const settings = useSettingsStore()
/* NOTE: the destructured variables are reactive! */
const {_indexes, _materials} = storeToRefs(settings)
const theme = useTheme()
const state: IOptionsPage = reactive({
  _tab: 0,
  _tabs_length: 0,
  _theme_keys: [],
  _service_keys: [],
  _index_keys: [],
  _material_keys: []
})

const service = (i: number) => {
  return {
    name: state._service_keys[i - 1],
    url: CONS.SERVICES[state._service_keys[i - 1]].HOME
  }
}

onMounted(() => {
  console.log('OPTIONSPAGE: onMounted')
  const labelsOptionsPage: Record<string, string> = tm('optionsPage')
  const serviceKeys = Object.keys(CONS.SERVICES)
  serviceKeys.pop()
  serviceKeys.pop()
  state._tab = 1
  state._tabs_length = labelsOptionsPage.tabs.length
  state._theme_keys = Object.keys(toRaw(theme.themes.value))
  state._service_keys = serviceKeys
  state._index_keys = Object.keys(CONS.SETTINGS.INDEXES)
  state._material_keys = Object.keys(toRaw(labelsOptionsPage.materials))
})

console.log('--- OptionsPage.vue setup ---')
</script>
