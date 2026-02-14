const EslintWebpackplugin = require("eslint-webpack-plugin")
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//提取css文件为单独文件。
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//css压缩
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
//js压缩
const TerserWebpackPlugin = require("terser-webpack-plugin")
//图片压缩
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//复制文件
const CopyWebpackPlugin = require("copy-webpack-plugin");
//处理.vue文件
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require('webpack')

const getStyleLoaders = (pre) => {
    return [
        //这个不用变，还是用MiniCssExtractPluginr提取css文件
        MiniCssExtractPlugin.loader,
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
        path:path.resolve(__dirname, '../dist'),
        filename:'static/js/[name].[contenthash:10].js',
        chunkFilename:'static/js/[name].[contenthash:10].chunk.js',
        assetModuleFilename:'static/media/[hash:10][ext][query]',
        clean: true,
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
        new MiniCssExtractPlugin({
            filename:'static/css/[name].[contenthash:10].css',
            chunkFilename:'static/css/[name].[contenthash:10].chunk.css'
        }),
        new CopyWebpackPlugin({
            patterns:[
                {
                    from:path.resolve(__dirname,'../public'),
                    to:path.resolve(__dirname,'../dist'),
                    globOptions:{
                        ignore:['**/index.html']
                    }
                }
            ]
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
        })
    ],
    mode: "production",
    devtool: 'source-map',
    optimization :{
        splitChunks:{
            chunks:'all',
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`
        },
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                }
            })
        ]

    },
    //Webpack 默认不自动解析 .jsx 后缀，而 App 组件文件名为 App.jsx，但在 main.js 中引入时写的是 import App from './App'（省略了后缀）。
    // 在 webpack.dev.js 中添加了 resolve.extensions 配置，告诉 Webpack 在引入模块时自动尝试补全 .jsx、.js 和 .json 后缀。
    resolve: {
        extensions: ['.vue', '.js', '.json']
    }

}
