const path = require("path");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  const config = {
    entry: { main: "./src/js/app.js" },
    output: {
      // path: path.resolve(),
      publicPath: path.resolve(__dirname, "dist"),
      filename: "assets/js/bundle.js",
    },

    target: "node",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },

    module: {
      rules: [
        {
          // test: /\.js$/,
          // exclude: /node_modules/,
          test: /\.(js|jsx)$/,
          exclude: /node_modules\/(?!(dom7|ssr-window)\/).*/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            "style-loader",
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false,
              },
            },
            "css-loader",
            "postcss-loader",
            "resolve-url-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|webp)$/,
          include: path.join(__dirname, 'src', 'img'),
          loader: 'file-loader',
          options: {
            outputPath: (url, resourcePath, context) => {
              url = url.replace(/\\/ig, '/')
              url = url.replace('img/', 'assets/img/')
              return url
            },
            publicPath: (url, resourcePath, context) => {
              url = url.replace(/\\/ig, '/')
              url = url.replace('img/', '../img/')
              return url
            },
            regExp: /src\\(.*)/i,
            name: '[1]'
          }
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          include: path.join(__dirname, 'src', 'fonts'),
          loader: 'file-loader',
          options: {
            outputPath: (url, resourcePath, context) => {
              url = url.replace(/\\/ig, '/')
              url = url.replace('fonts/', 'assets/fonts/')
              return url
            },
            publicPath: (url, resourcePath, context) => {
              url = url.replace(/\\/ig, '/')
              url = url.replace('fonts/', '../fonts/')
              return url
            },
            regExp: /src\\(.*)/i,
            name: '[1]'
          }
        },

        /*
        {
          test: /\.(png|jpg|gif|svg|woff)$/,
          loader: 'file-loader',
          options: {
            outputPath: function (url, resourcePath, context) {
              "use strict";
              return url.replace(/src/i, 'assets');
            },
            name: '[path][name].[ext]'
          }
        }
        */
      ],
    },
    plugins: [
      new BrowserSyncPlugin({
        host: "localhost.loc",
        // proxy: 'rostec.loc',
        port: 3000,
        // files: [
        //     __dirname
        // ]
        server: { baseDir: ["dist"] },
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: "src/img/", to: "assets/img/" },
          { from: "src/fav/", to: "assets/fav/" },
          // {from: 'src/fonts/', to: 'assets/fonts/',}
        ],
      }),
      new ImageminPlugin({
        pngquant: {
          quality: "100",
        },
        disable: !isProduction,
        plugins: [
          imageminMozjpeg({
            quality: 90,
            progressive: true,
          }),
        ],
      }),
      // new CleanWebpackPlugin('dist', {} ),
      new MiniCssExtractPlugin({
        filename: "assets/css/styles.css",
      }),
      // new webpack.ProvidePlugin({
      //   $: "jquery",
      //   jQuery: "jquery",
      //   "window.jQuery": "jquery",
      // }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "./src/index.html",
        filename: "index.html",
      }),
    ],
  };

  return config;
};
