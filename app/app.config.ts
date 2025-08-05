export default defineAppConfig({
  // 网站基本信息
  site: {
    name: "SharkFoto",
    title: "SharkFoto Blog",
    description:
      "Product updates, photography and editing tips, and industry news",
    logo: {
      src: "https://sharkfoto.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F1388671580-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FaOwWwfAj7N5yqoSr3Hlz%252Ficon%252Fh53FgFj8HlyUbme26Oed%252Fsharkfoto_ico.png%3Falt%3Dmedia%26token%3D46911ec4-eb74-4c3d-885b-017b26e3aeb3&width=32&dpr=4&quality=100&sign=ec6f5c4d&sv=2",
      alt: "SharkFoto Logo",
      width: 48,
      height: 48,
    },
    author: "SharkFoto Logo",
    copyright: "© 2025",
    url: "https://your-domain.com", // 请替换为实际域名
  },

  // 主题色配置
  theme: {
    primary: "#8B5CF6", // 紫色
    navigationActive: "#EDE9FE", // 浅紫色
    navigationActiveDark: "#5B21B6", // 深紫色
  },

  // 主页配置
  homepage: {
    hero: {
      title: "The SharkFoto Blog",
      subtitle:
        "Product updates, photography and editing tips, and industry news",
    },
    sections: {
      latest: {
        title: "",
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
