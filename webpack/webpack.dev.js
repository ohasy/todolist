const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const appDirectoy = fs.realpathSync(process.cwd());
console.log(appDirectoy);
const resolveAppPath = relativePath => path.resolve(appDirectoy, relativePath);

const host = process.env.HOST || "localhost";

process.env.NODE_ENV = 'development';

module.exports = {
    mode: "development",
    entry: resolveAppPath("src"),
    output: {
        filename: 'static/js/budle.js'
    },
    devServer: {
        contentBase: resolveAppPath('public'),
        compress: true,
        hot: true,
        host,
        port: 3000,
        publicPath: '/'
    },
    plugins: [
            // Re-generate index.html with injected script tag.
    // The injected script tag contains a src value of the
    // filename output defined above.
        new HtmlWebpackPlugin({
            inject: true,
            template: resolveAppPath('public/index.html')
        }),
        new NodePolyfillPlugin()
        
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: resolveAppPath('src'),
                loader: 'babel-loader',
                options: {
                    presets: [
                        require.resolve('babel-preset-react-app')
                    ]
                }
            }
        ]
    }
}