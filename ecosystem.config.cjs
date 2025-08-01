module.exports = {
  apps: [
    {
      name: "demo", // 设置启动项目名称
      exec_mode: "cluster",
      instances: "max",
      // 注意这里的相对路径
      script: "./.output/server/index.mjs",
      time: true, // 日志显示时间戳
      env: {
        PORT: 8888, // 设置运行端口
      },
    },
  ],
};
