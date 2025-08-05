<script setup lang="ts">
import MiniSearch from "minisearch";

const query = ref("");
const { data } = await useAsyncData("search", () =>
  queryCollectionSearchSections("content")
);

// 添加辅助函数确保ID唯一性
const ensureUniqueIds = (docs: any[]) => {
  const idCount: Record<string, number> = {};

  return docs.map((doc) => {
    // 如果发现重复ID，添加后缀使其唯一
    if (idCount[doc.id]) {
      const newId = `${doc.id}_${idCount?.[doc.id] ?? 1}`;
      idCount[doc.id] = (idCount[doc.id] ?? 0) + 1;
      return { ...doc, id: newId };
    } else {
      idCount[doc.id] = 1;
      return doc;
    }
  });
};

const miniSearch = ref<MiniSearch | null>(null);
// 实现全匹配，并让标题为最高优先级
onMounted(() => {
  // console.log("原始数据:", data.value);
  miniSearch.value = new MiniSearch({
    fields: ["title", "content", "titles"], // 可搜索字段
    storeFields: ["id", "title", "content", "titles", "level"], // 存储字段
    searchOptions: {
      prefix: false, // 关闭前缀匹配，要求全词匹配
      fuzzy: 0,      // 关闭模糊匹配，要求完全匹配
      boost: {       // 设置标题权重最高
        title: 10,
        titles: 3,
        content: 1,
      },
      combineWith: "AND", // 多词时全部匹配
    },
  });
  const uniqueData = ensureUniqueIds(toValue(data.value) || []);
  miniSearch.value.addAll(uniqueData);
});

const result = computed(() => {
  if (miniSearch.value) {
    const searchResults = miniSearch.value.search(toValue(query));
    console.log("搜索结果:", searchResults);
    return searchResults;
  }
  return [];
});

// 格式化内容预览
const formatContent = (content: string): string => {
  return content.length > 150 ? content.substring(0, 150) + "..." : content;
};
</script>

<template>
  <div>
    <!-- 搜索框 -->
    <UInput
      v-model="query"
      placeholder="搜索文档..."
      icon="i-heroicons-magnifying-glass"
      size="md"
      class="mb-4 w-full"
    >
      <!-- 清除按钮 -->
      <template #trailing>
        <button
          v-if="query"
          @click="query = ''"
          class="ml-2 text-gray-400 hover:text-primary-500 focus:outline-none"
          aria-label="清除"
        >
          ×
        </button>
      </template>
    </UInput>

    <!-- 搜索结果 -->
    <div
      v-if="query && result.length > 0"
      class="mt-2 border border-primary-500 dark:border-primary-400 rounded-lg bg-white dark:bg-gray-900 shadow max-h-80 overflow-y-auto"
    >
      <ul class="space-y-1 p-2">
        <li
          v-for="link of result"
          :key="link.id"
          class="px-3 py-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <NuxtLink :to="link.id" class="block">
            <!-- 主标题 -->
            <div class="font-medium text-sm">{{ link.title }}</div>
            <!-- 父级路径信息 -->
            <div
              v-if="link.titles && link.titles.length"
              class="text-blue-500 text-xs mt-1"
            >
              {{ link.titles.join(' > ') }}
            </div>
            <!-- 内容预览 -->
            <div class="text-gray-500 text-xs mt-1 line-clamp-2">
              {{ formatContent(link.content) }}
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- 无搜索结果提示 -->
    <div
      v-else-if="query && result.length === 0"
      class="mt-2 px-3 py-2 text-gray-500 text-sm border border-dashed border-gray-300 rounded"
    >
      未找到相关文档
    </div>
  </div>
</template>