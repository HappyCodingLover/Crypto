const webpack = require('webpack')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var defaultInclude = path.join(__dirname, '.', 'src');
console.log(defaultInclude)
module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?|.tsx?$/,
                use: [{ loader: 'babel-loader' }],
                include: defaultInclude

            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
                include: defaultInclude
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
                include: defaultInclude
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: 'css-modules-typescript-loader' },
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }]


            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
                include: defaultInclude
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    entry: "./src/index.tsx",
    output: { path: path.join(__dirname, "build"), filename: "index.bundle.js" },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js",".jsx",".scss"],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "os": false,
            "https":false,
            "http":false,
            "crypto":false,
            "buffer":false,
            "process":false,
            "assert":false
        },
        alias: {
            process: "process/browser"
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "build"),
        stats: {
            colors: true,
            chunks: false,
            children: false
        },
        port:3000,
        hot: true,
        historyApiFallback:true,
        after: function () {
            // openBrowser(`http://localhost:${config.devPort}`)
        }
    }
};