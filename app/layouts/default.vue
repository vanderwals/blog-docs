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
            <template
              v-if="
                appConfig.navigation.links && appConfig.navigation.links.length
              "
            >
              <ul class="flex space-x-4 mr-4">
                <li v-for="link in appConfig.navigation.links" :key="link.name">
                  <a
                    :href="link.url"
                    class="text-gray-700 dark:text-gray-200 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ link.name }}
                  </a>
                </li>
              </ul>
            </template>
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
    <footer class="bg-gray-900 text-white py-6">
      <div
        class="container mx-auto px-2 sm:px-4 lg:px-6 flex flex-col items-center"
      >
        <div
          class="flex flex-col-reverse sm:flex-row flex-wrap justify-center gap-6 w-full max-w-6xl"
        >
          <!-- 左侧LOGO和标语 -->
          <div class="flex flex-col items-center min-w-[180px]">
            <div class="mb-2">
              <a :href="'/'">
                <img
                  :src="appConfig.footer.logo.src"
                  :width="appConfig.footer.logo.width"
                  :height="appConfig.footer.logo.height"
                  :alt="appConfig.footer.logo.alt"
                  class="object-contain"
                />
              </a>
            </div>
            <p class="mb-1 text-gray-300 text-xs">
              {{ appConfig.footer.slogan }}
            </p>
            <div class="copyright text-xs text-gray-400 mb-1">
              {{ appConfig.footer.copyright }}
            </div>
            <ul class="flex space-x-2 mt-1">
              <li v-for="item in appConfig.footer.social" :key="item.name">
                <a :href="item.url" target="_blank" rel="noopener noreferrer">
                  <template v-if="item.img">
                    <img
                      :src="item.img"
                      :alt="item.name"
                      width="22"
                      height="22"
                    />
                  </template>
                  <template v-else-if="item.icon">
                    <i :class="item.icon + ' text-white text-lg'" />
                  </template>
                </a>
              </li>
            </ul>
          </div>
          <!-- 右侧多列导航 -->
          <div class="flex flex-wrap flex-1 gap-3 justify-center mb-6 sm:mb-0">
            <div
              v-for="col in appConfig.footer.columns"
              :key="col.title"
              class="min-w-[110px] mb-3"
            >
              <div class="text-sm font-bold mb-2">{{ col.title }}</div>
              <div>
                <p v-for="link in col.links" :key="link.name" class="mb-1">
                  <a
                    :href="link.url"
                    class="text-gray-300 hover:text-white text-xs transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ link.name }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const appConfig = useAppConfig();
</script>
