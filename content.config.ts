import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: {
        include: "**/*.md",
        exclude: ["README.md", "SUMMARY.md"],
        // repository: "https://github.com/vanderwals/demo1/tree/main",
        repository: `https://github.com/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/tree/${process.env.GITHUB_REPO_BRANCH}`,
        authToken: process.env.GITHUB_TOKEN,
      },
      schema: z.object({
        readingTime: z.number().optional(),
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
        // Git时间戳字段
        createdAt: z.date().optional(), // 文件首次提交时间
        updatedAt: z.date().optional(), // 文件最后修改时间
      }),
    }),
  },
});
