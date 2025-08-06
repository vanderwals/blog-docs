<script setup>
const route = useRoute();
const isMobileNavOpen = ref(false);
const isTocVisible = ref(false);

// 获取主题配置
const config = useAppConfig();
const theme = computed(() => config.theme);

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

// 提取页面标题用于目录
const pageHeadings = ref([]);

// 提取标题的函数
const extractHeadings = () => {
  if (!process.client) return;

  const headings = document.querySelectorAll("h2, h3, h4");
  const extracted = [];

  headings.forEach((heading, index) => {
    // 如果没有id，生成一个
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }

    extracted.push({
      id: heading.id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
    });
  });

  // 添加页面标题作为第一个标题
  if (page.value?.title) {
    extracted.unshift({
      id: "heading-0",
      text: page.value.title,
      level: 1,
    });
  }

  pageHeadings.value = extracted;
  console.log("提取的标题:", pageHeadings.value);
};

// 监听内容变化，重新提取标题
watch(
  () => processedPage.value,
  () => {
    nextTick(() => {
      extractHeadings();
    });
  },
  { immediate: true }
);

// 监听路由变化，重新提取标题
watch(
  () => route.path,
  () => {
    // 清空当前标题
    pageHeadings.value = [];
    // 等待内容渲染完成后重新提取
    nextTick(() => {
      setTimeout(() => {
        extractHeadings();
      }, 100); // 给一点时间让DOM完全渲染
    });
  }
);

// 响应式控制目录显示
const toggleToc = () => {
  if (isTocVisible.value) {
    isTocVisible.value = false;
  } else {
    // 打开目录时关闭导航
    isMobileNavOpen.value = false;
    isTocVisible.value = true;
  }
};

// 关闭目录
const closeToc = () => {
  isTocVisible.value = false;
};

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

// 日期格式化函数，返回“多久之前”，英文
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // 秒

  if (diff < 60) {
    return `${diff} seconds ago`;
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diff / 31536000);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

// 切换移动端导航
const toggleMobileNav = () => {
  if (isMobileNavOpen.value) {
    isMobileNavOpen.value = false;
  } else {
    // 打开导航时关闭目录
    isTocVisible.value = false;
    isMobileNavOpen.value = true;
  }
};

// 关闭移动端导航
const closeMobileNav = () => {
  isMobileNavOpen.value = false;
};

// 监听路由变化，自动关闭移动端导航和目录
watch(
  () => route.path,
  () => {
    if (isMobileNavOpen.value) {
      closeMobileNav();
    }
    if (isTocVisible.value) {
      closeToc();
    }
  }
);

