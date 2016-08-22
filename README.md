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

To do this, we have to replace the `m` function with `mc`, as a pre-processer, see below.

## Install

```bash
npm install cssobj/cssobj-mithril
```

## Usage

Used with cssobj as below:

```javascript
var result = cssobj(obj)
var mc = cssobj_mithril(result, m) // m === mithril.m

var component = {
  view: function(){

    return mc('li.item', {class:'news !active'})

    // rendered with cssobj local class names:
    // <li class="_4vsdei1_item _4vsdei1_news active">
  }
}
```

Then `mc` can be used as `m` in all cases, with the benefit for auto apply localized class names for **classes**

Please see **test/** folder for more info.

## API

### `var mc = cssobj_mithril( result, m )`

#### *PARAMS*

#### `result`

**cssobj() result** Object, with `local=true`, or `local=false`.

#### `m`

**mithril m** Function, can be omitted if it's in global space.

#### *RETURN*

#### `mc`

**mithril m** pre processer Function(`mc`), will lookup the cssobj result object for localized class names.

 - `mc`: [Function] The signature is same as [m](http://mithril.js.org/mithril.html#signature)
 - `mc.result`: [Object] Just a shortcut reference to `result` param passed in. `mc.result === result`

The below 2 codes are equivalent:

```javascript
view: function(){
  return mc('li.item', {class:'active news'})
}
```

```javascript
view: function(){
  return m( result.mapSel('li.item'), {class: result.mapClass('active news')} )
}
```

See, it's simplify the usage for cssobj with mithril.



