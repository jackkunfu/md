- 文件
  - 文件头
    - 常见文件文件头
      - zip: 50 4b 0304 
      - png: 89 50 4e 47
  - 文件体
  - 文件尾
    - 文件尾后面增加一些数据，文件正常显示的时候不会显示出来


- 文件查看工具
  - 010 editor 工具
    - 打开文件自动安装相应模板展示数据高亮
    - 变量
      - chunk[0]
        - width heigh crc
      - jpg 文件宽高在sofx 里的 Y X
    - 可以根据文件文件头，看下文件原始是什么格式
      - 改回相应的后缀就可以显示原本的数据

- 文档隐写
  - word 隐藏文字功能
    - 文件 选项 视图 勾选上隐藏文字选项
  - 后缀篡改
    - 010 工具打开文件，看下文件原本的文件头对应的文件格式后缀
      - 对应真实后缀，改回真实后缀

- pdf 隐写
  - 直接打开无有效信息
  - 010 工具打开
    - 打开会发现很多 20  09  的数据，表明是个pdf隐写文件
    - 可以看下文件尾后面是否有隐藏数据
  - 工具解密
    - wbstego43open

- 图片隐写
  - 文件尾后面增加隐藏信息
    - 010 工具看下文件尾后面的内容
  - 制作图片隐写
    - copy 

- 盲水印
  - 一般会给两张十分相似的图片
  - 工具处理
    - python ./bwm.py decode file1 file2 new_file

- 压缩包
  - 伪加密 打开需要密码
  - 