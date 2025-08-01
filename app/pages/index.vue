<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">文档</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        这里汇集了最新、最有价值的技术文档，助您快速掌握所需知识
      </p>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else>
      <h2 class="text-2xl font-bold mb-6">最新文档</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="article in articles"
          :key="article.path"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <NuxtLink :to="article.path" class="block">
            <div class="p-6">
              <div
                v-if="article.image"
                class="aspect-video overflow-hidden rounded-lg mb-4"
              >
                <NuxtImg
                  :src="article.image"
                  :alt="article.title"
                  class="w-full h-full object-cover"
                  width="400"
                  height="225"
                />
              </div>
              <div
                v-else
                class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4"
              />
              <h3 class="text-xl font-bold line-clamp-2">
                {{ article.title }}
              </h3>

              <p
                class="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 mt-4"
              >
                {{ article.description || "暂无描述" }}
              </p>

              <div
                class="flex justify-between items-center text-sm text-gray-500 mt-4"
              >
                <span>{{ formatDate(article.meta.date) }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取最新的10篇文档
const { data: allContent } = await useAsyncData("all-content", () =>
  queryCollection("content").all()
);
const pending = false;

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
        // console.log(node)
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

const articles = computed(() => {
  if (!allContent.value) return [];

  return [...allContent.value]
    .sort((a, b) => new Date(b.meta?.date) - new Date(a.meta?.date))
    .slice(0, 6)
    .map((article) => ({
      ...article,
      image: article.body
        ? getFirstImageUrl(article.body)
        : "https://cdn.sharkfoto.com/sharkfoto-logo.svg",
    }));
});

// 日期格式化函数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
