# fis-postprocessor-smarty-hmr

<p align="left">
    <a href="https://www.npmjs.com/package/fis-postprocesscor-smarty-hmr"><img src="https://img.shields.io/npm/v/fis-postprocessor-smarty-hmr.svg" alt="Downloads"></a>
    <a href="https://www.npmjs.com/package/fis-postprocesscor-smarty-hmr"><img src="https://img.shields.io/npm/dm/fis-postprocessor-smarty-hmr.svg" alt="Version"></a>
    <a href="https://www.npmjs.com/package/fis-postprocesscor-smarty-hmr"><img src="https://img.shields.io/npm/l/fis-postprocessor-smarty-hmr.svg" alt="Licence"></a>
</p>

fis postprocessor to smarty for connect a remote page with local hmr server.

Use it with `Webpack` !

## Usage

### Installation

```bash
$ npm i fis-postprocessor-smarty-hmr
```

### Setting fis-conf.js

1. Setting hotreload.port

```js
// Example
fis.set('hotreload.port', '8888');
```

2. Setting to smarty

By setting `config` to fis postprocessor. May contain multiple pages.

```js
// Example
fis.match('*.tpl', {
    postprocessor: fis.plugin('smarty-hmr', {
        // global exclude (fuzzy match)
        globalExcludeRequire: 'bootstrap.css',
        config: [{
            pagePath: 'page/index.tpl',
            bundleName: 'bundle.js',
            blockName: 'top-head-extend',
            excludeRequire: 'a.js', // can use string or array, eg, exclude: ['a.js', 'b.js'], 
            valid: true
        }]
    }),
});
```

### global exclude require

While the postprecessor works in hot mode (via set env `process.env.HOT = 'true'`), it will delete all `{%require name='xxx'%}` statements. (config rules hitted is addtional premise).

So if we need to keep something NOT deleted from precessor, set `globalExcludeRequire` in settings.

Once set, It will affect all tpls.

If we need to exclude to certain tpl, config it with `excludeRequire` in config rules.


### Config item options

|options|description|type|required|default|
|---|---|---|---|---|
|pagePath|path to page| String |`YES` | - |
|bundleName|bundle file name | String | `YES` | - |
|blockName|which smarty block to inject bundle file |String| `OPTIONAL` | `top-head-extend` |
|excludeRequire| exclude js name | String or Array | `OPTIONAL` | - |
|valid|if this rules is valid| Boolean | `OPTIONAL` | true |

### Starting via fis release 

You need to set env `HOT=true` and start `fis release`: 

Intergration in `npm script`:

```bash
$ npm i cross-env -S
```

```js
"scripts": {
  "release": "cross-env HOT=true fis3 release",
}
```

By running command in cli:

```bash
$ npm run release -- [fis3 media]
```

