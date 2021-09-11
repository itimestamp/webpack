- 提取css文件
mini-css-extract-plugin 提取js中的css文件，通过link标签插入到html中，提前插入好，
style-loader是通过js动态插入的，所以会导致闪屏的现象

- css兼容性处理
css兼容性处理：postcss --> postcss-loader postcss-preset-env

帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式


- 压缩css
optimize-css-assets-webpack-plugin

- js代码检查
需要下载4个包 eslint-loader  eslint  eslint-config-airbnb-base  eslint-plugin-import
语法检查： eslint-loader  eslint
airbnb --> eslint-config-airbnb-base  eslint-plugin-import

- js兼容性处理
js兼容性处理：babel-loader @babel/core 
1. 基本js兼容性处理 --> @babel/preset-env
    问题：只能转换基本语法，如promise高级语法不能转换
2. 全部js兼容性处理 --> @babel/polyfill  
    问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
3. 需要做兼容性处理的就做：按需加载  --> core-js

- html压缩
html-webpack-plugin


- 性能优化

开发环境性能优化
* 优化打包构建速度->HMR
* 优化代码调试->source-map

生产环境性能优化
* 优化打包构建速度
  * oneOf
  * babel缓存
  * 多进程打包
  * externals
  * dll
* 优化代码运行的性能
  * 缓存(hash-chunkhash-contenthash)
  * tree shaking
  * code split
  * 懒加载/预加载
  * pwa