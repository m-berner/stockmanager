<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-app>
    <v-main>
      <v-container>
        <v-tabs v-model="_tab" show-arrows>
          <v-row class="pa-2" justify="space-between">
            <v-tab v-for="i in optionspage.tabsLength" v-bind:key="i" v-bind:value="i">
              {{ t(`optionsPage.tabs[${i - 1}].title`) }}
            </v-tab>
          </v-row>
        </v-tabs>
        <v-window v-model="_tab" class="pa-5">
          <v-window-item v-bind:value="1">
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-radio-group v-model="settings.skin" column>
                  <h2>{{ t('optionsPage.capitals.skins') }}</h2>
                  <v-radio
                    v-for="i in optionspage.themeKeys.length"
                    v-bind:key="i"
                    v-bind:label="t(`optionsPage.themeNames.${optionspage.themeKeys[i - 1]}`)"
                    v-bind:value="optionspage.themeKeys[i - 1]"
                    v-on:click="settings.setSkin(optionspage.themeKeys[i - 1], theme)"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-radio-group v-model="settings.service.name" column>
                  <h2>{{ t('optionsPage.capitals.services') }}</h2>
                  <v-radio
                    v-for="i in optionspage.serviceKeys.length"
                    v-bind:key="i"
                    v-bind:label="CONS.SERVICES[optionspage.serviceKeys[i - 1]].NAME"
                    v-bind:value="optionspage.serviceKeys[i - 1]"
                    v-on:click="settings.setService(service(i))"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item v-bind:value="2">
            <v-row justify="center" class="pa-10">
              <v-col cols="12" sm="10" md="10">
                <DynamicList
                  v-bind:store="CONS.SETTINGS.MP"
                  v-bind:title="t('optionsPage.markets.title')"
                  v-bind:label="t('optionsPage.markets.label')"
                  v-bind:list="settings.markets"
                ></DynamicList>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item v-bind:value="3">
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="_indexes"
                  v-for="i in group(optionspage.indexKeys.length)[0]"
                  v-bind:key="i"
                  v-bind:label="CONS.SETTINGS.INDEXES[optionspage.indexKeys[i - 1]]"
                  v-bind:value="optionspage.indexKeys[i - 1]"
                  v-on:click="settings.mToggleIndexes(optionspage.indexKeys, i - 1)"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="_indexes"
                  v-for="i in group(optionspage.indexKeys.length)[1]"
                  v-bind:key="i"
                  v-bind:label="
                    CONS.SETTINGS.INDEXES[optionspage.indexKeys[i - 1 + group(optionspage.indexKeys.length)[1]]]
                  "
                  v-bind:value="optionspage.indexKeys[i - 1 + group(optionspage.indexKeys.length)[1]]"
                  v-on:click="
                    settings.mToggleIndexes(optionspage.indexKeys, i - 1 + group(optionspage.indexKeys.length)[1])
                  "
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item v-bind:value="4">
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="_materials"
                  v-for="i in group(optionspage.materialKeys.length)[0]"
                  v-bind:key="i"
                  v-bind:label="t(`optionsPage.materials.${optionspage.materialKeys[i - 1]}`)"
                  v-bind:value="optionspage.materialKeys[i - 1]"
                  v-on:click="settings.mToggleMaterials(optionspage.materialKeys, i - 1)"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="_materials"
                  v-for="i in group(optionspage.materialKeys.length)[1]"
                  v-bind:key="i"
                  v-bind:label="
                    t(
                      `optionsPage.materials.${
                        optionspage.materialKeys[i - 1 + group(optionspage.materialKeys.length)[0]]
                      }`
                    )
                  "
                  v-bind:value="optionspage.materialKeys[i - 1 + group(optionspage.materialKeys.length)[0]]"
                  v-on:click="
                    settings.mToggleMaterials(
                      optionspage.materialKeys,
                      i - 1 + group(optionspage.materialKeys.length)[0]
                    )
                  "
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item v-bind:value="5">
            <v-row justify="center" class="pa-12">
              <v-col cols="12" sm="10" md="10">
                <DynamicList
                  v-bind:store="CONS.SETTINGS.EX"
                  v-bind:placeholder="CONS.DEFAULTS.STORAGE.exchanges[0]"
                  v-bind:title="t('optionsPage.exchanges.title')"
                  v-bind:label="t('optionsPage.exchanges.label')"
                  v-bind:list="settings.exchanges"
                  v-bind:toUpperCase="true"
                ></DynamicList>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// TODO add exchange, fetch rate
import DynamicList from '@/components/DynamicList.vue'
import {useSettingsStore} from '@/stores/settings'
import {useOptionsPageStore} from '@/stores/optionspage'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'
import {useTheme} from 'vuetify'
import {useAppLibrary} from '@/libraries/useApp'
import {useConstants} from '@/libraries/useConstants'
import {onMounted, toRaw} from 'vue'

const {t, tm} = useI18n()
const CONS = useConstants()
const {group} = useAppLibrary()
const settings = useSettingsStore()
const optionspage = useOptionsPageStore()
/* NOTE: the destructured variables are reactive! */
const {_indexes, _materials} = storeToRefs(settings)
const {_tab} = storeToRefs(optionspage)
const theme = useTheme()

// TODO move to store
const service = (i: number) => {
  return {
    name: optionspage.serviceKeys[i - 1],
    url: CONS.SERVICES[optionspage.serviceKeys[i - 1]].HOME
  }
}

onMounted(() => {
  console.log('OPTIONSPAGE: onMounted')
  const messagesOptionsPage: Record<string, string> = tm('optionsPage')
  const serviceKeys = Object.keys(CONS.SERVICES)
  serviceKeys.pop()
  serviceKeys.pop()
  optionspage.setTab(1)
  optionspage.setTabsLength(messagesOptionsPage.tabs.length)
  optionspage.setThemeKeys(Object.keys(toRaw(theme.themes.value)))
  optionspage.setServiceKeys(serviceKeys)
  optionspage.setIndexKeys(Object.keys(CONS.SETTINGS.INDEXES))
  optionspage.setMaterialKeys(Object.keys(toRaw(messagesOptionsPage.materials)))
})

console.log('--- OptionsPage.vue setup ---')
</script>
