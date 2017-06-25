/*
 * fis-preprocessor-smarty-hmr
 * http://fis.baidu.com/
 */

'use strict';


module.exports = function(content, file, settings){
    if (!process.env.HOT) {
        return content;
    }
    var config = settings.config;

    // get local ip
    var ip = fis.config.get('hotreload.ip') || getIp();
    
    // get port 
    var port = fis.config.get('hotreload.port');

    if (!ip || !port) {
        return content;
    }

    // LET RAPX GO
    var exclude = ['rap.plugin.js'];

    if (config.exclude) {
        switch(getType(config.exclude)) {
            case 'String':
                exclude.push(config.exclude);
                break;
            case 'Array':
                exclude.concat(config.exclude);
        }
    }
    
    // see if matches
    var match;
    for (var i = 0, length = config.length; i < length; i++) {
        var item = config[i];
        // see this page exists or not
        if (!fis.util.exists(item.tpl)) {
            continue;
        }
        var reg = new RegExp(item.tpl + '$', 'i');
        if(reg.test(settings.filename)) {
            match = item;
            break;
        }
    }

    if (!match) {
        return content;
    }

    // if has require, delete it

    var requireRegex = /^({)?[^}]*require(.)?[^\n}]*(})?/gm;

    var matchArr = content.match(requireRegex);

    for(var j = 0, matchLength = matchArr.length; i < matchLength; i++) {
        var matchItem = matchArr[i];
        var needReplace = true;
        for (var k = 0, excludeLength = exclude.length; k < excludeLength; k ++) {
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
    // var blockExp = /^{[^}]*block[^}]*top-head-extend[^}]*%[^}]*}$/gm;
    var hotURL = 'http://' + ip + ':' + port + '/' + match.bundleName;
    var hotScript = '{%script%}require.loadJs(\"' + hotURL +'\"){%/script%}';
    return content.replace(blockExp, '$1\r\n\t' + hotScript);
};


function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}


function getIp() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ips = [];
    var ret = ''
    Object.keys(ifaces).forEach(function (ifname) {
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }

        ips.push(iface.address);
      });
    });

    ips.every(function(v) {
        if (v.indexOf('172') >= 0) {
            ret = v;
            return false;
        }
        return true;
    })
    return ret;
}

function escapeStr (str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
}