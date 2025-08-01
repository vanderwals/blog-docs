<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部导航栏 -->
    <header
      class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <div
                class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16"
              />
              <span class="ml-3 text-xl font-bold">文档中心</span>
            </NuxtLink>
          </div>
          <div class="flex items-center">
            <ClientOnly>
              <ColorModeButton />
            </ClientOnly>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- 底部 -->
    <footer class="bg-gray-100 dark:bg-gray-900 py-6">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center items-center">
          <p class="text-gray-600 dark:text-gray-400">© 2025</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup></script>
