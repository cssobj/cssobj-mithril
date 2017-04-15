/* global m */

/* Removed from v2.0.0, pass M or use global m */
// import m from 'mithril'

function is (object, type) {
  return {}.toString.call(object) === '[object ' + type + ']'
}


function splitSelector (sel, splitter) {
  if (sel.indexOf(splitter) < 0) return [sel]
  var pair = {'[': ']', '(': ')'}
  var left = 0, right = 0, instr = '', closeChar='', prev = 0, d = []
  for (var c, i = 0; c = sel.charAt(i); i++) {
    if (instr) {
      if (c == instr) instr = ''
      continue
    }
    if (c == '"' || c == '\'') instr = c
    if (c in pair) left++, closeChar = pair[c]
    if (c == closeChar && right<left) right++
    if (left==right && c == splitter) d.push(sel.substring(prev, i)), prev = i + 1
  }
  return d.concat(sel.substring(prev))
}


// get div:not(.p).abc to parts
// {normal: [], not: []}
function _getSelectorParts (sel, store) {
    store = store || {}
    store.normal = store.normal || []
    sel = sel.trim()
    if(!sel) return store
    let parts = splitSelector(sel, ':')
    let first = parts.shift()
    if(first) store.normal.push(first)
    parts.forEach(function(v){
      let rest = splitSelector(v, ')')
      let pseudo = rest.shift().match(/^(\w+)\((.*)$/)
      let last = rest.join(')')
      if(!pseudo) throw Error('invalid selector')
      let key = pseudo[1]
      let middle = pseudo[2]
      store[key] = store[key] || []
      store[key].push(middle)
      if(last) _getSelectorParts(last, store)
    })
  return store
}

function getSelectorParts(cssSel){
  return splitSelector(cssSel, ',').map(function(sel){
    return _getSelectorParts(sel)
  })
}
// console.log(getSelectorParts('p:not(.abc).xyz:not(.iii)'))


function getAllClassString(attrs) {
  var str = (attrs.class||'') + ' ' + (attrs.className||'')
  return str.trim().split(/\s+/).join(' ')
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function testAttr (vnodeAttrs, queryAttrs, key) {
  let val = queryAttrs[key]
  let keys = /^(.*?)([~|*$^])?$/.exec(key)
  if(!keys) return false
  let keyName = keys[1]
  let testVal = vnodeAttrs[keyName]
  let sign = keys[2]||''

  if(keyName=='class' && !(keyName in vnodeAttrs)) {
    keyName = 'className'
  }
  if(!sign && /^(class|className)$/.test(keyName)) {
    sign = '~'
    testVal = getAllClassString(vnodeAttrs)
    val = val.trim().split(/\s+/)
  }

  return [].concat(val).every(function(v){
    const escapedVal = escapeRegExp(v)
    // console.log(v, escapedVal, sign, testVal)
    switch(sign) {
      case '':
        return v ? v == testVal : keyName in vnodeAttrs
      case '~':
        return new RegExp('\\b'+escapedVal+'\\b').test(testVal)
      case '|':
        return new RegExp('^'+escapedVal+'-?').test(testVal)
      case '*':
        return new RegExp(escapedVal).test(testVal)
      case '^':
        return new RegExp('^'+escapedVal).test(testVal)
      case '$':
        return new RegExp(escapedVal+'$').test(testVal)
    }
  })
}

function queryVnode (vnode, query, depth, store) {
  store = store || []
  depth = depth || 0
  if(Array.isArray(vnode)) {
    vnode.forEach(function(v){
      queryVnode(v, query, depth, store)
    })
    return store
  }
  if(!vnode || !vnode.tag) return
  if(depth >= query.fromDepth) {
    let match = true
    if(query.attrs) {
      for(let key in query.attrs) {
        match = testAttr(vnode.attrs, query.attrs, key)
        // console.log(match, vnode, query, key)
        if(query.pseudo=='not') match=!match
        if(!match) break
      }
    }
    if (query.tag && query.tag!=vnode.tag) {
      match = false
    }
    if(match && store.indexOf(vnode)<0) store.push(vnode)
  } else {
    // console.log(depth, 'skip')
  }
  if(query.depth-- > 0) {
    queryVnode(vnode.children, query, depth+1, store)
  }
  // console.log(store)
  return store
}

export default function bindM (M) {
  M = M || m
  if (!M) throw new Error('cannot find mithril, make sure you have `m` available in this scope.')

  const mapClass = function (cssobjResult, attrs) {
    if (!is(attrs, 'Object')) return
    const classAttr = 'class' in attrs ? 'class' : 'className'
    const classObj = attrs[classAttr]
    if (classObj) {
      attrs[classAttr] = cssobjResult.mapClass(classObj)
    }
  }

  const factory = function (cssobjResult) {
    const c = function (tag, pairs) {
      const args = []

      for (let i = 1, length = arguments.length; i < length; i++) {
        args[i - 1] = arguments[i]
      }

      if (is(tag, 'Object')) return M.apply(null, [tag].concat(args))

      if (!is(tag, 'String')) {
        throw new Error('selector in m(selector, attrs, children) should be a string')
      }

      mapClass(cssobjResult, pairs)
      return M.apply(null, [cssobjResult.mapSel(tag)].concat(args))
    }

    c.old = M

    for (let i in M) {
      c[i] = M[i]
    }

    c.result = cssobjResult

    c.query = function(vnode, query, options) {
      let store = []
      if(typeof query!='string') return []
      options = options || {}
      let partsArr = getSelectorParts(query)
      // parts is array of {normal:[]...}
      partsArr.forEach(function(parts){
        let nodes = vnode
        let first = true
        for(let key in parts) {
          let selector = parts[key].join('')
          const hasTag = /^\w+/.test(selector)
          selector = c(selector)
          if(!hasTag) delete selector.tag
          selector.pseudo = key
          selector.depth = first 
            ? 'depth' in options 
              ? options.depth|0
              : Infinity 
            : 0
          selector.fromDepth = 'fromDepth' in options 
            ? options.fromDepth|0
            : 1
          nodes = queryVnode(nodes, selector)
          first = false
        }
        store = store.concat(nodes)
      })
      store._addArrayMethods = addArrayMethods(
        ['filter', 'slice', 'concat', 'reverse', 'sort', 'splice'],
        {
          query: function(str, options){
            return c.query(this, str, options)
          },
          nodes: function(){
            var nodes = []
            this.forEach(function(v){
              if(Array.isArray(v.nodes)) nodes = nodes.concat(v.nodes)
            })
            return nodes
          }
        }
      )
      store._addArrayMethods(store)
      return store
    }

    return c
  }

  factory.m = M

  return factory
}

function addArrayMethods (nativeMethods, customMethods) {
  return function(arr) {
    arr._addArrayMethods = this._addArrayMethods
    nativeMethods.forEach(function(method){
      arr[method] = new Function('return this._addArrayMethods([].'+method+'.apply(this, arguments))')
    })
    for(let method in customMethods) {
      arr[method] = customMethods[method]
    }
    return arr
  }
}

