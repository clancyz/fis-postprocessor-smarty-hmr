/*
 * fis-postprocessor-smarty-hmr
 * @author clancyz
 * https://github.com/clancyz/fis-postprocessor-smarty-hmr
 * http://fis.baidu.com/
 */

'use strict';

var _ = require('./util');

module.exports = function (content, file, settings) {
  if (process.env.HOT !== 'true') {
    return content;
  }

  var fis = global.fis;

  var config = settings.config;

  // get local ip
  var ip = fis.config.get('hotreload.ip') || _.getIp();

  // get port 
  var port = fis.config.get('hotreload.port');

  if (!ip) {
    fis.log.warn('Sorry, ip address not found');
    return content;
  }
  if (!port) {
    fis.log.warn('hotreload.port not found, please set in fis conf. Example: fis.set("hotreload.port", 2333)');
    return content;
  }

  // LET RAPX GO
  var exclude = ['rap.plugin.js'];

  if (config.exclude) {
    switch (_.getType(config.exclude)) {
      case 'String':
        exclude.push(config.exclude);
        break;
      case 'Array':
        exclude = exclude.concat(config.exclude);
        break;
    }
  }

  // see if matches
  var matchedConfig;
  for (var i = 0, length = config.length; i < length; i++) {
    var item = config[i];
    // see this page exists or not
    if (!fis.util.exists(item.pagePath) || item.valid === false) {
      continue;
    }
    var reg = new RegExp(item.pagePath + '$', 'i');
    if (reg.test(settings.filename)) {
      matchedConfig = item;
      break;
    }
  }

  if (!matchedConfig) {
    return content;
  }

  // if has require, delete it
  // match as {%require name="namespace:dist/static/app.js"%}
  var requireInBlocksRegex = /{[^}"=]*?require.?[^}]*}$/gm;

  // match as require("namespace:dist/static/app.js")
  var requireInScriptsRegex = /require((\s)*\(|(\s)*\.(\s)*[a-zA-Z]*(\s)*\()[^)]*\)/gm;

  var matchRequireInBlocksArr = content.match(requireInBlocksRegex) || [];

  var matchRequireInScriptsArr = content.match(requireInScriptsRegex) || [];

  var matchArr = matchRequireInBlocksArr.concat(matchRequireInScriptsArr);

  for (var j = 0, matchLength = matchArr.length; j < matchLength; j++) {
    var matchItem = matchArr[j];
    var needReplace = true;
    for (var k = 0, excludeLength = exclude.length; k < excludeLength; k++) {
      if (matchItem.indexOf(exclude[k]) >= 0) {
        needReplace = false;
        break;
      }
    }
    if (needReplace) {
      var replaceReg = new RegExp(_.escapeStr(matchItem), 'gmi');
      content = content.replace(replaceReg, '');
    }
  }

  // insert script via config
  // see if settings contains blockName 
  var blockName = 'top-head-extend';
  if (matchedConfig && matchedConfig.blockName) {
    blockName = matchedConfig.blockName;
  }
  var blockExp = new RegExp('(^{[^}]*block[^}]*' + blockName + '[^}]*%[^}]*}$)', 'gm');
  if (!content.match(blockName)) {
    fis.log.warn('Cannot find match block in ' + settings.filename + '. Try to match blockName:' + blockName);
  }
  var hotURL = 'http://' + ip + ':' + port + '/' + matchedConfig.bundleName;
  var hotScript = '{%script%}require.loadJs(\"' + hotURL + '\"){%/script%}';
  return content.replace(blockExp, '$1\n' + hotScript);
};
