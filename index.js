/*
 * fis-preprocessor-smarty-hmr
 * @author clancyz
 * https://github.com/clancyz/fis-preprocessor-smarty-hmr
 * http://fis.baidu.com/
 */

'use strict';

module.exports = function (content, file, settings) {
  if (!process.env.HOT) {
    return content;
  }
  var config = settings.config;

  // get local ip
  var ip = fis.config.get('hotreload.ip') || getIp();

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
    switch (getType(config.exclude)) {
      case 'String':
        exclude.push(config.exclude);
        break;
      case 'Array':
        exclude = exclude.concat(config.exclude);
        break;
    }
  }

  // see if matches
  var match;
  for (var i = 0, length = config.length; i < length; i++) {
    var item = config[i];
    // see this page exists or not
    if (!fis.util.exists(item.pagePath) || item.valid === false) {
      continue;
    }
    var reg = new RegExp(item.pagePath + '$', 'i');
    if (reg.test(settings.filename)) {
      match = item;
      break;
    }
  }

  if (!match) {
    return content;
  }

  // if has require, delete it

  var requireRegex = /^({)?[^}]*require(.)?[^\n}]*(})?/gm;

  var matchArr = content.match(requireRegex) || [];

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
      var replaceReg = new RegExp(escapeStr(matchItem), 'gmi');
      content = content.replace(replaceReg, '');
    }
  }

  // insert script via config
  // see if settings contains blockName 
  var blockName = matchItem.blockName || 'top-head-extend';
  var blockExp = new RegExp('(^{[^}]*block[^}]*' + blockName + '[^}]*%[^}]*}$)', 'gm');
  if (!content.match(blockName)) {
    fis.log.warn('Cannot find match block in ' + settings.filename + '. Try to match blockName:' + blockName);
  }
  var hotURL = 'http://' + ip + ':' + port + '/' + match.bundleName;
  var hotScript = '{%script%}require.loadJs(\"' + hotURL + '\"){%/script%}';
  return content.replace(blockExp, '$1\r\n\t' + hotScript);
};

function getType (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function getIp () {
  var os = require('os');
  var ifaces = os.networkInterfaces();
  var ips = [];
  var ret = '';
  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        return;
      }

      ips.push(iface.address);
    });
  });

  ips.every(function (v) {
    if (v.indexOf('172') >= 0) {
      ret = v;
      return false;
    }
    return true;
  });

  if (ret === '') {
    ret = ips[0];
  }
  return ret;
}

function escapeStr (str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
