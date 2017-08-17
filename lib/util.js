module.exports = {
  getType: function (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  },
  getIp: function () {
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
  },
  escapeStr: function (str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }
};
