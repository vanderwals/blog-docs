<template>
  <div>
    <!-- 搜索框 - 只在最顶层显示 -->
    <MiniSearchExample v-if="showSearch" />

    <ul
      class="space-y-1"
      :class="{
        'border-l border-gray-200 dark:border-gray-700 ml-2 pl-2': !isTopLevel,
      }"
    >
      <li v-for="item in filteredItems" :key="item.path">
        <!-- 有子项目的文件夹：整行可点击来展开/折叠 -->
        <div
          v-if="item.children && item.children.length > 0"
          class="flex items-center cursor-pointer"
          @click="toggleCollapse(item.path)"
        >
          <div
            :data-active="isActive(item.path) ? 'true' : undefined"
            :data-nav-type="navType"
            class="flex-1 px-3 py-2 rounded-md transition-colors flex items-center"
            :class="{
              'navigation-active': isActive(item.path),
              'hover:bg-gray-100 dark:hover:bg-gray-800': !isActive(item.path),
            }"
          >
            <Icon
              :name="
                collapsedItems.has(item.path)
                  ? 'i-heroicons-chevron-right'
                  : 'i-heroicons-chevron-down'
              "
              class="w-4 h-4 mr-2 flex-shrink-0"
            />
            <span>{{ item.title }}</span>
          </div>
        </div>

        <!-- 没有子项目的叶子节点：可以点击导航 -->
        <div v-else class="flex items-center">
          <NuxtLink
            :data-active="isActive(item.path) ? 'true' : undefined"
            :data-nav-type="navType"
            :to="item.path"
            class="flex-1 px-3 py-2 rounded-md transition-colors block"
            :class="{
              'navigation-active': isActive(item.path),
              'hover:bg-gray-100 dark:hover:bg-gray-800': !isActive(item.path),
            }"
          >
            {{ item.title }}
          </NuxtLink>
        </div>

        <!-- 子项目容器 -->
        <div
          v-if="item.children && item.children.length > 0"
          :class="{ hidden: collapsedItems.has(item.path) }"
        >
          <NavigationTree
            :items="item.children"
            :nav-type="navType"
            :show-search="false"
            :search-term="effectiveSearchTerm"
            :is-top-level="false"
            class="ml-4 mt-1"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  navType: {
    type: String,
    default: "desktop", // 'desktop' 或 'mobile'
  },
  showSearch: {
    type: Boolean,
    default: true, // 默认显示搜索框
  },
  searchTerm: {
    type: String,
    default: "", // 从父组件传递的搜索词
  },
  isTopLevel: {
    type: Boolean,
    default: true, // 是否是顶层导航
  },
});

const route = useRoute();
const collapsedItems = ref(new Set());
const localSearchTerm = ref("");

// 使用父组件传递的搜索词或本地搜索词
const effectiveSearchTerm = computed(() => {
  return props.searchTerm || localSearchTerm.value;
});

// 获取主题配置
const config = useAppConfig();
const theme = computed(() => config.theme);

// 过滤项目函数
const filterItems = (items, term) => {
  if (!term) return items;

  return items
    .filter((item) => {
      // 检查当前项目是否匹配
      const currentMatches = item.title
        .toLowerCase()
        .includes(term.toLowerCase());

      // 检查子项目是否匹配
      let childrenMatch = false;
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterItems(item.children, term);
        childrenMatch = filteredChildren.length > 0;
      }

      return currentMatches || childrenMatch;
    })
    .map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterItems(item.children, term),
        };
      }
      return item;
    });
};

// 计算过滤后的项目
const filteredItems = computed(() => {
  return filterItems(props.items, effectiveSearchTerm.value);
});

const isActive = (path) => {
  return route.path.startsWith(path);
};

const toggleCollapse = (path) => {
  if (collapsedItems.value.has(path)) {
    collapsedItems.value.delete(path);
  } else {
    collapsedItems.value.add(path);
  }
};

// 自动展开包含激活项的父级路径
const expandActiveParents = (items, currentPath) => {
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      // 检查当前路径是否在这个分支下
      if (currentPath.startsWith(item.path)) {
        collapsedItems.value.delete(item.path);
        expandActiveParents(item.children, currentPath);
      }
    }
  }
};

// 滚动到激活的元素
const scrollToActiveItem = () => {
  // 只在客户端执行
  if (!process.client) return;

  // 使用 setTimeout 确保 DOM 完全更新和路由过渡完成
  setTimeout(() => {
    // 选出所有激活元素
    const activeElements = Array.from(
      document.querySelectorAll(
        `[data-active="true"][data-nav-type="${props.navType}"]`
      )
    );
    if (activeElements.length === 0) return;

    // 选出最深层的激活元素
    let deepestElement = activeElements[0];
    let maxDepth = 0;
    for (const el of activeElements) {
      let depth = 0;
      let parent = el;
      while (parent) {
        parent = parent.parentElement;
        if (parent && activeElements.includes(parent)) {
          depth++;
        }
      }
      if (depth >= maxDepth) {
        maxDepth = depth;
        deepestElement = el;
      }
    }

    const activeElement = deepestElement;
    if (activeElement) {
      // 找到可滚动的父容器
      const scrollableParent = activeElement.closest(
        ".overflow-y-auto, .overflow-auto, [data-scrollable]"
      );

      if (scrollableParent) {
        // 计算元素相对于滚动容器的位置
        const containerRect = scrollableParent.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();

        // 检查元素是否在可视区域内
        const isInView =
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom;

        if (!isInView) {
          // 滚动到元素，使其居中显示
          const containerScrollTop = scrollableParent.scrollTop;
          const elementOffsetTop = activeElement.offsetTop;
          const containerHeight = scrollableParent.clientHeight;
          const elementHeight = activeElement.clientHeight;

          const scrollTo =
            elementOffsetTop - containerHeight / 2 + elementHeight / 2;

          scrollableParent.scrollTo({
            top: scrollTo,
            behavior: "auto",
          });
        }
      } else {
        // 如果没有找到滚动容器，使用默认的 scrollIntoView
        activeElement.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, 300); // 给路由过渡留足时间
};

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    expandActiveParents(props.items, newPath);
    scrollToActiveItem();
  },
  { immediate: true }
);

// 组件挂载后滚动到激活项
onMounted(() => {
  expandActiveParents(props.items, route.path);
  scrollToActiveItem();
});
</script>

<style scoped>
/* 导航树整体字体样式 */
ul {
  font-size: 0.875rem; /* 14px */
  font-weight: normal;
}

/* 导航项字体样式 */
ul li div,
ul li a {
  font-size: 0.875rem; /* 14px */
  font-weight: normal;
}

/* 子层级的细竖线样式 */
ul.border-l {
  border-left-width: 1px;
  border-left-color: rgb(229 231 235); /* gray-200 */
}

.dark ul.border-l {
  border-left-color: rgb(55 65 81); /* gray-700 */
}

.navigation-active {
  background-color: v-bind("theme.navigationActive") !important;
  font-weight: normal; /* 去掉加粗 */
}

.dark .navigation-active {
  background-color: v-bind("theme.navigationActiveDark") !important;
}
</style>
