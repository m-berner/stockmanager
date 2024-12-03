<template>
  <component
    :is="icons[_props.name]"
    class="inline-block"
    role="img"
    style="height: 24px; width: 24px;"
  ></component>
</template>

<script lang="ts" setup>
import AktienCheckIcon from '@/assets/AktienCheckIcon.vue'
import FinanzenIcon from '@/assets/FinanzenIcon.vue'
import FxRateIcon from '@/assets/FxRateIcon.vue'
import GoyaxIcon from '@/assets/GoyaxIcon.vue'
import TagesschauIcon from '@/assets/TagesschauIcon.vue'
import TradegateIcon from '@/assets/TradegateIcon.vue'
import WallstreetIcon from '@/assets/WallstreetIcon.vue'

interface PropsCustomIcon {
  name: string
}

const _props = defineProps<PropsCustomIcon>()
const icons = {
  acheck: AktienCheckIcon,
  fnet: FinanzenIcon,
  fx: FxRateIcon,
  goyax: GoyaxIcon,
  ard: TagesschauIcon,
  tgate: TradegateIcon,
  wstreet: WallstreetIcon
}
</script>
