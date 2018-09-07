const webpack = require('webpack');
const path = require('path');

module.exports = (/* args, env */) => {
  const mode = process.env.NODE_ENV;

  return {
    mode,
    entry: { index: './app/index.ts' },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.scss/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                minimize: true,
                sourceMap: true,
                url: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(gif|png|jpg|svg)$/,
          loader: 'url-loader',
        },
      ],
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname),
    },
    optimization: {
      splitChunks: {
        name: 'common',
        chunks: 'all',
      },
    },
  };
};
