<template>
  <div class="table-of-contents">
    <nav class="toc-nav">
      <ul v-if="headings.length > 0" class="space-y-1">
        <li v-for="heading in headings" :key="heading.id" class="toc-item">
          <a
            :href="`#${heading.id}`"
            @click.prevent="scrollToHeading(heading.id)"
            class="toc-link"
            :class="{
              'toc-link-active': activeHeading === heading.id,
              'toc-link-h2': heading.level === 2,
              'toc-link-h3': heading.level === 3,
              'toc-link-h4': heading.level === 4,
            }"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  headings: {
    type: Array,
    default: () => [],
  },
});

const activeHeading = ref("");

// 监听 headings 变化，重置激活状态
watch(
  () => props.headings,
  () => {
    activeHeading.value = "";
    nextTick(() => {
      updateActiveHeading();
    });
  }
);

// 滚动到指定标题
const scrollToHeading = (id) => {
  if (id === "heading-0") {
    //滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    return;
  }
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

// 监听滚动，更新当前激活的标题
const updateActiveHeading = () => {
  if (!process.client) return;

  const headings = document.querySelectorAll("h2, h3, h4");
  let currentActive = "";

  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect();
    const offset = 100; // 考虑顶部导航的高度

    if (rect.top <= offset && rect.bottom > offset) {
      currentActive = heading.id;
    }
  });

  activeHeading.value = currentActive;
};

// 组件挂载后开始监听滚动
onMounted(() => {
  if (process.client) {
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    // 初始化时更新一次
    nextTick(() => {
      updateActiveHeading();
    });
  }
});

// 组件卸载时移除监听器
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("scroll", updateActiveHeading);
  }
});

// 监听路由变化，重置激活状态
watch(
  () => useRoute().path,
  () => {
    activeHeading.value = "";
    // 给一点时间让DOM更新完成
    nextTick(() => {
      setTimeout(() => {
        updateActiveHeading();
      }, 100);
    });
  }
);
</script>

<style scoped>
.table-of-contents {
  background-color: white;
  border-radius: 0.5rem;
  /* border: 1px solid #e5e7eb; */
}

.dark .table-of-contents {
  background-color: #11182700;
}

.toc-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .toc-header {
  border-bottom-color: #374151;
}

.toc-nav {
  padding: 0.75rem 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.toc-item {
  list-style: none;
}

.toc-link {
  display: block;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.toc-link:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.dark .toc-link {
  color: #9ca3af;
}

.dark .toc-link:hover {
  color: white;
  background-color: #374151;
}

.toc-link-active {
  color: #2563eb;
  background-color: #eff6ff;
  font-weight: 500;
}

.dark .toc-link-active {
  color: #60a5fa;
  background-color: rgba(59, 130, 246, 0.2);
}

.toc-link-h2 {
  font-weight: 500;
}

.toc-link-h3 {
  margin-left: 0.75rem;
  font-size: 0.75rem;
}

.toc-link-h4 {
  margin-left: 1.5rem;
  font-size: 0.75rem;
}

/* 自定义滚动条 */
.toc-nav::-webkit-scrollbar {
  width: 4px;
}

.toc-nav::-webkit-scrollbar-track {
  background: transparent;
}

.toc-nav::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 2px;
}

.toc-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.4);
}

.dark .toc-nav::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.2);
}

.dark .toc-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.4);
}
</style>
