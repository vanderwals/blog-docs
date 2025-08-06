<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

// 默认配置
const defaultConfig = useAppConfig();

const appConfig = ref({ ...defaultConfig });

onMounted(async () => {
  try {
    const config = await fetch("/config.json").then((res) => res.json());
    updateAppConfig({ ...defaultConfig, ...config });
    console.log("配置更新成功");
  } catch (e) {
    // 如果 config.json 不存在或解析失败，使用默认配置
    appConfig.value = { ...defaultConfig };
    console.error("配置更新失败", e);
  }
  useHead({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: appConfig.value.homepage.hero.subtitle },
    ],
    link: [{ rel: "icon", href: appConfig.value.site.logo.src }],
    title: appConfig.value.homepage.hero.title,
    htmlAttrs: {
      lang: "en",
    },
  });
});
</script>
