<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">
        {{ appConfig.homepage.hero.title }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ appConfig.homepage.hero.subtitle }}
      </p>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else>
      <h2 class="text-2xl font-bold mb-6">
        {{ appConfig.homepage.sections.latest.title }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="article in articles"
          :key="article.path"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/20 hover:shadow-xl dark:hover:shadow-gray-900/30 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <NuxtLink :to="article.path" class="block p-6">
            <div class="aspect-video overflow-hidden rounded-lg mb-4">
              <div
                class="w-full h-full rounded-xl box-border flex items-center justify-center overflow-hidden"
                style="box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06)"
              >
                <img
                  :src="article.image"
                  :alt="article.title"
                  class="min-w-full min-h-full object-cover object-center rounded-lg"
                />
              </div>
            </div>
            <h3
              class="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight tracking-tight"
            >
              {{ article.title }}
            </h3>
            <p
              class="text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 mt-2"
            >
              {{ article.description || "No Description" }}
            </p>

            <div
              class="flex justify-between items-center text-sm text-gray-500 mt-4"
            >
              <span>{{ formatDate(article.createdAt) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const appConfig = useAppConfig();
console.log("appConfig", appConfig);

// 设置主页元信息
useHead(() => {
  const siteUrl = appConfig.seo.url.replace(/\/$/, "");
  return {
    title: appConfig.homepage.hero.title,
    meta: [
      { name: "description", content: appConfig.homepage.hero.subtitle },
      {
        property: "og:title",
        content: `${appConfig.homepage.hero.title} | ${appConfig.seo.siteName} Blog`,
      },
      { property: "og:description", content: appConfig.homepage.hero.subtitle },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      // {
      //   property: "og:image",
      //   content: "https://cdn.sharkfoto.com/sharkfoto_og.png",
      // },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: `${appConfig.homepage.hero.title} | ${appConfig.seo.siteName} Blog`,
      },
      {
        name: "twitter:description",
        content: appConfig.homepage.hero.subtitle,
      },
      // {
      //   name: "twitter:image",
      //   content: "https://cdn.sharkfoto.com/sharkfoto_og.png",
      // },
    ],
    link: [{ rel: "canonical", href: siteUrl }],
  };
});

// 同时设置 useSeoMeta 以确保兼容性
useSeoMeta({
  title: appConfig.homepage.hero.title,
  description: appConfig.homepage.hero.subtitle,
  ogSiteName: appConfig.seo.siteName,
  ogType: "website",
  ogLocale: "en_US",
  // ogImage: "https://cdn.sharkfoto.com/sharkfoto_og.png",
  ogUrl: appConfig.seo.url.replace(/\/$/, ""),
  ogTitle: `${appConfig.homepage.hero.title} | ${appConfig.seo.siteName} Blog`,
  ogDescription: appConfig.homepage.hero.subtitle,
  twitterCard: "summary_large_image",
  twitterUrl: appConfig.seo.url.replace(/\/$/, ""),
  twitterTitle: `${appConfig.homepage.hero.title} | ${appConfig.seo.siteName} Blog`,
  // twitterImage: "https://cdn.sharkfoto.com/sharkfoto_og.png",
  twitterSite: appConfig.seo.twitter.site,
  twitterDescription: appConfig.homepage.hero.subtitle,
});
// 获取全部文档，排除掉 id 为空的元素
const { data: allContent, pending } = await useAsyncData("all-content", () =>
  queryCollection("content")
    .all()
    .then((list) => (Array.isArray(list) ? list.filter((item) => item.id) : []))
);
console.log(allContent.value);

const getFirstImageUrl = (content) => {
  // 如果 body 是字符串（原始 Markdown/HTML）
  if (typeof content === "string") {
    const regex = /<img [^>]*src=["']([^"']*)["']|!\[[^\]]*\]\(([^)]*)\)/i;
    const match = content.match(regex);
    return match ? match[1] || match[2] : null;
  }

  // 如果 body 是 Nuxt Content 的解析对象（如 minimark）
  if (content?.type === "minimark" && Array.isArray(content.value)) {
    // 递归搜索图片节点
    const findImage = (nodes) => {
      for (const node of nodes) {
        if (node[0] === "img") {
          return node[1].src; // 返回 HTML <img> 的 src
        }
        if (node[0] === "image") {
          return node[1].url; // 返回 Markdown 图片的 URL
        }
        if (Array.isArray(node)) {
          const result = findImage(node);
          if (result) return result;
        }
      }
      return null;
    };
    return findImage(content.value);
  }

  return null;
};

// 验证图片URL是否有效
const isValidImageUrl = (url) => {
  if (!url) return false;
  return url.startsWith("http") || url.startsWith("//");
};

const DEFAULT_IMAGE_URL =
  "https://dsoh77ye4qgrq.cloudfront.net/public/images/cover-default.webp";

const articles = computed(() => {
  if (!allContent.value) return [];

  const sortConfig = appConfig.sorting.homepage;
  const sortField =
    sortConfig.sortBy === "updatedAt" ? "updatedAt" : "createdAt";
  const sortOrder = sortConfig.order === "asc" ? 1 : -1;

  return [...allContent.value]
    .sort((a, b) => {
      const aTime = new Date(a[sortField]).getTime();
      const bTime = new Date(b[sortField]).getTime();
      return (aTime - bTime) * sortOrder;
    })
    .slice(0, appConfig.homepage.sections.latest.maxItems)
    .map((article) => {
      // 封面图片
      let imageUrl = null;
      if (article.body) {
        imageUrl = getFirstImageUrl(article.body);
      }
      // 如果没有图片，则使用默认图片
      if (!imageUrl || !isValidImageUrl(imageUrl)) {
        imageUrl = DEFAULT_IMAGE_URL;
      }
      return {
        ...article,
        image: imageUrl,
      };
    });
});

// Date formatting function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
