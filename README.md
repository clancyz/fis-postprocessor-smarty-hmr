# fis-postprocessor-smarty-hmr

fis postprocessor to smarty for connect a remote page with local hmr server.

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
        config: [{
            pagePath: 'page/index.tpl',
            bundleName: 'bundle.js',
            blockName: 'top-head-extend',
            exclude: 'a.js',
            // exclude: ['a.js', 'b.js'],            
            valid: true
        }]
    }),
});
```

### Config item options

|options|description|type|required|default|
|---|---|---|---|---|
|pagePath|path to page| String |`YES` | - |
|bundleName|bundle file name | String | `YES` | - |
|blockName|which smarty block to inject bundle file |String| `OPTIONAL` | `top-head-extend` |
|exclude| exclude js name | String or Array | `OPTIONAL` | - |
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

