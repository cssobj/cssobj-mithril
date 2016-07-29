
import m from 'mithril'

var type = {}.toString

function isObject(object) {
	return type.call(object) === "[object Object]"
}

function isString(object) {
	return type.call(object) === "[object String]"
}

export default function bindM (cssStore, M) {
  M = M || m
  if (!M) throw new Error('cannot find mithril, make sure you have `m` available in this scope.')

  var applyMap2 = function (attrs) {
    if(!isObject(attrs)) return
    var classAttr = 'class' in attrs ? 'class' : 'className'
    var classObj = attrs[classAttr]
    if (classObj)
      attrs[classAttr] = cssStore.map2(classObj)
  }

  var c = function (tag, pairs) {
    var args = []

    for (var i = 1, length = arguments.length; i < length; i++) {
      args[i - 1] = arguments[i]
    }

    if(isObject(tag)) return M.apply(null, [tag].concat(args))

		if (!isString(tag)) {
			throw new Error("selector in m(selector, attrs, children) should " +
				"be a string")
		}

    applyMap2(pairs)
    return M.apply( null, [cssStore.map(tag)].concat(args) )
  }

  c.result = cssStore

  return c
}

