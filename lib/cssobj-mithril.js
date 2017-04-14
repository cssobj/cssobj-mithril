/* global m */

/* Removed from v2.0.0, pass M or use global m */
// import m from 'mithril'

function is (object, type) {
  return {}.toString.call(object) === '[object ' + type + ']'
}

function sortClassOnVnode(vnode) {
  var vnodeStr = (vnode.attrs.class||'') + ' ' + (vnode.attrs.className||'')
  return vnodeStr.trim().split(/\s+/).sort().join()
}

function matchClass (findObj, vnode) {
  return sortClassOnVnode(vnode).indexOf(
    sortClassOnVnode(findObj)
  ) > -1
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

    c.queryVnode = function queryVNode (vnode, query, store) {
      if(!vnode || !vnode.tag) return
      if(typeof query=='string') {
        query = c(query)
      }
      store = store || []
      let match = true
      if(query.attrs) {
        for(let key in query.attrs) {
          if(/^(class|className)$/i.test(key)) match = matchClass(query, vnode)
          else if(query.attrs[key] != vnode.attrs[key]) match = false
          if(!match) break
        }
      }
      if (query.tag && query.tag!=vnode.tag) {
        match = false
      }
      if(match) store.push(vnode)
      if(Array.isArray(vnode.children)) {
        vnode.children.forEach(function(v){
          queryVNode(v, query, store)
        })
      }
      return store
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

