/* global m */

/* Removed from v2.0.0, pass M or use global m */
// import m from 'mithril'

function is (object, type) {
  return {}.toString.call(object) === '[object ' + type + ']'
}

function getAllClassString(attrs) {
  var str = (attrs.class||'') + ' ' + (attrs.className||'')
  return str.trim().split(/\s+/).join(' ')
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function testAttr (attrs, attr, val) {
  let keys = /^(.*?)([~|*$^])?$/.exec(attr)
  if(!keys) return false
  let testKey = keys[1]
  let testVal = attrs[testKey]
  let sign = keys[2]||''

  if(!sign && /^(class|className)$/.test(testKey)) {
    sign = '~'
    testVal = getAllClassString(attrs)
    val = val.trim().split(/\s+/)
  }

  return [].concat(val).every(function(v){
    const escapedVal = escapeRegExp(v)
    // console.log(v, escapedVal, sign, testVal)
    switch(sign) {
      case '':
        return v ? v == testVal : testKey in attrs
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

function queryVnode (vnode, query, store) {
  store = store || []
  if(Array.isArray(vnode)) {
    vnode.forEach(function(v){
      queryVnode(v, query, store)
    })
    return store
  }
  if(!vnode || !vnode.tag) return
  let match = true
  if(query.attrs) {
    for(let key in query.attrs) {
      match = testAttr(vnode.attrs, key, query.attrs[key])
      if(!match) break
    }
  }
  if (query.tag && query.tag!=vnode.tag) {
    match = false
  }
  if(match) store.push(vnode)
  if(Array.isArray(vnode.children)) {
    vnode.children.forEach(function(v){
      queryVnode(v, query, store)
    })
  }
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

    c.queryVnode = function(vnode, query) {
      if(typeof query=='string') {
        const hasTag = /^\w+/.test(query)
        query = c(query)
        if(!hasTag) delete query.tag
      }
      return queryVnode(vnode, query)
    }

    c.query = function(vnode, query){
      var nodes = []
      c.queryVnode(vnode, query).forEach(function(v){
        if(Array.isArray(v.nodes)) nodes = nodes.concat(v.nodes)
      })
      return nodes
    }

    return c
  }

  factory.m = M

  return factory
}

