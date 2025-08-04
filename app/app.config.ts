export default defineAppConfig({
  // 网站基本信息
  site: {
    name: "文档中心123",
    title: "文档",
    description: "这里汇集了最新、最有价值的技术文档，助您快速掌握所需知识",
    logo: {
      src: "https://dsoh77ye4qgrq.cloudfront.net/public/images/cover-default.webp",
      alt: "文档中心 Logo",
      width: 64,
      height: 64,
    },
    author: "文档中心团队",
    copyright: "© 2025",
    url: "https://your-domain.com", // 请替换为实际域名
  },

  // 主页配置
  homepage: {
    hero: {
      title: "文档",
      subtitle: "这里汇集了最新、最有价值的技术文档，助您快速掌握所需知识",
    },
    sections: {
      latest: {
        title: "最新文档",
        maxItems: 12,
      },
    },
  },

  // 导航配置
  navigation: {
    showSearch: false, // 未来可能添加搜索功能
    showColorMode: true,
  },

  // 社交媒体链接（可选）
  social: {
    github: null,
    twitter: null,
    email: null,
  },

  // 网站功能配置
  features: {
    darkMode: true,
    analytics: false, // 是否启用分析
    comments: false, // 是否启用评论
  },
});
