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

```bash
npm install cssobj/cssobj-mithril
```

## Usage

Used with cssobj as below:

```javascript
var cssobj = require('cssobj')
var cssobj_mithril = require('cssobj-mithril')

var result = cssobj(obj)

// instead of:
// var m = require('mithril')
// using below:
var m = cssobj_mithril(result)

var component = {
  view: function(){

    return m('li.item', {class:'news !active'})

    // rendered with cssobj local class names:
    // <li class="_4vsdei1_item _4vsdei1_news active">
  }
}
```

Then use `m` in all cases, with the benefit for auto apply localized class names for **classes**

Please see **test/** folder for more info.

## API

### `var m = cssobj_mithril( result, m )`

#### *PARAMS*

#### `result`

**cssobj() result** Object, with `local=true`, or `local=false`.

#### `m`

**mithril m** Function, can be omitted if it's in global space.

#### *RETURN*

#### `m`

**mithril m** pre processer Function(`m`), will lookup the cssobj result object for localized class names.

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



