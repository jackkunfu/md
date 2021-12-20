## 包控制
  - ^a.b.c
    - 保持主版本 a 不变，更新次版本以及补丁版本
  - ~a.b.c
    - 保持主版本 a 以及次版本 b 不变，更新补丁版本
  - 这些规则的详情如下：
    ```
      ^: 只会执行不更改最左边非零数字的更新。 如果写入的是 ^0.13.0，则当运行 npm update 时，可以更新到 0.13.1、0.13.2 等，但不能更新到 0.14.0 或更高版本。 如果写入的是 ^1.13.0，则当运行 npm update 时，可以更新到 1.13.1、1.14.0 等，但不能更新到 2.0.0 或更高版本。
      ~: 如果写入的是 〜0.13.0，则当运行 npm update 时，会更新到补丁版本：即 0.13.1 可以，但 0.14.0 不可以。
      >: 接受高于指定版本的任何版本。
      >=: 接受等于或高于指定版本的任何版本。
      <=: 接受等于或低于指定版本的任何版本。
      <: 接受低于指定版本的任何版本。
      =: 接受确切的版本。
      -: 接受一定范围的版本。例如：2.1.0 - 2.6.2。
      ||: 组合集合。例如 < 2.1 || > 2.6。
      可以合并其中的一些符号，例如 1.0.0 || >=1.1.0 <1.2.0，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本。
      无符合：只接受特定的版本
      lastest：使用最新的可用的版本
    ```

- 命令
  - npm outdated
    - 查看依赖软件包可更新的新版本
  - npm update
    - 按照 ^ ~ 等规则更新软件包
      - 不会更新主版本
  - 若要将所有软件包更新到新的主版本，则全局地安装 npm-check-updates 软件包：
    - npm i npm-check-updates -g
    - ncu -u
      - 升级 package.json 文件的 dependencies 和 devDependencies 中的所有版本，以便 npm 可以安装新的主版本
    - npm update
  
- 安装目录
  - 当前文件夹下的 node_modules 目录
  - 查看全局 -g 软件包安装目录
    - npm root -g
  - 可执行文件会放在 node_modules 下的 .bin 文件夹下
    - 运行可执行文件
      - ./node_modules/.bin/xxx 文件路径来执行
      - npx xxx
        - npx 会自动查找当前依赖包中的可执行文件，如果找不到，就会去 PATH 里找。如果依然找不到，就会安装

- npx
  - node version >= 5.2
  - npx 执行下列流程：
    - 去node_modules/.bin路径检查npx后的命令是否存在，找到之后执行；
    - 找不到，就去环境变量$PATH里面，检查npx后的命令是否存在，找到之后执行;
    - 还是找不到，自动下载一个临时的依赖包最新版本在一个临时目录，然后再运行命令，运行完之后删除，不污染全局环境。
  - --no-install 参数
    - 强制使用本地模块，不下载远程模块，如果本地不存在该模块，就会报错
  - --ignore-existing 参数
    - 忽略本地的同名模块，强制安装使用远程模块


## what happen when command npm install

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
  - 确保 npm 上没有别的开发者提交的同名都包存在

- 撤销发布

  - npm unpublish --force
  - Notice: samePakageName republished needs until 24 hours have passed. 撤销后同包名重新发布需要 24 小时之后

- 更新发布

  - 更改版本号
    - 直接修改 package.json 中的 version ---- 随意自主
    - npm version ---- 按照一定规则
      - npm version prerelease/prepatch/preminor/premajor/patch/minor/major
  - 再次执行 npm publish

- FAQ
  - 403 forbidden
    - npm config set registry https://registry.npmjs.org
    - 登录 npmjs.com 验证邮箱
    - 包名重复、VPN 梯子存在等
