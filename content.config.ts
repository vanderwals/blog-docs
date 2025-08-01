import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: {
        include: "**/*.md",
        // exclude: ["index.md", "**/*.jpg", "**/*.jpeg", "**/*.png", "**/*.gif"],
        repository: "https://github.com/vanderwals/demo1/tree/main",
        // authToken: process.env.GITHUB_TOKEN,
      },
      schema: z.object({
        links: z
          .array(
            z.object({
              label: z.string(),
              icon: z.string(),
              to: z.string(),
              target: z.string().optional(),
            })
          )
          .optional(),
      }),
    }),
  },
});
