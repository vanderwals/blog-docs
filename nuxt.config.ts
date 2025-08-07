import fs from "fs";
import path from "path";
// 创建一个模块级别的 Promise 来管理文件时间数据的准备状态
let fileTimesPromise: Promise<any> | null = null;

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],

  colorMode: {
    classSuffix: "",
  },
  content: {
    watch: {
      hostname: "0.0.0.0",
      ws: false,
    },
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
    async "content:file:beforeParse"(ctx) {
      // 检查是否为 blog-config.md
      // console.log(ctx.file.id);
      if (ctx.file && ctx.file.id && ctx.file.id.endsWith("blog-config.md")) {
        const mdContent = ctx.file.body;
        const match = mdContent.match(/```javascript\s*([\s\S]*?)```/);
        if (match) {
          const jsStr = match[1] || "";
          try {
            // 使用 Function 构造器安全地执行 JavaScript 代码
            const config = Function(`return ${jsStr}`)();
            fs.writeFileSync(
              path.resolve(process.cwd(), "public/config.json"),
              JSON.stringify(config, null, 2),
              "utf-8"
            );
            console.log("config.json 写入成功");
          } catch (e) {
            console.error("blog-config.md 解析失败:", e);
          }
        }
        ctx.file.body = "";
        ctx.file.id = "";
        return;
      }
      if (!fileTimesPromise) {
        console.log("开始获取 GitHub 文件时间数据...");
        fileTimesPromise = (async () => {
          const { fetchRepoFileTimes } = await import(
            "./app/utils/githubFileTimes"
          );
          const cache = await fetchRepoFileTimes({
            owner: process.env.GITHUB_REPO_OWNER || "",
            repo: process.env.GITHUB_REPO_NAME || "",
            branch: process.env.GITHUB_REPO_BRANCH || "",
            token: process.env.GITHUB_TOKEN,
            sortConfig: {
              sortBy:
                (process.env.FOLDER_SORT_BY as "createdAt" | "updatedAt") ||
                "createdAt",
              order:
                (process.env.FOLDER_SORT_ORDER as "asc" | "desc") || "desc",
            },
          });

          (globalThis as any).fileTimesCache = cache;
          console.log("GitHub 文件时间数据获取完成");
          return cache;
        })();
      }
      await fileTimesPromise;
    },

    async "content:file:afterParse"(ctx) {
      await fileTimesPromise;
      if (!(globalThis as any).fileTimesCache) {
        console.warn("fileTimesCache 未准备好，跳过时间数据添加");
        return;
      }

      const { file, content } = ctx;
      const filePath = file.id.replace("content/", "");
      const times = (globalThis as any).fileTimesCache[filePath];

      if (times) {
        content.createdAt = times.createdAt;
        content.updatedAt = times.updatedAt;
      }

      // 处理路径重命名
      const routeItems = content.id.split("/");
      const newId = [];

      for (let i = 0; i < routeItems.length; i++) {
        const item = routeItems[i];
        const currentPath = routeItems.slice(0, i + 1).join("/");
        const cachePath = currentPath.replace("content/", "");

        if (i === 0 && item === "content") {
          newId.push(item);
          continue;
        }

        const cacheEntry = (globalThis as any).fileTimesCache[cachePath];
        if (cacheEntry) {
          const isFile = i === routeItems.length - 1;
          const prefix = isFile ? cacheEntry.uId : cacheEntry.dirId;
          newId.push(`${prefix}.${item}`);
        } else {
          newId.push(item);
        }
      }

      // 更新 path 以匹配新的 id 结构
      // const newPath = content.id.replace("content/", "").replace(".md", "");
      // content.path = `/${newPath}`;
      // 追加写入到jsonl文件，类似于 Python 的 a+ 模式
      fs.appendFileSync(
        path.resolve(process.cwd(), "result2.jsonl"),
        JSON.stringify(
          {
            file: file,
            content: content,
            newId: newId.join("/"),
            newStem: newId.join("/").replace(".md", "").replace("content/", ""),
          },
          null,
          2
        ) + ",\n",
        { encoding: "utf-8", flag: "a" }
      );

      content.id = newId.join("/");
      content.stem = newId.join("/").replace(".md", "").replace("content/", "");
    },
  },
  image: {
    presets: {
      cover: {
        modifiers: {
          fit: "cover",
          gravity: "auto",
          quality: 90,
          format: "webp",
        },
      },
    },
  },
  app: {
    head: {
      script: false
        ? []
        : [
            {
              src: "https://www.googletagmanager.com/gtag/js?id=G-6KWKDSXF5C",
              async: true,
            },
            {
              innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-6KWKDSXF5C');`,
            },
          ],
    },
  },
});
