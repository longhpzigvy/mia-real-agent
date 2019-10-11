/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = require('./webpack.base.babel')({
  mode: 'development',

  // Add hot reloading in development
  entry: [
    path.join(process.cwd(), 'server/index.js'), // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: 'index.js',
  },

  // Add development plugins
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
  ],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',

  performance: {
    hints: false,
  },
});
