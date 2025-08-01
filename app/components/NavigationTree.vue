<template>
  <ul class="space-y-1">
    <li v-for="item in items" :key="item.path">
      <!-- 有子项目的文件夹：整行可点击来展开/折叠 -->
      <div
        v-if="item.children && item.children.length > 0"
        class="flex items-center cursor-pointer"
        @click="toggleCollapse(item.path)"
      >
        <div
          :data-active="isActive(item.path) ? 'true' : undefined"
          class="flex-1 px-3 py-2 rounded-md transition-colors flex items-center"
          :class="{
            'bg-gray-50 dark:bg-gray-800 font-medium': isActive(item.path),
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
          <span class="truncate">{{ item.title }}</span>
        </div>
      </div>

      <!-- 没有子项目的叶子节点：可以点击导航 -->
      <div v-else class="flex items-center">
        <NuxtLink
          :data-active="isActive(item.path) ? 'true' : undefined"
          :to="item.path"
          class="flex-1 px-3 py-2 rounded-md transition-colors block truncate"
          :class="{
            'bg-gray-50 dark:bg-gray-800 font-medium': isActive(item.path),
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
        <NavigationTree :items="item.children" class="ml-4 mt-1" />
      </div>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const collapsedItems = ref(new Set());

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
    const activeElement = document.querySelector('[data-active="true"]');
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
            behavior: "smooth",
          });
        }
      } else {
        // 如果没有找到滚动容器，使用默认的 scrollIntoView
        activeElement.scrollIntoView({
          behavior: "smooth",
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
