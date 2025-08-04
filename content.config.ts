import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  // 添加/修改以下配置：
  nitro: {
    preset: "cloudflare_pages",
    // 防止异常压缩包
    minify: false,
    sourceMap: true,
  },
  // 禁用图标远程加载
  icon: {
    mode: "local", // 强制使用本地图标资源
  },
  collections: {
    content: defineCollection({
      type: "page",
      source: {
        include: "**/*.md",
        exclude: [
          "README.md",
          "SUMMARY.md",
          "**/*.jpg",
          "**/*.jpeg",
          "**/*.png",
          "**/*.gif",
        ],
        // repository: "https://github.com/vanderwals/demo1/tree/main",
        repository: "https://github.com/eztalksapp/sharkfoto-blog/tree/1.0",
        authToken: process.env.GITHUB_TOKEN,
      },
      schema: z.object({
        links: z
          .array(
            z.object({
              label: z.string(),
              icon: z.string(),
              to: z.string(),
              target: z.string().optional(),
              lastModified: z.date().optional(),
              author: z.string().optional(),
              cover: z.string().optional(),
              tags: z.array(z.string()).optional(),
              categories: z.array(z.string()).optional(),
              keywords: z.array(z.string()).optional(),
              description: z.string().optional(),
              authorEmail: z.string().optional(),
              authorAvatar: z.string().optional(),
            })
          )
          .optional(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
      }),
    }),
  },
});
