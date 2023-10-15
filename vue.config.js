const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 修改成false 就是不检查了
  devServer: {
    port: 8866, // 修改为你想要的端口号
  },
})
