var fis = require('fis3');
var fisSmarty = require('fis3-smarty');
var path = require('path');
var config = fis.config;
var expect = require('chai').expect;
var smartyHMRPlugin = require('../lib'); 
var _ = require('./util');
var env = require('./env');

debugger;
// add smarty support
fisSmarty(fis);

describe('Compile tpl in proprecessor', function() {
  
  beforeEach(function() {
    process.env.HOT = true;
    fis.project.setProjectRoot(path.join(__dirname));
    fis.config.init();
    fis.media().init();
    fis.cache.clean('compile');
    fis.compile.setup();
    fis.set('hotreload.port', env.port);
    // fis.set('modules.postprocessor', smartyHMRPlugin);
    fis.match('*.tpl', {
      postprocessor: fis.plugin(smartyHMRPlugin, {
        globalExcludeRequire: 'bootstrap.css',
        config: [{
          pagePath: 'test/delete-require/before.tpl',
          bundleName: env.entryjs
        }, {
          pagePath: 'test/inject-script-custom-block/before.tpl',
          bundleName: env.entryjs,
          blockName: 'top-head-custom-extend'
        }, {
          pagePath: 'test/inject-script-default-block/before.tpl',
          bundleName: env.entryjs
        }, {
          pagePath: 'test/block-name-contains-require/before.tpl',
          bundleName: env.entryjs
        }, {
          pagePath: 'test/global-exclude-require/before.tpl',
          bundleName: env.entryjs
        }, {
          pagePath: 'test/single-exclude-require/before.tpl',
          bundleName: env.entryjs,
          excludeRequire: 'animate.css'
        }],
      })
    })
   
  });

  // it('Should insert hotscript statement in default block', function () {
  //   var file = fis.file(__dirname + '/inject-script-default-block/before.tpl');
  //   fis.compile(file);
  //   var expectedFile = fis.file(__dirname + '/inject-script-default-block/after.tpl'); 
  //   var expectedContent = _.replaceScript((expectedFile.getContent()));
  //   expect(file.getContent()).to.equal(expectedContent);
  // });

  // it('Should insert hotscript statement in custom block', function () {
  //   var file = fis.file(__dirname + '/inject-script-custom-block/before.tpl');
  //   fis.compile(file);
  //   var expectedFile = fis.file(__dirname + '/inject-script-custom-block/after.tpl'); 
  //   var expectedContent = _.replaceScript((expectedFile.getContent()));
  //   expect(file.getContent()).to.equal(expectedContent);
  // });

  // it('Should delete require statements', function() {
  //   var file = fis.file(__dirname + '/delete-require/before.tpl');
  //   fis.compile(file);
  //   var expectedFile = fis.file(__dirname + '/delete-require/after.tpl'); 
  //   var expectedContent = _.replaceScript(expectedFile.getContent());
  //   expect(file.getContent()).to.equal(expectedContent);
  // });

  // it('Should correctly parse blocks which name contains require', function () {
  //   var file = fis.file(__dirname + '/block-name-contains-require/before.tpl');
  //   fis.compile(file);
  //   var expectedFile = fis.file(__dirname + '/block-name-contains-require/after.tpl');
  //   var expectedContent = _.replaceScript(expectedFile.getContent());
  //   expect(file.getContent()).to.equal(expectedContent);
  // })

  // it('Should keep global exclude require resources', function() {
  //   var file = fis.file(__dirname + '/global-exclude-require/before.tpl');
  //   fis.compile(file);
  //   var expectedFile = fis.file(__dirname + '/global-exclude-require/after.tpl');
  //   var expectedContent = _.replaceScript(expectedFile.getContent());
  //   expect(file.getContent()).to.equal(expectedContent);
  // })

  it('Should keep single exclude require resources', function() {
    var file = fis.file(__dirname + '/single-exclude-require/before.tpl');
    fis.compile(file);
    var expectedFile = fis.file(__dirname + '/single-exclude-require/after.tpl');
    var expectedContent = _.replaceScript(expectedFile.getContent());
    console.log('expectedContent', expectedContent);
    console.log('actual', file.getContent());
    expect(file.getContent()).to.equal(expectedContent);
  })
});