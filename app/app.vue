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
  // 只在首页设置SEO信息，避免覆盖页面级别的SEO
  if (useRoute().path === "/") {
    const siteUrl = appConfig.value.seo.url;
    useSeoMeta({
      title: appConfig.value.homepage.hero.title,
      description: appConfig.value.homepage.hero.subtitle,
      ogSiteName: appConfig.value.seo.siteName,
      ogType: "website",
      ogLocale: "en_US",
      // ogImage: "https://cdn.sharkfoto.com/sharkfoto_og.png",
      ogUrl: siteUrl,
      ogTitle: appConfig.value.homepage.hero.title,
      ogDescription: appConfig.value.homepage.hero.subtitle,
      twitterCard: "summary_large_image",
      twitterUrl: siteUrl,
      twitterTitle: appConfig.value.homepage.hero.title,
      // twitterImage: "https://cdn.sharkfoto.com/sharkfoto_og.png",
      twitterSite: appConfig.value.seo.twitter.site,
      twitterDescription: appConfig.value.homepage.hero.subtitle,
    });
  }

  // 设置基础元信息
  useHead({
    // meta: [
    //   {
    //     property: "og:image",
    //     content: "https://cdn.sharkfoto.com/sharkfoto_og.png",
    //   },
    // ],
    link: [{ rel: "icon", href: appConfig.value.site.logo.src }],
    htmlAttrs: {
      lang: "en",
    },
  });
});
</script>
