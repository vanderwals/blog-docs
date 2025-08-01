// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  devSource: {
    cache: 10,
  },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
    },
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  ui: {
    icons: ["mdi", "heroicons"],
    // 禁用字体功能
    fonts: false,
  },
});
