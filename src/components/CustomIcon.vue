<template>
  <component
    :is="icons[_props.name]"
    role="img"
    class="inline-block"
    style="height: 24px; width: 24px;"
  ></component>
</template>

<script lang="ts" setup>
import AktienCheckIcon from '@/components/customicons/AktienCheckIcon.vue'
import FinanzenIcon from '@/components/customicons/FinanzenIcon.vue'
import FxRateIcon from '@/components/customicons/FxRateIcon.vue'
import GoyaxIcon from '@/components/customicons/GoyaxIcon.vue'
import TagesschauIcon from '@/components/customicons/TagesschauIcon.vue'
import TradegateIcon from '@/components/customicons/TradegateIcon.vue'
import WallstreetIcon from '@/components/customicons/WallstreetIcon.vue'

interface PropsCustomIcon {
  name: string
}

const icons = {
  acheck: AktienCheckIcon,
  fnet: FinanzenIcon,
  fx: FxRateIcon,
  goyax: GoyaxIcon,
  ard: TagesschauIcon,
  tgate: TradegateIcon,
  wstreet: WallstreetIcon
}
const _props = defineProps<PropsCustomIcon>()
</script>
