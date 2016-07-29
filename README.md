# cssobj-mithril

Apply cssobj local class names into mithril.

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

Please see **test** folder for more info.

## API

### `var mc = cssobj_mithril( result, m )`

#### *PARAMS*

#### `result`

**cssobj() result** Object, with `local=true`, or `local=false`.

#### `m`

**mithril m** Method, can be omitted if it's in global space.

#### *RETURN*

**mithril m** pre processer Method, will lookup the cssobj result object for localized class names.

The below 2 codes is equivalent:

```javascript
return mc('li.item', {class:'active news'})
```

```javascript
return m( result.map('li.item'), {class: result.map2('active news')} )
```

See, it's simplify the usage for cssobj with mithril.



