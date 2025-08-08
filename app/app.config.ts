export default defineAppConfig({
  site: {
    name: "",
    logo: {
      src: "",
      alt: "",
      width: 0,
      height: 0,
      to: "",
    },
  },
  seo: {
    siteName: "",
    url: "",
    twitter: {
      site: "",
    },
  },
  theme: {
    primary: "",
    navigationActive: "",
    navigationActiveDark: "",
  },
  homepage: {
    hero: {
      title: "",
      subtitle: "",
    },
    sections: {
      latest: {
        title: "",
        maxItems: 0,
      },
    },
  },
  navigation: {
    showColorMode: true,
    links: [],
  },
  sorting: {
    homepage: {
      sortBy: "",
      order: "",
    },
    folderId: {
      sortBy: "",
      order: "",
    },
  },
  footer: {
    slogan: "",
    logo: {
      src: "",
      width: 0,
      height: 0,
      alt: "",
    },
    copyright: "",
    social: [],
    columns: [],
  },
  creatiFooter: {
    // 新增的脚部配置
    alternative: {
      copyright: "© 2025 Creati.ai. All rights reserved.",
      links: [
        { name: "Discovery", url: "/discovery/" },
        { name: "Blog", url: "https://creati.ai/blog/" },
        { name: "About Us", url: "https://creati.ai/company/" },
        { name: "Contact Us", url: "https://creati.ai/company/contact-us/" },
        { name: "Terms", url: "https://creati.ai/company/terms-of-service/" },
        {
          name: "Privacy Policy",
          url: "https://creati.ai/company/privacy-policy/",
        },
      ],
      social: [
        {
          name: "Facebook",
          url: "https://www.facebook.com/creatiai",
          icon: "icon-creatiFacebook",
        },
        {
          name: "Twitter",
          url: "https://x.com/CreatiAI",
          icon: "icon-creatix-twitter",
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/company/creatiai",
          icon: "icon-creatilinkedin",
        },
      ],
    },
  },
});
