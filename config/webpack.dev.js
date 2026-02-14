const EslintWebpackplugin = require("eslint-webpack-plugin")
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
//处理.vue文件
const { VueLoaderPlugin } = require('vue-loader');

const getStyleLoaders = (pre) => {
    return [
        //处理css, vue-style-loader
        'vue-style-loader',
        'css-loader',
        {
            //添加postcss, 处理css兼容性处理
            //配合package.json的browserslist选项。
            loader:'postcss-loader',
            options: {
                postcssOptions: {
                    //css兼容性处理
                    plugins: ['postcss-preset-env']
                }
            }
        },
        pre
    ].filter(Boolean)
}
module.exports = {
    entry: './src/main.js',
    output: {
        path:undefined,
        filename:'static/js/[name].js',
        chunkFilename:'static/js/[name].chunk.js',
        assetModuleFilename:'static/media/[hash:10[ext][query]]'
    },
    module:{
        rules:[
            //处理css
            {
                test:/\.css$/,
                use:getStyleLoaders()
            },
            //处理less
            {
                test:/\.less$/,
                use:getStyleLoaders("less-loader")
            },
            //处理sass
            {
                test:/\.s[ac]ss$/,
                use:getStyleLoaders("sass-loader")
            },
            //处理图片
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    }
                }
            },
            //处理其他资源
            {
                test:/\.(woff2?|ttf|otf)/,
                type:'asset/resource',
            },
            //处理js
            {
                test:/\.js?$/,
                exclude:/node_modules/,
                loader:"babel-loader",
                options: {
                   cacheDirectory:true, //缓存
                   cacheCompression:false, //开发环境不压缩
                   presets: ["@vue/cli-plugin-babel/preset"], //babel-preset-react-app
                },
            },
            //处理vue文件
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            }

        ]

    },
    plugins:[
        new EslintWebpackplugin({
            context: path.resolve(__dirname,'../src'),
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname,'../node_modules/.cache/.eslintcache'),
            // 显式指定使用旧版配置 (eslintrc)
            configType: 'eslintrc'
        }),
        //处理html
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new VueLoaderPlugin(),
        /**
         * 因为 Vue 3 的 esm-bundler 构建版本需要一些全局变量来控制特性开关（Feature Flags），以便在生产环境中进行更好的 Tree-shaking。
         * 修改了 config/webpack.dev.js，引入了 webpack.DefinePlugin 并配置了缺失的全局变量：*/
        new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
        })

    ],
    mode: "development",
    devtool: 'cheap-module-source-map',
    optimization :{
        splitChunks:{
            chunks:'all',
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`
        }
    },
    devServer: {
        host:'localhost',
        port:3001,
        hot:true,
        open:true,
        historyApiFallback:true, // 解决前端路由刷新404问题
    },
    //Webpack 默认不自动解析 .jsx 后缀，而 App 组件文件名为 App.jsx，但在 main.js 中引入时写的是 import App from './App'（省略了后缀）。
    // 在 webpack.dev.js 中添加了 resolve.extensions 配置，告诉 Webpack 在引入模块时自动尝试补全 .jsx、.js 和 .json 后缀。
    resolve: {
        extensions: ['.vue', '.js', '.json']
    }

}
