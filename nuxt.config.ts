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
    "nuxt-content-git",
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
    autoImport: true,
    cache: false,
  },

  ui: {
    // 禁用字体功能
    fonts: false,
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
});
