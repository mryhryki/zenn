const webpack = require('webpack');
const path = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (/* args, env */) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const mode = isDevelopment ? 'development' : 'production';
  const outputPath = path.resolve(__dirname, '..');

  return {
    mode,
    entry: { index: './index.ts' },
    devtool: (mode === 'development' ? 'inline-source-map' : undefined),
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
      // new BundleAnalyzerPlugin(),
    ],
    output: {
      filename: '[name].js',
      path: outputPath,
    },
    // optimization: {
    //   splitChunks: {
    //     name: 'common',
    //     chunks: 'all',
    //   },
    // },
    devServer: {
      contentBase: outputPath,
      hot: true,
      port: 4000,
    },
  };
};
