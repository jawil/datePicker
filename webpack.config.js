const path = require('path')
const webpack = require("webpack")
const CleanPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

//设置输入和输出根目录
const ROOT_PATH = path.resolve(__dirname)
const BUILD_PATH = path.resolve(__dirname, 'dist')


module.exports = {
    entry: './src/index.js',
    output: {
        path: BUILD_PATH,
        library: 'dataPicker',
        libraryTarget: 'umd',
        filename: "date-picker.min.js"
    },

    devtool: false,

    module: {
        rules: [{
            test: /\.js$/,
            loader: "eslint-loader",
            exclude: /node_modules/,
            enforce: 'pre'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: ['es2015'],
                plugins: [
                    ["transform-runtime"]
                ]
            }
        }]
    },
    plugins: [
        new CleanPlugin([BUILD_PATH]),
        new HtmlWebpackPlugin({
            filename: "index.html", //生成的html存放路径，相对于 path
            template: "./src/index.html",
            inject: true, //允许插件修改哪些内容，包括head与body
            hash: true, //为静态资源生成hash值
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false
            },
            comments: false,
            beautify: false,
            sourceMap: false
        })
    ]
}