// 监听ESC键关闭导航和目录
onMounted(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      if (isMobileNavOpen.value) {
        closeMobileNav();
      }
      if (isTocVisible.value) {
        closeToc();
      }
    }
  };

  document.addEventListener("keydown", handleEsc);

  // 确保在组件挂载后提取标题
  nextTick(() => {
    setTimeout(() => {
      extractHeadings();
    }, 100);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handleEsc);
  });
});
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <!-- 移动端导航按钮 -->
    <button
      @click="toggleMobileNav"
      class="mobile-nav-toggle lg:hidden"
      :aria-label="isMobileNavOpen ? '关闭导航' : '打开导航'"
    >
      <Icon
        :name="isMobileNavOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
        class="mobile-nav-toggle-icon"
      />
    </button>

    <!-- 移动端目录按钮 -->
    <button
      @click="toggleToc"
      class="mobile-toc-toggle lg:hidden"
      :aria-label="isTocVisible ? '隐藏目录' : '显示目录'"
    >
      <Icon name="i-heroicons-list-bullet" class="mobile-toc-toggle-icon" />
    </button>

    <!-- 移动端导航遮罩 -->
    <div
      class="mobile-nav-overlay lg:hidden"
      :class="{ active: isMobileNavOpen || isTocVisible }"
      @click="
        closeMobileNav();
        closeToc();
      "
    ></div>

    <!-- 移动端侧边栏 -->
    <aside
      class="mobile-nav-sidebar lg:hidden"
      :class="{ active: isMobileNavOpen }"
    >
      <div class="space-y-6">
        <!-- 文档树导航 -->
        <div
          class="top-20 rounded-lg bg-transparent p-4 max-h-[calc(100vh-150px)] overflow-y-auto navigation-container"
          data-scrollable="navigation"
        >
          <NavigationTree
            :items="navigation"
            nav-type="mobile"
            :show-search="true"
          />
        </div>
      </div>
    </aside>

    <!-- 移动端目录侧边栏 -->
    <aside
      class="mobile-toc-sidebar lg:hidden"
      :class="{ active: isTocVisible }"
    >
      <TableOfContents :headings="pageHeadings" />
    </aside>

    <div class="flex flex-col lg:flex-row">
      <!-- 桌面端左侧导航栏 -->
      <aside
        class="hidden lg:block lg:w-64 flex-shrink-0 lg:sticky lg:top-20 lg:h-screen lg:overflow-y-auto"
      >
        <div class="space-y-6">
          <!-- 文档树导航 -->
          <div
            class="rounded-lg bg-white dark:bg-gray-900 p-4 max-h-[calc(100vh-150px)] overflow-y-auto navigation-container"
            data-scrollable="navigation"
          >
            <NavigationTree :items="navigation" nav-type="desktop" />
          </div>
        </div>
      </aside>

      <!-- 中间内容区和右侧目录栏的容器 -->
      <div class="flex flex-col xl:flex-row flex-grow min-w-0">
        <!-- 中间内容区 -->
        <main class="flex-grow min-w-0 lg:pl-8 xl:pr-8 py-8 mobile-content">
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
                  <span v-if="page.updatedAt" class="flex items-center">
                    <Icon
                      name="i-heroicons-clock-20-solid"
                      class="w-4 h-4 mr-1"
                    />
                    Last updated {{ formatDate(page.updatedAt) }}
                  </span>
                </div>
              </div>
            </template>

            <!-- 内容渲染 -->
            <div
              class="prose prose-gray dark:prose-invert max-w-none custom-prose"
            >
              <ContentRenderer :value="processedPage" v-if="processedPage" />
            </div>

            <template #footer>
              <div v-if="prev || next" class="pt-6 border-t">
                <div
                  class="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4"
                >
                  <!-- 上一篇卡片 -->
                  <NuxtLink v-if="prev" :to="prev.path" class="block">
                    <UCard
                      class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors h-full"
                    >
                      <div class="flex items-center space-x-2 sm:space-x-3">
                        <UIcon
                          name="i-heroicons-arrow-left"
                          class="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5"
                        />
                        <div class="min-w-0 flex-1">
                          <div
                            class="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                          >
                            Previous
                          </div>
                          <div
                            class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate"
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
                      <div
                        class="flex items-center justify-between space-x-2 sm:space-x-3"
                      >
                        <div class="min-w-0 flex-1 text-right sm:text-left">
                          <div
                            class="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                          >
                            Next
                          </div>
                          <div
                            class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate"
                          >
                            {{ next.title }}
                          </div>
                        </div>
                        <UIcon
                          name="i-heroicons-arrow-right"
                          class="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5"
                        />
                      </div>
                    </UCard>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </UCard>
        </main>

        <!-- 桌面端右侧目录栏 -->
        <aside
          class="hidden xl:block xl:w-80 flex-shrink-0 xl:sticky xl:top-20 xl:h-screen xl:overflow-y-auto"
        >
          <div class="space-y-6">
            <TableOfContents :headings="pageHeadings" />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-prose :deep(a) {
  color: v-bind("theme.primary");
  text-decoration: none;
  transition: color 0.2s ease;
}

.custom-prose :deep(a:hover) {
  color: v-bind("theme.primary");
  text-decoration: underline;
}

.custom-prose :deep(a:visited) {
  color: v-bind("theme.primary");
}
</style>
