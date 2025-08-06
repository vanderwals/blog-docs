<template>
  <button
    type="button"
    class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
    :aria-label="
      colorMode.preference === 'dark' ? '切换到浅色模式' : '切换到深色模式'
    "
    @click="toggleColorMode"
  >
    <!-- 太阳图标 (当前是浅色模式，点击切换到深色) -->
    <svg
      v-if="colorMode.preference === 'light'"
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- 月亮图标 (当前是深色模式，点击切换到浅色) -->
    <svg
      v-else
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup>
const colorMode = useColorMode();

const toggleColorMode = () => {
  // 确保切换逻辑正确
  const newMode = colorMode.preference === "dark" ? "light" : "dark";
  colorMode.preference = newMode;
};
</script>
