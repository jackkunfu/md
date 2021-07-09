## what happen when command npm i xxx

- 寻找当前的 pakage.json 获取 dependencies / devDependencies 信息
- 递归下载依赖包到 node_modules 目录到当前目录
  - 老版本存在依赖过深，每个依赖包所依赖的依赖包都会放在当前依赖包目录 node_modeuls 下，以及各个不同包重复依赖问题，性能较差
  - 新版本把所有的依赖包以及依赖包的依赖包统一放到项目根目录 node_modeuls 里，扁平存储，性能以及空间大小都较大提升

## import from 执行

- 查找当前 node_modules 目录里中的相关组件包
- 读取 package.json 中定义的 main 属性定义的文件路径
- 加载执行 js 导出对象

## npm publish

- 准备

  - 注册 npmjs.com 账号
  - 终端检测下是否登录 npm who am i
    - 报错
      - npm login 登录
      - npm adduser 注册 （貌似有用 不是 QQ 邮箱的报错 400）

- npm publish

  - 403 forbidden

    - npm config set registry https://registry.npmjs.org
    - 登录 npmjs.com 验证邮箱
    - 包名重复、VPN 梯子存在等

  - 撤销发布
    - npm unpublish --force
    - Notice: samePakageName republished needs until 24 hours have passed.
