export default defineAppConfig({
  // 网站基本信息
  site: {
    name: "SharkFoto",
    logo: {
      src: "https://sharkfoto.gitbook.io/blog/~gitbook/image?url=https%3A%2F%2F1388671580-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FaOwWwfAj7N5yqoSr3Hlz%252Ficon%252Fh53FgFj8HlyUbme26Oed%252Fsharkfoto_ico.png%3Falt%3Dmedia%26token%3D46911ec4-eb74-4c3d-885b-017b26e3aeb3&width=32&dpr=4&quality=100&sign=ec6f5c4d&sv=2",
      alt: "SharkFoto Logo",
      width: 48,
      height: 48,
    },
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
        maxItems: 400,
      },
    },
  },

  // 导航配置
  navigation: {
    showColorMode: true,
    links: [
      { name: "Products", url: "https://sharkfoto.com/" },
      {
        name: "Image Converter",
        url: "https://sharkfoto.com/image-converter/",
      },
      { name: "Pricing", url: "https://sharkfoto.com/pricing" },
      { name: "Company", url: "https://sharkfoto.com/company" },
    ],
  },

  // 排序配置
  sorting: {
    // 主页卡片排序配置
    homepage: {
      sortBy: "createdAt", // "createdAt" | "updatedAt" - 按创建时间还是更新时间排序
      order: "desc", // "asc" | "desc" - 升序还是降序
    },
    // 文件夹ID生成排序配置
    folderId: {
      sortBy: "createdAt", // "createdAt" | "updatedAt" - 按创建时间还是更新时间排序
      order: "desc", // "asc" | "desc" - 升序还是降序
    },
  },

  // 底部配置
  footer: {
    slogan: "AI Make Photo Editing Different",
    logo: {
      src: "https://cdn.sharkfoto.com/sharkfoto_logo_white.svg",
      width: 162.5,
      height: 25,
      alt: "SharkFoto Logo",
    },
    copyright: "Copyright © 2022 SharkFoto",
    social: [
      {
        name: "Pinterest",
        icon: "iconfont icon-pinterest",
        url: "https://www.pinterest.com/sharkfoto/",
        img: null,
      },
      {
        name: "Facebook",
        icon: null,
        url: "https://www.facebook.com/SharkFoto-100253106125543",
        img: "https://cdn.sharkfoto.com/social_ico_facebook.svg",
      },
      {
        name: "Twitter",
        icon: null,
        url: "https://twitter.com/Shark_Foto",
        img: "https://cdn.sharkfoto.com/social_ico_twitter.svg",
      },
      {
        name: "LinkedIn",
        icon: null,
        url: "https://www.linkedin.com/company/sharkfoto",
        img: "https://cdn.sharkfoto.com/social_ico_linkedin.svg",
      },
    ],
    columns: [
      {
        title: "Photo AI",
        links: [
          { name: "BGRmover", url: "/bgremover/" },
          { name: "ImageColorizer", url: "/image-colorizer/" },
          { name: "ColorEnhancer", url: "/image-enhancer/" },
          { name: "ClearityEnhancer", url: "/image-enhancer/" },
          { name: "ResolutionEnhancer", url: "/image-enhancer/" },
        ],
      },
      {
        title: "Photo Tools",
        links: [
          { name: "ImageConverter", url: "/image-converter/" },
          { name: "ImageCompressor", url: "/image-compressor/" },
          { name: "ImageResizer", url: "/image-resizer/" },
          { name: "ImageCropper", url: "/image-cropper/" },
          { name: "ImageFlipper", url: "/image-flipper/" },
          { name: "ImageRotater", url: "/image-rotater/" },
          { name: "ImageEditor", url: "/app/?tool=editor" },
        ],
      },
      {
        title: "Popular Converter",
        links: [
          { name: "JPG Conveter", url: "/image-converter/jpg/" },
          { name: "PNG Conveter", url: "/image-converter/png/" },
          { name: "AVIF Conveter", url: "/image-converter/avif/" },
          { name: "WEBP Conveter", url: "/image-converter/webp/" },
          { name: "SVG Conveter", url: "/image-converter/svg/" },
          { name: "BMP Conveter", url: "/image-converter/bmp/" },
          { name: "ICO Conveter", url: "/image-converter/ico/" },
        ],
      },
      {
        title: "Resource",
        links: [
          { name: "Plan & Pricing", url: "/pricing/" },
          { name: "Help & FAQs", url: "https://sharkfoto.com/help/" },
          {
            name: "Contact Us",
            url: "https://sharkfoto.com/company/contact-us/",
          },
          { name: "Image Formats", url: "/format/" },
          {
            name: "Privacy Policy",
            url: "https://sharkfoto.com/company/trust/privacy/",
          },
          {
            name: "Terms of Use",
            url: "https://sharkfoto.com/company/trust/terms/",
          },
        ],
      },
      {
        title: "Company",
        links: [
          { name: "Sign In", url: "/sign-in/" },
          { name: "Sign Up", url: "/sign-up/" },
          { name: "About Us", url: "https://sharkfoto.com/company/" },
        ],
      },
    ],
  },
});
