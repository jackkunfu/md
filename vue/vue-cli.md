- version 3.x
  - 优化打包优化配置
    - noParsse: /^(vue|vue-router|vuex)/
    - 开启 thread-loader 多线程打包编译
      - 设置 parallel: true
    - splitChunks
      - 拆分/合并库
      ```
        optimization = {
          splitChunks: {
            chunks: 'all',
            minChunks: 2, // 设置 chunks 两次以上引用才拆分
            cacheGroups: {
              // 合并较小的库
              others: {
                name: 'others',
                test: /[\\/]node_modules[\\/](js-base64|moment|axios)[\\/]/,
                priority: 10,
                minChunks: 1 // 有一处引用就单独打包出来， 优先级大于总的 minChunks 设置
              },
              // 大文件拆
              echart_vue_echarts: {
                name: 'echart_vue_echarts',
                test: /[\\/]node_modules[\\/](echarts|vue-echarts)[\\/]/,
                priority: 10,
                minChunks: 1 // 有一处引用就单独打包出来， 优先级大于总的 minChunks 设置
              },
              // 其他库的按需配置
            }
          }
        }
      ```
    - gzip生成
      ```
        const CompressionPlugin = require('conpress-webpack-plugin')
        config.plugins.push(new CompressionPlugin({
          test:/\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false // 不删除源文件
        }))
      ```
