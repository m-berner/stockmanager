<template>
  <v-text-field
    v-bind:modelValue="formattedValue"
    ref="inputRef"
    variant="outlined"
    density="compact"
    type="text"
    v-bind:rules="[_props.validator as ValidationRule]"
    v-bind:label="_props.label"
    v-bind:disabled="_props.disabled"
    v-on:focus="_props.resetValidation"
  ></v-text-field>
</template>

<script lang="ts" setup>
import {type CurrencyInputOptions, useCurrencyInput} from 'vue-currency-input'
import {type VTextField} from 'vuetify/components'

type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : A
type ValidationRule = UnwrapReadonlyArray<VTextField['rules']>

interface PropsCurrencyInput {
  modelValue: number
  options: CurrencyInputOptions
  label: string
  disabled?: boolean
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  resetValidation?: Function
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  validator?: Function
}

const _props = defineProps<PropsCurrencyInput>()
const {inputRef, formattedValue} = useCurrencyInput(_props.options)
</script>
