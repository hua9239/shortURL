const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_TARGET || 'http://express:3000',
        changeOrigin: true
      }
    }
  }
})
