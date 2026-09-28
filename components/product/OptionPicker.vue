<script setup>
// One option of a product: text buttons, colour swatches or image swatches. Values no variant can sell
// with the other picks are struck through.
const props = defineProps({ option: { type: Object, required: true }, modelValue: String, available: { type: Function, default: () => true } })
const emit = defineEmits(['update:modelValue'])
const type = computed(() => props.option.type || 'text')
</script>
<template>
  <fieldset>
    <legend class="text-sm mb-3"><span class="font-semibold">{{ option.name }}</span><span v-if="modelValue" class="text-ink-soft">: {{ modelValue }}</span></legend>
    <div class="flex flex-wrap gap-2.5">
      <button
        v-for="v in option.values" :key="v" type="button" :aria-pressed="modelValue === v" :title="v"
        :class="[
          type === 'text' ? 'px-5 py-2.5 rounded-full border text-sm' : 'p-1 rounded-full border-2',
          modelValue === v ? (type === 'text' ? 'border-noir-800 bg-noir-800 text-cream' : 'border-noir-800') : 'border-line-strong hover:border-noir-800',
          !available(v) && 'opacity-40 line-through',
        ]"
        @click="emit('update:modelValue', v)"
      >
        <span v-if="type === 'colour'" class="block w-8 h-8 rounded-full ring-1 ring-black/10" :style="{ background: option.swatches?.[v] || '#ddd' }" />
        <img v-else-if="type === 'image' && option.swatches?.[v]" :src="option.swatches[v]" :alt="v" class="w-10 h-10 rounded-full object-cover">
        <span v-else-if="type === 'image'" class="block w-10 h-10 rounded-full bg-cream-deep text-[0.6rem] leading-10 text-center">{{ v.slice(0, 3) }}</span>
        <template v-else>{{ v }}</template>
        <span v-if="type !== 'text'" class="sr-only">{{ v }}</span>
      </button>
    </div>
  </fieldset>
</template>
