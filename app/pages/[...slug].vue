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
// console.log(page.value);
// 获取上一篇和下一篇
const { data: surroundings } = await useAsyncData("surroundings", () => {
  return queryCollectionItemSurroundings("content", route.path, {
    fields: ["path", "title"],
  });
});
const prev = computed(() => surroundings.value?.prev);
const next = computed(() => surroundings.value?.next);

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
            <div class="mt-4 flex items-center text-sm text-gray-500">
              <span v-if="page.date"
                >最后更新: {{ formatDate(page.date) }}</span
              >
              <span v-if="page.date && page.readingTime?.text" class="mx-2"
                >•</span
              >
              <span v-if="page.readingTime?.text">{{
                page.readingTime.text
              }}</span>
            </div>
          </template>

          <!-- 内容渲染 -->
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <ContentRenderer :value="page" v-if="page" />
          </div>

          <template #footer>
            <div
              v-if="prev || next"
              class="flex justify-between items-center pt-6 border-t"
            >
              <UButton
                v-if="prev"
                :to="prev.path"
                :label="prev.title"
                icon="i-heroicons-arrow-left"
                variant="outline"
              />
              <div v-else></div>
              <UButton
                v-if="next"
                :to="next.path"
                :label="next.title"
                trailing-icon="i-heroicons-arrow-right"
                variant="outline"
              />
            </div>
          </template>
        </UCard>
      </main>
    </div>
  </div>
</template>
