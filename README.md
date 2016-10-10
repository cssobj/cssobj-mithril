# cssobj-mithril

[![Build Status](https://travis-ci.org/cssobj/cssobj-mithril.svg?branch=master)](https://travis-ci.org/cssobj/cssobj-mithril)

Apply cssobj local class names into mithril.

[SEE DEMO](https://cssobj.github.io/cssobj-mithril/test/)

## Why?

[cssobj](https://github.com/cssobj/cssobj) already have API for using with mithril as below:

``` javascript
var result = cssobj(obj)
... ...
view: function(){
  return m( result.mapSel('li.item'), {class: result.mapClass('active news')} )
}
```

But if you don't like the long `result.mapSel`, `result.mapClass` function, you can try this lib to simplify.

This lib is just syntax sugar for the above code.

To do this, we have to replace the `m` function with new `m`, see below.

## Install

**NPM**

```bash
npm install cssobj-mithril
```

**BOWER**

```bash
bower install cssobj-mithril
```


## Usage

Used with cssobj as below:

```javascript
// init mithril
var mithril = require('mithril')

// get a factory function from old mithril
var M = require('cssobj-mithril')(mithril)

// get cssobj result
var result = require('cssobj')(obj)

// **** replace m!! ****
var m = M(result)

// consume `m` as original way, don't change anything!
// except `selector` and `class` will accept `:global` and `!`
var component = {
  view: function(){

    return m('li.item', {class:'news !active'}, 'hello')

    // rendered DOM result:
    // <li class="_4vsdei1_item _4vsdei1_news active">hello</li>

  }
}
```

Use `m` in all cases as usual, with the benefit fo local class names.

Please see **test/** folder for more info.

## API

### `CommonJS: var m = require('cssobj-mithril')( m )( result )`
### `Global:   var m = cssobj_mithril( m )( result )`

#### *PARAMS*

#### `m` (optional)

Which **mithril m** function to inject, can be omitted if `m` already in global space.

#### `result`

**cssobj() result** Object, with `local=true`, or `local=false`.

#### *RETURN*

#### `m`

**mithril m** pre processor Function(`m`), will lookup the cssobj result object for local class names.

 - `m`: [Function] The signature is same as [m](http://mithril.js.org/mithril.html#signature)
 - `m.result`: [Object] Just a shortcut reference to `result` param passed in. `mc.result === result`
 - `m.old`: [Function] The old `mithril.m` reference

The below 2 codes are equivalent:

```javascript
view: function(){
  return m('li.item', {class:'active news'})
}
```

```javascript
view: function(){
  return m.old( result.mapSel('li.item'), {class: result.mapClass('active news')} )
}
```

See, it's simplify the usage for cssobj with mithril.



