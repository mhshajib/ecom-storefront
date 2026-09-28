<script setup>
const { toasts, dismiss } = useToast()
const act = (t) => { if (t.action?.run) t.action.run(); if (t.action?.to) navigateTo(t.action.to); dismiss(t.id) }
</script>

<template>
  <div class="fixed top-4 right-4 left-4 sm:left-auto z-[70] flex flex-col items-end gap-2 pointer-events-none" aria-live="polite">
    <TransitionGroup enter-from-class="opacity-0 translate-x-6" enter-active-class="transition duration-300 ease-out" leave-to-class="opacity-0 translate-x-6" leave-active-class="transition duration-200 absolute">
      <div v-for="t in toasts" :key="t.id" class="pointer-events-auto w-full sm:w-[22rem] rounded-2xl bg-noir-900 text-cream shadow-lift ring-1 ring-gold/25 overflow-hidden">
        <div class="flex items-center gap-3 p-3.5">
          <img v-if="t.image" :src="t.image" alt="" class="w-12 h-12 rounded-lg object-cover bg-white shrink-0">
          <span v-else class="w-9 h-9 rounded-full bg-gold/20 text-gold-light flex items-center justify-center shrink-0"><Icon :name="t.icon || 'lucide:check'" class="w-4 h-4" /></span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-semibold">{{ t.title }}</span>
            <span v-if="t.body" class="block text-xs text-cream/70 truncate">{{ t.body }}</span>
          </span>
          <button v-if="t.action" class="text-xs font-semibold text-gold-light hover:underline shrink-0" @click="act(t)">{{ t.action.label }}</button>
          <button class="text-cream/50 hover:text-cream p-1 shrink-0" aria-label="Dismiss" @click="dismiss(t.id)"><Icon name="lucide:x" class="w-4 h-4" /></button>
        </div>
        <span class="block h-0.5 bg-gold origin-left s-toast-bar" :style="{ animationDuration: `${t.ms}ms` }" />
      </div>
    </TransitionGroup>
  </div>
</template>
