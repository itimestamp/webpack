const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 设置nodejs环境变量
// process.env.NODE_ENV = 'development';

const commonCssLoaders = [
  // 这个loader取代style-loader。作用：提取js中的css成单独文件
  MiniCssExtractPlugin.loader,
  // 将css文件整合到js文件中
  'css-loader',
  /*
    css兼容性处理：postcss --> postcss-loader postcss-preset-env

    帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

    "browserslist":
    // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
    "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
    ],
    // 生产环境：默认是看生产环境
    "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
    ]
    */
  // 使用loader的默认配置
  // 'postcss-loader',
  // 修改loader的配置
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            'postcss-preset-env',
            {
              ident: 'postcss',
            },
          ],
        ],
      },
    },
  },
];

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      // {
      //     test: /\.css$/,
      //     use: [
      //         // use数组中loader执行顺序：从右到左，从下到上 依次执行
      //         // 创建style标签，将js中的样式资源插入进行，添加到head中生效
      //         'style-loader',
      //         // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
      //         'css-loader'
      //     ],
      //     // outputPath: 'css',
      // },
      // {
      //     test: /\.less$/,
      //     use: [
      //         'style-loader',
      //         'css-loader',
      //         // 将less文件编译成css文件
      //         // 需要下载 less-loader和less 这两个包
      //         'less-loader'
      //     ]
      // },
      // 从js文件中提取css文件
      {
        test: /\.css$/,
        use: [...commonCssLoaders],
      },
      {
        test: /\.less$/,
        use: [...commonCssLoaders, 'less-loader'],
      },

      //webpack 5 内置处理了图片的loader了
      {
        // 处理不了html中的图片资源
        test: /\.(jpg|png|gif)$/,
        // 使用一个loader
        // 下载 url-loader file-loader
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb，就会被base64处理
          // 优点: 减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求速度更慢）
          limit: 8 * 1024,
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          // 给图片进行重命名
          // [hash:10]取图片的hash的前10位
          // [ext]取文件原来扩展名
          name: '[hash:10].[ext]',
        },
        type: 'javascript/auto',
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader',
      },
      /*
            需要下载4个包 eslint-loader  eslint  eslint-config-airbnb-base  eslint-plugin-import
            语法检查： eslint-loader  eslint
            注意：只检查自己写的源代码，第三方的库是不用检查的
            设置检查规则：
                package.json中eslintConfig中设置~
                "eslintConfig": {
                    "extends": "airbnb-base"
                }
                airbnb --> eslint-config-airbnb-base  eslint-plugin-import
            */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: true,
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true,
        },
      },
      /*
            js兼容性处理：babel-loader @babel/core 
            1. 基本js兼容性处理 --> @babel/preset-env
                问题：只能转换基本语法，如promise高级语法不能转换
            2. 全部js兼容性处理 --> @babel/polyfill  
                问题：我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了~
            3. 需要做兼容性处理的就做：按需加载  --> core-js
            */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: {
                  version: 3,
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17',
                },
              },
            ],
          ],
        },
      },
      {
        exclude: /\.(css|js|html|less|jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
        },
      },
    ],
  },

  plugins: [
    // html-webpack-plugin
    // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
    // 需求：需要引入自定义的文件
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css',
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  // mode: "development",
  mode: 'production',

  // // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
  // // 特点：只会在内存中编译打包，不会有任何输出
  // // 启动devServer指令为：npx webpack-dev-server
  // devServer: {
  //     // 项目构建后路径
  //     static: './',
  //     // 启动gzip压缩
  //     compress: true,
  //     // 端口号
  //     port: 5000,
  //     // 自动打开浏览器
  //     open: true,
  // }
};
