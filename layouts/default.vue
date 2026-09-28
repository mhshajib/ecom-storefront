<template>
  <div class="min-h-screen flex flex-col">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] s-btn-gold">Skip to content</a>
    <LayoutAnnouncementBar />
    <LayoutSiteHeader />
    <main id="main" class="flex-1"><slot /></main>
    <LayoutSiteFooter />
    <LayoutBagDrawer />
    <UiToaster />
  </div>
</template>
