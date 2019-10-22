process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const paths = require('react-scripts/config/paths');
const webpack = require('webpack');
const importCwd = require('import-cwd');
const config = importCwd('react-scripts/config/webpack.config')('production')
const colors = require('colors');

var entry = config.entry;
var plugins = config.plugins;

entry = entry.filter(fileName => !fileName.match(/webpackHotDevClient/));
plugins = plugins.filter(plugin => !(plugin instanceof webpack.HotModuleReplacementPlugin));

config.entry = entry;
config.plugins = plugins;

console.log("Building Frontend".bold.green)

webpack(config).watch({}, (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    copyPublicFolder();
  }
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));
});

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml
  });
}