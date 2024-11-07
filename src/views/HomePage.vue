<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <v-app v-bind:flat="true">
    <TitleBar/>
    <HeaderBar/>
    <InfoBar/>
    <v-main>
      <component
        v-model="runtime.showTable"
        v-if="runtime.showTable"
        v-bind:is="runtime.table">
      </component>
    </v-main>
    <FooterBar/>
  </v-app>
</template>

<script lang="ts" setup>
import {useRuntimeStore} from '@/stores/runtime'
import TitleBar from '@/components/TitleBar.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import InfoBar from '@/components/InfoBar.vue'
import FooterBar from '@/components/FooterBar.vue'
// TODO rename useRuntimeStore to useHomepageStore, create homepage.ts store
const runtime = useRuntimeStore()

console.log('--- HomePage.vue setup ---')
</script>
