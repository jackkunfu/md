# 设置变量 NODE_ENV
```
NODE_ENV=production
windows: SET NODE_ENV=production

跨系统平台：安装 cross-env
  cross-env NODE_ENV=production

vue3 项目设置 NODE_ENV
  增加 .env.modename 文件， 内容 NODE_ENV = 'production'
  "vue-cli-service build --mode modename"
```