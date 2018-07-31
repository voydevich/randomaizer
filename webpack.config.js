const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    watch: true,
    cache: true,

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.(scss|css)$/,

                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },

    plugins: [new WebpackNotifierPlugin({alwaysNotify: true}), new UglifyJSPlugin({sourceMap: false, cache: false,})],

    entry: path.resolve(__dirname, 'react/index.js'),

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/js')
    },
    // mode: 'production',
    mode: 'development'
};
