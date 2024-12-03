<!--
  -- This Source Code Form is subject to the terms of the Mozilla Public
  -- License, v. 2.0. If a copy of the MPL was not distributed with this file,
  -- you could obtain one at https://mozilla.org/MPL/2.0/.
  --
  -- Copyright (c) 2014-2024, Martin Berner, stockmanager@gmx.de. All rights reserved.
  -->
<template>
  <component
    v-bind:is="runtime.table"
    v-if="runtime.isStockTable"
    v-model="runtime.isStockTable">
  </component>
</template>

<script lang="ts" setup>
import {useRuntimeStore} from '@/stores/runtime'

const runtime = useRuntimeStore()

console.log('--- HomePage.vue setup ---')
</script>
