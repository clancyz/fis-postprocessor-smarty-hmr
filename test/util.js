var _ = require('../lib/util');

module.exports = {
  replaceScript: function (content) {
    var ip = _.getIp();
    var port = 2333;
    var hotURL = 'http://' + ip + ':' + port + '/' + 'widget.a.js';
    var hotScript = '{%script%}require.loadJs(\"' + hotURL + '\"){%/script%}';
    return content.replace(/\{\%\*SCRIPT_INSERT\*\%\}/, hotScript);
  },
  getIp: _.getIp
}