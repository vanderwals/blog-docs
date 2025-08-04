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
              <!-- Logo -->
              <div v-if="appConfig.site.logo.src" class="flex-shrink-0">
                <NuxtImg
                  :src="appConfig.site.logo.src"
                  :alt="appConfig.site.logo.alt"
                  :width="appConfig.site.logo.width"
                  :height="appConfig.site.logo.height"
                  class="rounded-xl"
                />
              </div>
              <div
                v-else
                class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center"
              >
                <span class="text-gray-400 text-xs">Logo</span>
              </div>

              <!-- 网站名称 -->
              <span class="ml-3 text-xl font-bold">{{
                appConfig.site.name
              }}</span>
            </NuxtLink>
          </div>
          <div class="flex items-center">
            <ClientOnly>
              <ColorModeButton v-if="appConfig.navigation.showColorMode" />
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
          <p class="text-gray-600 dark:text-gray-400">
            {{ appConfig.site.copyright }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const appConfig = useAppConfig();
</script>
