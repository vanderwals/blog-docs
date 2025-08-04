// https://nuxt.com/docs/api/configuration/nuxt-config

// 创建一个模块级别的 Promise 来管理文件时间数据的准备状态
let fileTimesPromise: Promise<any> | null = null;

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/content",
    "nuxt-content-git",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],

  colorMode: {
    classSuffix: "",
  },

  ui: {
    // 禁用字体功能
    fonts: false,
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  hooks: {
    // 在内容文件解析之前准备数据
    async "content:file:beforeParse"() {
      // 如果还没有开始获取数据，则开始获取
      if (!fileTimesPromise) {
        console.log("开始获取 GitHub 文件时间数据...");

        fileTimesPromise = (async () => {
          const { fetchRepoFileTimes } = await import(
            "./app/utils/githubFileTimes"
          );
          const cache = await fetchRepoFileTimes({
            owner: "eztalksapp",
            repo: "sharkfoto-blog",
            branch: "1.0",
            token: process.env.GITHUB_TOKEN,
          });

          (globalThis as any).fileTimesCache = cache;
          console.log("GitHub 文件时间数据获取完成");
          console.log(cache);
          return cache;
        })();
      }

      // 等待数据准备就绪
      await fileTimesPromise;
    },
    async "content:file:afterParse"(ctx) {
      // 确保文件时间数据已准备就绪
      if (fileTimesPromise) {
        await fileTimesPromise;
      }

      // 检查 fileTimesCache 是否存在
      if (!(globalThis as any).fileTimesCache) {
        console.warn("fileTimesCache 未准备好，跳过时间数据添加");
        return;
      }

      console.log("开始处理内容文件...");
      // 添加时间数据到解析内容
      const { file, content } = ctx;
      const filePath = file.id.replace("content/", "");
      const times = (globalThis as any).fileTimesCache[filePath];
      if (times) {
        content.createdAt = times.createdAt;
        content.updatedAt = times.updatedAt;
        console.log(`已为 ${filePath} 添加时间数据`);
      } else {
        console.warn(`未找到 ${filePath} 的时间数据`);
      }
    },
  },
});
