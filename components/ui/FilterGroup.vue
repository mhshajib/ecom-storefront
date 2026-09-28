<script setup>
// A collapsible group of shop filters; shows how many of its values are chosen when closed.
const props = defineProps({ title: String, open: { type: Boolean, default: true }, chosen: { type: Number, default: 0 } })
const isOpen = ref(props.open || props.chosen > 0)
</script>

<template>
  <fieldset class="border-t border-line pt-5 first:border-0 first:pt-0">
    <legend class="w-full">
      <button type="button" class="w-full flex items-center justify-between gap-3 font-display text-lg text-noir-800" :aria-expanded="isOpen" @click="isOpen = !isOpen">
        <span class="flex items-center gap-2">{{ title }}<span v-if="chosen && !isOpen" class="rounded-full bg-noir-900 text-gold-light text-[0.65rem] font-sans font-semibold px-1.5">{{ chosen }}</span></span>
        <Icon name="lucide:chevron-down" class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': isOpen }" />
      </button>
    </legend>
    <div class="grid transition-[grid-template-rows] duration-300" :class="isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
      <div class="overflow-hidden"><div class="pt-4"><slot /></div></div>
    </div>
  </fieldset>
</template>
