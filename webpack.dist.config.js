var webpack = require('webpack');
var path = require('path');
var GitRevisionPlugin = require('git-revision-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    entry: path.join(__dirname, 'src/app.ts'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'game.min.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
            phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
            p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
            assets: path.join(__dirname, 'assets/')
        }
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildStart: ['npm run assets']
        }),
        new webpack.DefinePlugin({
            'DEBUG': false,
            'GIT_REVISION': JSON.stringify(new GitRevisionPlugin().commithash()),

            // Do not modify these manually, you may break things...
            'DEFAULT_GAME_WIDTH': /*[[DEFAULT_GAME_WIDTH*/1024/*DEFAULT_GAME_WIDTH]]*/,
            'DEFAULT_GAME_HEIGHT': /*[[DEFAULT_GAME_HEIGHT*/640/*DEFAULT_GAME_HEIGHT]]*/,
            'MAX_GAME_WIDTH': /*[[MAX_GAME_WIDTH*/1136/*MAX_GAME_WIDTH]]*/,
            'MAX_GAME_HEIGHT': /*[[MAX_GAME_HEIGHT*/768/*MAX_GAME_HEIGHT]]*/,
            'SCALE_MODE': JSON.stringify(/*[[SCALE_MODE*/'USER_SCALE'/*SCALE_MODE]]*/),

            // The items below most likely the ones you should be modifying
            'GOOGLE_WEB_FONTS': JSON.stringify([ // Add or remove entries in this array to change which fonts are loaded
                'Barrio'
            ]),
            'SOUND_EXTENSIONS_PREFERENCE': JSON.stringify([ // Re-order the items in this array to change the desired order of checking your audio sources (do not add/remove/modify the entries themselves)
                'webm', 'ogg', 'm4a', 'mp3', 'aac', 'ac3', 'caf', 'flac', 'mp4', 'wav'
            ])
        }),
        new CleanWebpackPlugin([
            path.join(__dirname, 'dist')
        ]),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            screw_ie8: true
        }),
        new HtmlWebpackPlugin({
            title: 'Phaser NPM Webpack TypeScript Starter Project!',
            template: path.join(__dirname, 'templates/index.ejs')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
        }
    },
    module: {
        noParse: [
            /phaser-ce/
        ],
        rules: [
            { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
            { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};

