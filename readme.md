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

## HRM

HMR: hot module replacement 热模块替换 / 模块热替换
作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块） 
  极大提升构建速度
  
  样式文件：可以使用HMR功能：因为style-loader内部实现了~
  js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
    注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
  html文件: 默认不能使用HMR功能.同时会导致问题：html文件不能热更新了~ （不用做HMR功能）
    解决：修改entry入口，将html文件引入


## source-Map

source-map: 一种提供源代码到构建后代码映射技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）

内联 和 外部的区别：1. 外部生成了.map文件，内联则生产的map文件在js代码中 2. 内联构建速度更快


source-map：外部

inline-source-map：内联

hidden-source-map：外部

eval-source-map：内联

nosources-source-map：外部

cheap-source-map：外部

cheap-module-source-map：外部



开发环境：速度快，调试更友好
  速度快(eval>inline>cheap>...)
    eval-cheap-souce-map
    eval-source-map
  调试更友好  
    souce-map
    cheap-module-souce-map
    cheap-souce-map

  --> eval-source-map  / eval-cheap-module-souce-map

生产环境：源代码要不要隐藏? 调试要不要更友好
  内联会让代码体积变大，所以在生产环境不用内联
  nosources-source-map 全部隐藏
  hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

  --> source-map / cheap-module-souce-map



## oneOf
提神构建速度，之前每个文件都会过滤所有的loader， 通过oneof，满足一个即终止查询


## babel缓存
每次编译的时候，如果文件没有改动，则直接从缓存中读取

缓存：
    babel缓存
      cacheDirectory: true
      --> 让第二次打包构建速度更快
    文件资源缓存
      hash: 每次wepack构建时会生成一个唯一的hash值。
        问题: 因为js和css同时使用一个hash值。
          如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
      chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
        问题: js和css的hash值还是一样的
          因为css是在js中被引入的，所以同属于一个chunk
      contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样    
      --> 让代码上线运行缓存更好使用


## tree shaking

tree shaking：去除无用代码
前提：1. 必须使用ES6模块化  2. 开启production环境
作用: 减少代码体积

在package.json中配置 
"sideEffects": false 所有代码都没有副作用（都可以进行tree shaking）
问题：可能会把css / @babel/polyfill （副作用）文件干掉
"sideEffects": ["*.css", "*.less"]


## code split

1. 单入口时，可以将node_modules中代码单独打包一个chunk最终输出
2. 多入口时，自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },



## 多进程打包

开启多进程打包。 
进程启动大概为600ms，进程通信也有开销。
只有工作消耗时间比较长，才需要多进程打包

// {
//   loader: 'thread-loader',
//   // options: {
//   //   workers: 2 // 进程2个
//   // }
// },

// 懒加载~：当文件需要使用时才加载~
// 预加载 prefetch：会在使用之前，提前加载js文件 
// 正常加载可以认为是并行加载（同一时间加载多个文件）  
// 预加载 prefetch：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源


## externals

不把指定的包打包进来，需要通过cdn引用


mode: 'production',
  externals: {
    // 拒绝jQuery被打包进来
    jquery: 'jQuery'
  }
};


## dll

 使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
    当你运行 webpack 时，默认查找 webpack.config.js 配置文件
    需求：需要运行 webpack.dll.js 文件
      --> webpack --config webpack.dll.js