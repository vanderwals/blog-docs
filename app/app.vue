<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const appConfig = useAppConfig();
useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: appConfig.site.description },
  ],
  link: [{ rel: "icon", href: appConfig.site.logo.src }],
  title: appConfig.homepage.hero.title,
  htmlAttrs: {
    lang: "en",
  },
});
</script>
