<template>
  <v-text-field
    ref="inputRef"
    density="compact"
    type="text"
    v-bind:disabled="_props.disabled"
    v-bind:label="_props.label"
    v-bind:modelValue="formattedValue"
    variant="outlined"
  ></v-text-field>
</template>

<script lang="ts" setup>
import {type CurrencyInputOptions, useCurrencyInput} from 'vue-currency-input'

interface CurrencyInputProps {
  modelValue: number
  options: CurrencyInputOptions
  label: string
  disabled?: boolean
}

const _props = defineProps<CurrencyInputProps>()
const {inputRef, formattedValue} = useCurrencyInput(_props.options)
</script>
