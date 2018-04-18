define(function () { 'use strict';

/* global m */

/* Removed from v2.0.0, pass M or use global m */
// import m from 'mithril'

function is (object, type) {
  return {}.toString.call(object) === '[object ' + type + ']'
}


function splitSelector (sel, splitter) {
  if (sel.indexOf(splitter) < 0) { return [sel] }
  var pair = {'[': ']', '(': ')'};
  var left = 0, right = 0, instr = '', closeChar='', prev = 0, d = [];
  for (var c, i = 0; c = sel.charAt(i); i++) {
    if (instr) {
      if (c == instr) { instr = ''; }
      continue
    }
    if (c == '"' || c == '\'') { instr = c; }
    if (c in pair) { left++, closeChar = pair[c]; }
    if (c == closeChar && right<left) { right++; }
    if (left==right && c == splitter) { d.push(sel.substring(prev, i)), prev = i + 1; }
  }
  return d.concat(sel.substring(prev))
}


// get div:not(.p).abc to parts
// {normal: [], not: []}
function _getSelectorParts (sel, store) {
    store = store || {};
    store.normal = store.normal || [];
    sel = sel.trim();
    if(!sel) { return store }
    var parts = splitSelector(sel, ':');
    var first = parts.shift();
    if(first) { store.normal.push(first); }
    parts.forEach(function(v){
      var rest = splitSelector(v, ')');
      var pseudo = rest.shift().match(/^(\w+)\((.*)$/);
      var last = rest.join(')');
      if(!pseudo) { throw Error('invalid selector') }
      var key = pseudo[1];
      var middle = pseudo[2];
      store[key] = store[key] || [];
      store[key].push(middle);
      if(last) { _getSelectorParts(last, store); }
    });
  return store
}

function getSelectorParts(cssSel){
  return splitSelector(cssSel, ',').map(function(sel){
    return _getSelectorParts(sel)
  })
}
// console.log(getSelectorParts('p:not(.abc).xyz:not(.iii)'))


function getAllClassString(attrs) {
  var str = (attrs.class||'') + ' ' + (attrs.className||'');
  return str.trim().split(/\s+/).join(' ')
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function testAttr (vnodeAttrs, queryAttrs, key) {
  var val = queryAttrs[key];
  var keys = /^(.*?)([~|*$^])?$/.exec(key);
  if(!keys) { return false }
  var keyName = keys[1];
  var testVal = vnodeAttrs[keyName];
  var sign = keys[2]||'';

  if(keyName=='class' && !(keyName in vnodeAttrs)) {
    keyName = 'className';
  }
  if(!sign && /^(class|className)$/.test(keyName)) {
    sign = '~';
    testVal = getAllClassString(vnodeAttrs);
    val = val.trim().split(/\s+/);
  }

  return [].concat(val).every(function(v){
    var escapedVal = escapeRegExp(v);
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
  store = store || [];
  depth = depth || 0;
  if(Array.isArray(vnode)) {
    vnode.forEach(function(v){
      queryVnode(v, query, depth, store);
    });
    return store
  }
  if(!vnode || !vnode.tag) { return }
  if(depth >= query.fromDepth) {
    var match = true;
    if(query.attrs) {
      for(var key in query.attrs) {
        match = testAttr(vnode.attrs, query.attrs, key);
        // console.log(match, vnode, query, key)
        if(query.pseudo=='not') { match=!match; }
        if(query.meta.not) { match=!match; }
        if(!match) { break }
      }
    }
    if (query.tag && query.tag!=vnode.tag) {
      match = false;
    }
    if(match && store.indexOf(vnode)<0) { store.push(vnode); }
  } else {
    // console.log(depth, 'skip')
  }
  if(query.depth > depth) {
    queryVnode(vnode.children, query, depth+1, store);
  }
  // console.log(store)
  return store
}

function bindM (M) {
  M = M || m;
  if (!M) { throw new Error('cannot find mithril, make sure you have `m` available in this scope.') }

  var mapClass = function (cssobjResult, attrs) {
    if (!is(attrs, 'Object')) { return }
    var classAttr = 'class' in attrs ? 'class' : 'className';
    var classObj = attrs[classAttr];
    if (classObj) {
      attrs[classAttr] = cssobjResult.mapClass(classObj);
    }
  };

  var factory = function (cssobjResult) {
    var c = function (tag, pairs) {
      var arguments$1 = arguments;

      var args = [];

      for (var i = 1, length = arguments.length; i < length; i++) {
        args[i - 1] = arguments$1[i];
      }

      if (is(tag, 'Object')) { return M.apply(null, [tag].concat(args)) }

      if (!is(tag, 'String')) {
        throw new Error('selector in m(selector, attrs, children) should be a string')
      }

      mapClass(cssobjResult, pairs);
      return M.apply(null, [cssobjResult.mapSel(tag)].concat(args))
    };

    c.old = M;

    for (var i in M) {
      c[i] = M[i];
    }

    c.result = cssobjResult;

    c.query = function(vnode, query, options) {
      var store = [];
      if(typeof query!='string') { return [] }
      options = options || {};
      var partsArr = getSelectorParts(query);
      // parts is array of {normal:[]...}
      partsArr.forEach(function(parts){
        var nodes = vnode;
        var first = true;
        for(var key in parts) {
          var selector = parts[key].join('');
          var hasTag = /^\w+/.test(selector);
          selector = (options.hyper || c)(selector);
          if(!hasTag) { delete selector.tag; }
          selector.pseudo = key;
          selector.depth = first 
            ? 'depth' in options 
              ? options.depth|0
              : Infinity 
            : 0;
          selector.fromDepth = first 
            ? 'fromDepth' in options
              ? options.fromDepth|0
              : 1
            : 0;
          selector.meta = options.meta || {};
          nodes = queryVnode(nodes, selector);
          // console.log(selector, 888, nodes)
          first = false;
        }
        store = store.concat(nodes);
      });

      addArrayMethods({
        query: function(str, options){
          return c.query(this, str, options)
        },
        get: function(str){
          return c.query(this, str, {fromDepth: 0, depth: 0})
        },
        not: function(str){
          return c.query(this, str, {fromDepth: 0, depth: 0, meta: {not: true} } )
        },
        nodes: function(){
          var nodes = [];
          this.forEach(function(v){
            if(Array.isArray(v.nodes)) { nodes = nodes.concat(v.nodes); }
          });
          return nodes
        }
      })(store);

      return store
    };

    return c
  };

  factory.m = M;

  return factory
}

var wrapperFactory = function(method){
  return function(){
    return this._addArrayMethods(Array.prototype[method].apply(this, arguments))
  }
};
function addArrayMethods (customMethods, options) {
  options = options || {};
  var method;
  var allMethods = {};
  var nativeMethods = options.natives || addArrayMethods.natives;
  for (var i = 0; i < nativeMethods.length; i++) {
    method = nativeMethods[i];
    if (!(method in Array.prototype)) { continue }
    allMethods[method] = wrapperFactory(method);
  }
  for (method in customMethods) {
    allMethods[method] = customMethods[method];
  }
  return function adder (arr) {
    allMethods._addArrayMethods = adder;
    for (method in allMethods) {
      if (options.es3) {
        arr[method] = allMethods[method];
      } else {
        Object.defineProperty(arr, method, {
          value: allMethods[method]
        });
      }
    }
    return arr
  }
}
addArrayMethods.natives = [
  'filter', 'slice', 'concat',
  'reverse', 'sort', 'splice',
  'map', 'fill', 'copyWithin'
];

return bindM;

});
