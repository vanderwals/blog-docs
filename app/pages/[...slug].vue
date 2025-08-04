<script setup>
const route = useRoute();
const searchTerm = ref("");

// 获取导航树
const { data: navigation } = await useAsyncData("navigation", () => {
  return queryCollectionNavigation("content");
});

// 获取当前页面内容
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection("content").path(route.path).first();
});
console.log(page.value);
// 去除内容中的一级标题
const processedPage = computed(() => {
  if (!page.value) return null;

  // 创建页面副本
  const processed = { ...page.value };

  // 处理 body 内容，去除一级标题
  for (const node of processed.body.value) {
    // console.log(node);
    if (node[0] === "h1") {
      // 删除该节点
      processed.body.value.splice(node, 1);
    }
  }

  return processed;
});

// console.log(page.value);
// 获取上一篇和下一篇
const { data: surroundings } = await useAsyncData(
  `surround-${route.path}`,
  () => {
    return queryCollectionItemSurroundings("content", route.path, {
      fields: ["path", "title"],
    });
  }
);

const prev = computed(() => surroundings.value?.[0]);
const next = computed(() => surroundings.value?.[1]);

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

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col lg:flex-row">
      <!-- 左侧导航栏 -->
      <aside
        class="lg:w-64 flex-shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:py-8"
      >
        <div class="space-y-6">
          <!-- 搜索框 -->
          <UInput
            v-model="searchTerm"
            placeholder="搜索文档..."
            icon="i-heroicons-magnifying-glass"
            size="md"
            class="mb-6"
          />
          <!-- 文档树导航 -->
          <div
            class="rounded-lg bg-white dark:bg-gray-900 p-4 max-h-[calc(100vh-150px)] overflow-y-auto"
            data-scrollable="navigation"
          >
            <NavigationTree :items="navigation" />
          </div>
        </div>
      </aside>
      <!-- 右侧内容区 -->
      <main class="flex-grow min-w-0 lg:pl-8 py-8">
        <UCard v-if="page" class="w-full">
          <template #header>
            <h1 class="text-3xl font-bold">{{ page.title }}</h1>
            <div
              v-if="page.description"
              class="mt-2 text-gray-600 dark:text-gray-400"
            >
              {{ page.description }}
            </div>
            <div
              class="mt-4 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-2"
            >
              <!-- Git提取的时间信息 -->
              <div class="flex items-center flex-wrap gap-2">
                <span v-if="page.createdAt" class="flex items-center">
                  <Icon
                    name="i-heroicons-calendar-20-solid"
                    class="w-4 h-4 mr-1"
                  />
                  创建: {{ formatDate(page.createdAt) }}
                </span>
                <span v-if="page.createdAt && page.updatedAt" class="mx-2"
                  >•</span
                >
                <span v-if="page.updatedAt" class="flex items-center">
                  <Icon
                    name="i-heroicons-clock-20-solid"
                    class="w-4 h-4 mr-1"
                  />
                  更新: {{ formatDate(page.updatedAt) }}
                </span>
                <!-- 备用方案：显示frontmatter中的date字段 -->
                <span
                  v-if="!page.createdAt && !page.updatedAt && page.date"
                  class="flex items-center"
                >
                  <Icon
                    name="i-heroicons-clock-20-solid"
                    class="w-4 h-4 mr-1"
                  />
                  最后更新: {{ formatDate(page.date) }}
                </span>
              </div>
              <span
                v-if="
                  (page.createdAt || page.updatedAt || page.date) &&
                  page.readingTime?.text
                "
                class="mx-2 hidden sm:inline"
                >•</span
              >
              <span v-if="page.readingTime?.text" class="flex items-center">
                <Icon
                  name="i-heroicons-book-open-20-solid"
                  class="w-4 h-4 mr-1"
                />
                {{ page.readingTime.text }}
              </span>
            </div>
          </template>

          <!-- 内容渲染 -->
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <ContentRenderer :value="processedPage" v-if="processedPage" />
          </div>

          <template #footer>
            <div v-if="prev || next" class="pt-6 border-t">
              <div class="grid gap-4 sm:grid-cols-2">
                <!-- 上一篇卡片 -->
                <NuxtLink v-if="prev" :to="prev.path" class="block">
                  <UCard
                    class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors h-full"
                  >
                    <div class="flex items-center space-x-3">
                      <UIcon
                        name="i-heroicons-arrow-left"
                        class="flex-shrink-0"
                      />
                      <div class="min-w-0">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          上一篇
                        </div>
                        <div
                          class="font-medium text-gray-900 dark:text-white truncate"
                        >
                          {{ prev.title }}
                        </div>
                      </div>
                    </div>
                  </UCard>
                </NuxtLink>

                <!-- 占位符，当没有上一篇时 -->
                <div v-else class="hidden sm:block"></div>

                <!-- 下一篇卡片 -->
                <NuxtLink v-if="next" :to="next.path" class="block">
                  <UCard
                    class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors h-full"
                  >
                    <div class="flex items-center justify-between space-x-3">
                      <div class="min-w-0 text-right sm:text-left">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          下一篇
                        </div>
                        <div
                          class="font-medium text-gray-900 dark:text-white truncate"
                        >
                          {{ next.title }}
                        </div>
                      </div>
                      <UIcon
                        name="i-heroicons-arrow-right"
                        class="flex-shrink-0"
                      />
                    </div>
                  </UCard>
                </NuxtLink>
              </div>
            </div>
          </template>
        </UCard>
      </main>
    </div>
  </div>
</template>
